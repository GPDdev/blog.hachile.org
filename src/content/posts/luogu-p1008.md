---
title: "P1008 三连击"
published: 2020-04-01
description: "不用暴力枚举做暴力枚举题。"
tags: ["洛谷","C++","深度优先搜索"]
category: "算法"
author: "Gunpowder"
sourceLink: "https://www.cnblogs.com/gunpowder/p/12469125.html"
draft: false
comment: false
---

> 本文迁移自[博客园原文](https://www.cnblogs.com/gunpowder/p/12469125.html)，保留原始发布日期与当时的内容。

[https://www.luogu.com.cn/problem/P1008](https://www.luogu.com.cn/problem/P1008)

题目背景

本题为提交答案题，您可以写程序或手算在本机上算出答案后，直接提交答案文本，也可提交答案生成程序。

题目描述

将1,2, \\cdots ,91,2,⋯,9共99个数分成33组，分别组成33个三位数，且使这33个三位数构成1:2:31:2:3的比例，试求出所有满足条件的33个三位数。

输入格式

木有输入

输出格式

若干行，每行33个数字。按照每行第11个数字升序排列。

输入输出样例

输入 #1

无

输出 #1

192 384 576

---

...

---

（输出被和谐了）

这是一道出现在枚举里的题。那不就是让你枚举吗。但是这道题直接暴力枚举代码量太大了，我又不是肝帝，所以在这里介绍一下深度优先搜索算法。话不多说，上代码：

```cpp
#include <bits/stdc++.h>//万能头
using namespace std;
int a[10]；
bool b[10];//数组a用于存储当前的三个三位数，数组b用于记录状态
void dfs (int n)//深搜，n表示当前搜索到了哪一层
{
    if (n > 9)//n>9，即九个数全部搜索完毕
    {
        double x = a[1] * 100 + a[2] * 10 + a[3];//第一个数
        double y = a[4] * 100 + a[5] * 10 + a[6];//第二个数
        double z = a[7] * 100 + a[8] * 10 + a[9];//第三个数
        if (y / x == 2 && z / x == 3)
        {
           cout << x << " " << y << " " << z << endl; //满足条件，输出
        }
    }
    for (int i = 1; i <= 9 ; i++)//对下一位数搜索9次
    {
        if (b[i] == 0)//记录状态，即要计算第i位了
        {
            a[n] = i;//从i开始搜索
            b[i] = 1;//记录状态，这一位目前搜索过了
            dfs (n + 1);//继续搜索下一层
            b[i] = 0;//换个数再次搜索
        }
    }
}
int main ()
{
    dfs (1);//直接调用函数
    return 0;//好习惯
}
```
