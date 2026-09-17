---
title: "FinGPT 金融大模型推理部署优化报告"
published: 2026-07-05
description: "围绕 FinGPT-Forecaster，说明黑盒知识蒸馏与 INT8 量化学生模型的部署优化方案。"
tags: ["FinGPT", "大语言模型", "知识蒸馏", "INT8", "推理优化"]
category: "技术"
draft: false
comment: false
---
## 一、摘要

本项目面向 FinGPT-Forecaster 金融预测模型的推理部署优化任务。比赛要求参赛方案基于指定基线模型 fingpt-forecaster_sz50_llama2-7B_lora，在保证预测效果的前提下降低显存占用和单样本推理时延。根据当前代码包，推荐采用 submission_distillation 目录中的“黑盒知识蒸馏 + INT8 量化学生模型”作为正式技术方案。

该方案将原始 FinGPT 7B + LoRA 模型作为教师模型，离线生成 13 类涨跌幅标签或标签分布，再训练一个轻量的哈希字符 n-gram 线性学生模型。最终提交时 predictor.py 只加载 weights/student_int8.npz，不再加载 torch、transformers、peft 或 7B 大模型，从而显著降低运行期显存与时延。

需要特别说明：代码包中的 submission/predictor.py 还包含 FAST_HEURISTIC_MODE 启发式快速候选。该候选在资源指标上表现很好，但更容易被理解为“未基于基线模型压缩”的路线，合规风险高。本报告将其视为对照探索，不作为正式方案描述；正式报告建议围绕 submission_distillation 的蒸馏与量化路线展开。

## 二、赛题理解与评分目标

赛题的核心不是重新训练一个新的炒股模型，而是围绕指定的 FinGPT-Forecaster 基线模型做推理部署优化。优化目标可以概括为：模型更轻、推理更快、预测质量尽量接近基线。

| 评分项 | 满分 | 含义 | 优化方向 |
| --- | --- | --- | --- |
| U：显存效率 | 40 | 评测全程显存峰值相对基线的下降幅度 | 减少运行期加载模型规模，避免 7B 权重常驻显存 |
| V：推理时延 | 20 | 单样本平均推理时间相对基线的下降幅度 | 减少自回归生成与大模型前向计算 |
| W：预测精度 | 40 | 序数得分与方向准确率相对基线的比例 | 保持 13 类涨跌幅标签预测能力，输出可解析标签 |

判题入口固定为 /submission/predictor.py 中的 Predictor 类。判题机会先调用 load() 加载模型，然后对隐藏测试集中的每条 prompt 调用 predict(prompt)，并从返回文本中解析预测涨跌幅标签。因此，提交方案不仅要模型效果较好，还必须保证输出格式稳定。

## 三、当前代码结构

当前代码包包含两个主要提交方向：submission 为基线和快速启发式探索版本，submission_distillation 为蒸馏量化版本。按照比赛规则和可解释性要求，建议将 submission_distillation 作为报告和正式提交的主线。

| 路径 | 作用 | 报告中的定位 |
| --- | --- | --- |
| submission/predictor.py | 原始 7B + LoRA 加载路径，并带有 FAST_HEURISTIC_MODE 快速模式 | 实验探索，不作为主方案 |
| submission_distillation/predictor.py | 加载 INT8 学生权重并执行轻量推理 | 推荐正式提交入口 |
| submission_distillation/weights/student_int8.npz | 训练后量化的学生模型权重 | 正式提交权重文件 |
| submission_distillation/generate_teacher_cache.py | 调用指定教师模型生成硬标签蒸馏缓存 | 离线训练工具 |
| submission_distillation/generate_teacher_score_cache.py | 调用教师模型计算 13 类标签得分分布 | 更充分的软标签蒸馏工具 |
| submission_distillation/train_student.py | 训练哈希 n-gram 线性学生模型并 INT8 量化 | 核心训练脚本 |
| submission_distillation/validate_student_holdout.py | 公开数据上的交叉验证和风险评估 | 离线验证工具 |
| submission_distillation/scoring/ | 本地标签解析和评分辅助代码 | 用于自测，不应随意修改 |
| submission_distillation/pyproject.toml / uv.lock | 运行期依赖锁定，当前只依赖 numpy<2 | 提交环境说明 |

## 四、总体技术路线

本方案采用“离线重模型、在线轻模型”的部署思路。训练阶段允许在开发机上加载官方基线教师模型；提交评测阶段只运行小型学生模型。这样既能说明学生模型来源于指定基线，又能在判题时取得显存和时延优势。

