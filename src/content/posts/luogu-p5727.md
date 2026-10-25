---
title: "P5727 冰雹猜想"
published: 2020-04-19
description: "用栈做数组模拟题。"
tags: ["洛谷","C++","栈"]
category: "算法"
author: "Gunpowder"
sourceLink: "https://www.cnblogs.com/gunpowder/p/12732653.html"
draft: false
comment: false
---

> 本文迁移自[博客园原文](https://www.cnblogs.com/gunpowder/p/12732653.html)，保留原始发布日期与当时的内容。

PS：啊啊啊我终于知道了啊，原来博客园支持`马克当`，那这不就爽了吗？！

[传送门](https://www.luogu.com.cn/problem/P5727)

```text
题目描述
给出一个正整数 n(n\le 100)n(n≤100)，然后对这个数字一直进行下面的操作：如果这个数字是奇数，那么将其乘 3 再加 1，否则除以 2。经过若干次循环后，最终都会回到 1。经过验证很大的数字（7 * 10 ^ 11）都可以按照这样的方式比变成 1，所以被称为“冰雹猜想”。例如当 nn 是 20，变化的过程是 [20, 10, 5, 16, 8, 4, 2, 1]。

根据给定的数字，验证这个猜想，并从最后的 1 开始，倒序输出整个变化序列。

输入格式
无

输出格式
无

输入输出样例
输入 #1
20
输出 #1
1 2 4 8 16 5 10 20
```

嗯嗯，现在基本上就可以写了。

———————————————————————————不怎么华丽的分割线———————————————————————————

首先我们看看，这道题是在`Luogu`的“数组”题单里的！！！但我觉得这道题用数组模拟太麻烦，还是用`栈`吧。毕竟栈对于反转操作比较好用。

废话不多说，上代码：

```cpp
#include <bits/stdc++.h>
using namespace std;
int main (){
    int n;
    cin >> n;
    stack <int> s;
    s.push (n);
    while (s.top () != 1){
        if (s.top () % 2 == 1)s.push (s.top () * 3 + 1);
        else s.push (s.top () / 2);
    }
    while (s.empty () == 0){
        cout << s.top () << " ";
        s.pop ();
    }
    return 0;
}
```

[AC记录](https://www.luogu.com.cn/record/32948379)

（话说我好久没有更了，各位请见谅哈~）
