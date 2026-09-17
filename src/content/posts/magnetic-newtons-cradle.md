---
title: "磁力牛顿摆实验研究报告"
published: 2025-11-24
description: "以磁偶极子模型研究磁力牛顿摆的动力学现象，并从双摆推广到多摆球体系。"
tags: ["物理", "牛顿摆", "磁偶极子", "混沌"]
category: "实验研究"
draft: false
comment: false
---
**摘要：** 为探究将普通牛顿摆的摆球替换成同质的磁球后的摆球动力学现象，实验通过改变摆球数量，改变摆长和摆球尺寸，发现双摆时为阻尼大幅减轻的周期摆动，而三个及以上的摆球运动为混沌现象，无周期。

**关键词：** 牛顿摆；混沌现象

## 1. 引言

中学和大学物理教学中通常应用牛顿摆装置（图1）来演示并验证碰撞过程中动量和能量守恒，在生活中也常有类似的桌球游戏、玩具等，它们的共同特征是有多个彼此独立且彼此接触的m个同质等大的球构成的球链，在此球链上，可实现有效的能量和动量传递并表现出许多有趣的现象，比如，移动球链上n个小球，让其以同样速度沿着连心线撞击静止球链的一端，球链另一端n个小球会被弹出。在图1所示的牛顿摆装置中，左右两侧小球交替运动，在阻尼很小的情形下，这个过程可持续很长时间。本届TJPT所研究的项目为将摆球替换为同质的磁球，并且利用磁球之间的排斥力代替碰撞传递动量和能量，为了研究此时体系动力学现象，本文从基础的牛顿摆入手，通过磁偶极子简化模型，从而得出与仿真实验相似的结果。

![磁力牛顿摆实验图示 1](/assets/images/posts/magnetic-newtons-cradle/image1.png)

*图 1 牛顿摆装置*

## 2. 理论模型

### 2.1 牛顿摆模型方程

将牛顿摆简化为多个半径同为R的匀质球构成的球链，置于光滑水平面上，球心在同一直线上；初始时刻除碰撞小球具有初速度v_0外，其他小球均处于静止状态且彼此间距为2R；若忽略摆球与其他静止球碰撞过程中的能量损失，则可将每个小球看做是理想质点与劲度系数κ组成的系统.为简化分析，本部分将对由3个小球构成的牛顿摆进行动力学分析.若以小球1恰好接触小球2的时刻为计时起点，此时小球1的中心位置为坐标原点，各小球连心线为坐标轴的坐标系中，系统动力学方程可表示为如下:

![磁力牛顿摆实验图示 2](/assets/images/posts/magnetic-newtons-cradle/image2.png)

![磁力牛顿摆实验图示 3](/assets/images/posts/magnetic-newtons-cradle/image3.png)

![磁力牛顿摆实验图示 4](/assets/images/posts/magnetic-newtons-cradle/image4.png)

式中x_1,x_2和x_3为碰撞小球的位置坐标，m为小球质量，劲度系数κ是与物质材料特性相关的物理量，给定初始条件，可以得到摆球在相互作用中的位置变化。

![磁力牛顿摆实验图示 5](/assets/images/posts/magnetic-newtons-cradle/image5.png)

### 2.2 磁偶极子

条形磁铁可以视为一个磁偶极子， 而磁偶极子的磁场又可视为一个电流环激发的磁场， 各物理量如下图所示。

![磁力牛顿摆实验图示 6](/assets/images/posts/magnetic-newtons-cradle/image6.png)

其磁矩，当r远大于R时，空间一点 P 处的磁感应强度为

![磁力牛顿摆实验图示 7](/assets/images/posts/magnetic-newtons-cradle/image7.png)

![磁力牛顿摆实验图示 8](/assets/images/posts/magnetic-newtons-cradle/image8.png)

推导如下：由毕奥 - 萨伐尔定律：

![磁力牛顿摆实验图示 9](/assets/images/posts/magnetic-newtons-cradle/image9.png)

![磁力牛顿摆实验图示 10](/assets/images/posts/magnetic-newtons-cradle/image10.png)

![磁力牛顿摆实验图示 11](/assets/images/posts/magnetic-newtons-cradle/image11.png)

对φ从0到2π积分，并利用三角函数的正交性：

![磁力牛顿摆实验图示 8](/assets/images/posts/magnetic-newtons-cradle/image8.png)

在研究铁磁质在磁场中的受力时（例如两个条形磁铁之间的相互作用）， 可以把铁磁质视为磁偶极子进行受力分析。由于本次实验中我们去简化模型，所以本处只分析特殊情况。如上图，

![磁力牛顿摆实验图示 12](/assets/images/posts/magnetic-newtons-cradle/image12.png)

![磁力牛顿摆实验图示 13](/assets/images/posts/magnetic-newtons-cradle/image13.png)

### 2.3 磁力牛顿摆（双摆球）

不同于普通牛顿摆，磁力牛顿摆在重力力矩之外额外受到磁球之间的磁力力矩，由上文分析，对于双摆球体系，将两者都视为磁偶极子，其所受磁力可以表示为：

![磁力牛顿摆实验图示 14](/assets/images/posts/magnetic-newtons-cradle/image14.png)

μ0是真空磁导率，m是磁偶极矩大小，r是两磁偶极子间距，θ1，θ2是磁矩与连线方向夹角 ，也就是摆线与铅垂方向夹角。

两摆球之间相互作用力大小为F，方向沿二者外角平分线，分解到各自切向：

![磁力牛顿摆实验图示 15](/assets/images/posts/magnetic-newtons-cradle/image15.png)

为了简化模型并且方便运算，我们不计摆线质量和空气阻力所带来的阻尼项。则动力学方程：

![磁力牛顿摆实验图示 16](/assets/images/posts/magnetic-newtons-cradle/image16.png)

![磁力牛顿摆实验图示 17](/assets/images/posts/magnetic-newtons-cradle/image17.png)

给定初始条件，便可得到摆球的运动情况。

### 2.4 磁力牛顿摆（多摆球）

利用磁偶极子简化模型，可以发现磁力与r的负四次方成正比，故可以假设摆球之间的磁力仅在相邻两球之间产生有效作用，此时可以由2.3推广到多摆球体系：