```bash
官方 FinGPT 7B + LoRA 教师模型
↓ 离线推理/标签打分
教师标签或 13 类标签分布缓存
↓ 黑盒知识蒸馏训练
哈希字符 n-gram 线性学生模型
↓ INT8 权重量化
weights/student_int8.npz
↓ 判题运行期
predictor.py 仅用 NumPy 加载小模型并输出 13 类标签
```

该路线本质上是黑盒知识蒸馏。学生模型不能访问教师模型内部梯度或参数，只利用教师模型在同一输入 prompt 上给出的输出标签或输出分布进行学习。相比直接加载 7B 模型生成长文本，学生模型只做一次特征哈希和矩阵求和，计算量和内存占用都大幅下降。

## 五、关键实现说明

### 5.1 教师数据生成

generate_teacher_cache.py 使用指定路径 /opt/fingpt-forecaster/models/Llama-2-7b-chat-hf 作为基座模型，并加载 /opt/fingpt-forecaster/models/fingpt-forecaster_sz50_llama2-7B_lora 作为 LoRA adapter。脚本读取公开 parquet prompt，调用教师 Predictor.predict(prompt)，把教师预测标签写入 jsonl 缓存。

generate_teacher_score_cache.py 在此基础上进一步计算 13 个合法标签的平均 log probability。它在 prompt 后拼接“预测涨跌幅：”前缀，分别计算各个标签的生成得分，得到比单个硬标签更丰富的软标签分布。

### 5.2 学生模型特征

学生模型使用中文 prompt 的字符 n-gram 特征。当前权重文件记录的 ngrams 为 (2, 3, 4)，哈希空间维度 dim 为 65536。predictor.py 会先去除空白，然后枚举 2/3/4 字符片段，通过 blake2b 哈希映射到固定维度，并对特征 id 去重。

```bash
ids = feature_ids(prompt)
logits = bias + sum(weight_q[ids] * weight_scale) / sqrt(len(ids))
pred_label = labels[argmax(logits)]
```

### 5.3 学生训练与量化

train_student.py 将教师缓存转换为训练目标：如果缓存中包含 teacher_scores，则对得分做 temperature softmax 作为软标签；否则使用 teacher_label 并加入 smoothing。模型参数包括 weight 矩阵和 bias，训练时采用逐样本更新，并使用梯度平方累积项进行自适应步长缩放。

训练完成后，代码按输出通道计算缩放因子，将 float32 权重量化到 int8 区间 [-127, 127]，保存 weight_q、weight_scale、bias、dim、ngrams、labels 等信息到 weights/student_int8.npz。当前 npz 文件大小约 650 KB，远小于 7B 基线模型。

### 5.4 运行期 Predictor

submission_distillation/predictor.py 的运行期依赖只有 NumPy。load() 从相对路径 weights/student_int8.npz 加载学生模型；predict(prompt) 完成哈希特征提取、logits 计算和 argmax 分类，返回一个合法的 13 类涨跌幅标签。由于本地解析器支持裸标签兜底，该输出能被判题系统解析。为了进一步提高稳健性，后续也可以把返回值改为“预测涨跌幅：<标签>”。

## 六、实验与结果

当前仓库中保留了多轮实验记录。基线 7B 方案在公开样本上能够保持较好 W，但推理非常慢，V 得分较低；早停和 max_new_tokens 截断能缩短输出，但容易造成解析失败或标签质量下降；蒸馏 INT8 学生模型则在 U/V 上取得明显优势，代价是 W 有所下降。

| 实验/方案 | 数据来源 | 显存/时延表现 | 精度表现 | 结论 |
| --- | --- | --- | --- | --- |
| 7B + LoRA 基线 | public parquet limit=5 | vram 16488.6 MB，avg_latency 146.9 s | n_parsed 5/5，W=40.0 | 质量稳定但时延过高 |
| Early stop 早停 | public parquet limit=20 | avg_latency 103.58 s | n_parsed 19/20，direction_acc 0.55 | 略优于基线，但解析不稳定 |
| MAX_NEW_TOKENS 截断 | public parquet limit=5 | 32-256 tokens 时显著提速 | 多次解析失败并触发归零 | 不能直接作为候选 |
| 蒸馏 INT8 学生 | 代码 README 记录的一次平台评测 | U=39.994632，V=19.999665 | W=20.360145 | 总分 80.354441，推荐主方案 |

需要注意：公开样本、本地评分和平台隐藏评测的子集不同，因此上表数值主要用于说明技术路线的取舍，不能简单视为严格同集对比。

submission_distillation/README.md 中还记录了离线验证结果：随机 5 折 holdout 的 macro F1 为 0.2407、direction accuracy 为 0.6145；时间最后 20% 切分的 macro F1 为 0.0496、direction accuracy 为 0.6854；股票代码 5 折 overall 的 macro F1 为 0.0523、direction accuracy 为 0.5556。这些结果说明学生模型保留了一定方向判断能力，但精细 13 分类仍是主要风险点。

## 七、合规性与学术诚信说明

本报告推荐的蒸馏 INT8 路线满足“基于指定基线模型进行压缩”的技术逻辑：教师模型明确为 Llama-2-7b-chat-hf + fingpt-forecaster_sz50_llama2-7B_lora，学生权重文件的元信息中也记录了对应 base model 和 LoRA adapter 路径。

- 未使用外部大模型替换基线模型。

- 学生模型训练目标来自教师模型预测或教师标签得分分布。

- 公开数据真实 label 仅用于离线验证，不作为提交学生模型的训练目标。

- 运行期 predictor.py 只加载相对路径 weights/student_int8.npz，符合提交目录要求。

- 运行期依赖只声明 numpy<2，没有新增 torch 或 CUDA 版依赖，不破坏比赛预装环境。

对于代码包中的 FAST_HEURISTIC_MODE 历史标签启发式候选，建议在报告和正式答辩中谨慎处理：该候选可作为资源上限对照实验，但不应包装成基线模型压缩成果，否则可能与“必须基于指定基线大模型采取量化、剪枝、蒸馏或结构压缩”的要求发生冲突。

## 八、风险分析与后续优化

| 风险点 | 表现 | 后续改进 |
| --- | --- | --- |
| 隐藏集分布变化 | 学生模型只学习公开 prompt 与教师输出之间的关系，泛化能力可能受限 | 扩大教师缓存覆盖，按时间和股票代码做更严格验证 |
| 13 类精细分类能力不足 | 方向准确率相对稳定，但 macro F1/序数得分波动较大 | 使用 teacher_scores 软标签、加入序数距离惩罚或相邻类别平滑 |
| 输出解析稳健性 | 当前返回裸标签，理论可解析，但依赖全文唯一标签兜底 | 改为固定返回“预测涨跌幅：<标签>”以匹配最高优先级解析规则 |
| 合规边界 | 启发式候选可能被认为脱离基线模型 | 正式提交和报告统一使用蒸馏 INT8 版本 |
| 学生模型容量 | 线性模型很快但表达能力有限 | 在不引入大依赖的前提下尝试更高维哈希、更合理 n-gram 或小型 MLP 量化 |

## 九、复现实验命令

以下命令用于说明代码包的复现流程，实际路径需在比赛开发机上执行。正式提交前应先进行测试提交，避免浪费每日正式评测次数。

```bash
cd /submission
uv sync --locked
python - <<'PY'
from predictor import Predictor
p = Predictor()
p.load()
print(p.predict("测试 prompt"))
PY
```

教师缓存与学生训练可在开发机临时目录中执行，缓存文件不必放入正式 /submission。

```bash
python generate_teacher_cache.py \
--teacher-dir /tmp/submission_v1_codex \
--out /tmp/fingpt_teacher_cache_full.jsonl

python train_student.py \
--cache /tmp/fingpt_teacher_cache_full.jsonl \
--out weights/student_int8.npz
```

## 十、结论

根据当前代码状态，最适合作为正式技术报告主线的是 submission_distillation 目录中的黑盒知识蒸馏 + INT8 量化方案。该方案保留了“从指定 FinGPT 基线教师模型学习”的来源说明，同时在运行期完全避免加载 7B 大模型，因此能够显著降低显存峰值和推理时延。

当前方案的主要短板是预测精度相对 7B 教师有所下降，尤其是 13 个涨跌幅细粒度档位的稳定性。后续工作应优先围绕教师 soft score 蒸馏、序数距离友好的损失函数、输出格式强约束和更充分的时间/股票代码切分验证展开，而不是继续堆叠不稳定的 prompt 或长文本生成优化。

## 参考依据

- 比赛规则：/submission 目录、Predictor.load()/predict(prompt)、uv 依赖管理与 U/V/W 评分细则。

- 赛题说明：FinGPT-Forecaster 模型、轻量化目标、显存/时延/预测性能三项评分。

- 当前代码包：submission_distillation/predictor.py、train_student.py、generate_teacher_cache.py、generate_teacher_score_cache.py、README.md、docs/experiment-log.md。
