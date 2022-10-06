{{{
    "title"    : "2021年工作年终总结",
    "tags"     : ["life", "talk"],
    "category" : "literal",
    "date"     : "09-27-2022"
}}}

备份一个去年的年终总结～只是去年状态的一个文字显现～虽然今年不是很想工作了哈哈哈哈


# 年终总结

2021年是一个特殊的年份，在年初3月份的时候我加入飞英思特这个大家庭到现在逼近年关，在这个过程中我能感觉到自己对待工作的哲学以及自己心态的变化还是有一些演进的，所以如下就将2021年做个总结，同时祝大家2022越来越好！

## 2021工作总结

从2021年3月份加入公司以来在不同程度上参与了以下项目的开发 ：

- 蜂零
- 飞英智联
- 农业监测展示系统
- 硬件调试串口工具
- 银联支付项目
- 后台管理系统

下面说一下参与程度最高的两个项目 ：

#### 蜂零

我接手的第一个项目是*蜂零app*，定位是面向中高端用户的家庭安全监测系统的c端产品。

在整个过程中我收获最大的地方就是**建构起了IOT领域的专业知识以及一些体系架构的轮廓概念**，这对于在IOT领域发展是不可或缺的宝贵财富。

同时**对蜂零项目中了解的专业技术如：smart config , airkiss , gateway等概念进行了学习与实践**，这对于我之前偏向应用层开发的技术栈来说是一个不那么一样的领域，当我学习这些技术的时候也经历过迷茫与痛苦，感谢软件组小伙伴们给我耐心讲解概念帮助我更好的理解整个物联网系统的运行流程，并且最后能让我在蜂零之中将这些学到的知识实践出来，现在回头看来还是很有成就感的。

其次的就是加深了我对移动端开发的理解，从开发框架本身到部署流程以及兼容问题的处理，再到线上问题的追踪以及版本之间的兼容，这每一个方面都会直接或者间接的影响到用户体验以及开发者本身。关于这一方面我**学到了很多策略并且进行了实践**，但是还是有很多不足的地方： 现在这些流程本身很多是停留在基本使用方面，关于**对整体流程更细力度的把控做的不够**。

蜂零项目历时多个月并且经历了多次重大版本的迭代，最终得以上线，这过程中离不开同事相互配合的努力。

#### 飞英智联

飞英智联属于和蜂零app相同的领域，并基于蜂零打下的基础得以快速开发。

在代码编写以及开发流程方面 **大体沿用了蜂零积累下来的类库与辅助工具等**，在于此同时还**发现了一些以前蜂零开发流程上的不合理之处，并针对其缺陷做了更改。（如codepush自动读取版本，image压缩脚本等）**，在这个过程中编写了很多node.js平台的脚本，并且在后来茂辉加入开发团队之后针对不同运行的平台做了兼容性处理。

这个过程的感悟最深的就是在前端开发领域我们需要**利用好nodejs这套强有力的工具**，它依托丰富的npm仓库并拥有海量的模块，在我们开发流程中可以**以最大的灵活性让我们定义develop pipeline**。

一个比较有收获的点就是在项目中期采用了**持续集成的开发流程**省略了在开发部署之间的人为操作流程并且对版本追溯有了更细的把控，方便测试过程的追溯。

#### 关于模块化开发的感悟

模块化开发可以说是现代软件开发很重要的一个组成部分，软件开发方式演变至今，它之所以能在开发方法论中占如此重要的位置说明它确实解决了开发的痛点：**接触耦合，独立开发，最小代价迭代**等。

在2021年的项目中我对于模块化实践是在踩坑的同时进步的。

如下是我印象较为深刻的坑与得到的感悟 ：

1. 比如引入一个类库如果直接在代码中使用，在经过一段时间的开发之后突然发现了该类库存在的问题，或者找到更好性能的类库，这个时候替换的话就有很大的工作量，多个项目的话简直是噩梦，后来经过模块化思想的指导就知道在引入的时候要**做中间层对外提供标准化接口并隐藏内部实现**，这样在更换的时候极大减少了工作量也使代码逻辑更加清晰。
2. **类库的单一职责封装**，在蜂零项目中我刚开始封装库的时候只是考虑代码复用层面，经常会做成toolkit一样的东西，做的广而不精，然后就会发现在不同项目之间共享的时候引入发现有时候并不需要toolkit中的某一个功能或者和现有功能有冲突，这个时候就需要进行引入的取舍。后来想起了java中类封装时的单一职责原则，再做类库的时候更多的考虑的是我想这个库提供什么功能，需要对外暴露什么标准化接口。
3. 针对**模块的版本以及发布的控制**，刚开始做模块化的时候升级或发布独立模块的时候不会做记录，顶多是在git里面记录一下，这样如果碰到依赖性的问题，比如1.0版本依赖React Native0.65 , 2.0版本依赖React Native0.66，并且俩个版本之间是不兼容的，如果在这个升级过程中没有文档输出的话，不管是对自己的使用或者他人的依赖都会造成很大的问题，毕竟人的记忆是会消退的。及时在发布版本的时候做好版本记录以及控制版本号的变化是很有必要的，如测试版本发布在哪里，正式版本发布在哪里，这样就不会造成管理上的混乱。


以上就是2021年工作内容的总结，踩了很多坑的同时也学到了很多东西，谢谢小伙伴们的帮助以及包容与理解。


## 2022工作规划

在2022年的话除了按时按量保证工作的进行之外，我希望我自己在专业领域有更多的沉淀。

比如文档输出这件事，不可否认的是有时候做起来很痛苦，有时候又没有时间，但是它确实是一个很重要的事情，将代码已经实现的事情记录下来的过程中会经历一个对以前的思想进行回顾的阶段，并且
**在这个阶段的过程中以一个旁观者的角度往往能发现很多自己没考虑到、不完善的东西，这个时候就可以去完善。**
并且文档也有助于将完成的工作进行标准化的归档处理，**在职业生涯的发展中这是一种积累，同时也是对自己以往工作的一种肯定。** 所以我希望自己2022年能将这件事情做起来。

其次是我打算继续在专业广度方面进行提升，我认为只有在广度够的时候在能理解一些东西的运行原理，比如你如果不会nodejs就不能去做pipeline，如果不知道babel就不能针对于编译过程进行调优等。2021年接触了一下偏服务器的东西比如nginx,jenkins,堡垒机等，**既满足了个人的好奇心同时对自己对整个软件开发团队的架构有了更深层次的理解。**

在这同时我也会用足够的时间对自己工作的主要领域进行深挖以及积累，在前端日新月异的变化中找到那个不变的东西，这样在面对新事物的时候才能做到游刃有余的应对变化。

最重要的是和小伙伴们互相帮助互相理解，一起收获胜利的果实，相识就是缘分希望新的一年大家多多关照！


## 自我总结及分析

我个人来说是比较在意方法论方面的东西的，因为在不同的方法论的指导之下人们工作和处理事物的方法是不一样的，同时也会演变为不同的结果，在生活方面这个也很重要，思想是随着年龄的增长不断演变的，重要的是我们要关注自己的思想，时刻保持对世界的好奇心。

后来我今年还有一个理解：**生活和工作其实不是隔离的，他们是相辅相成的，工作中发生的事情也会影响生活，生活的情绪也会影响工作。**

我对这件事的应对方法是要学会放松，科技的最终目的应该是人类，晚上下班回家要得到充分的休息放松，这样第二天工作起来效率也会更高。

我个人不愿意接受最感到痛苦的就是拆自己的墙，不论是技术还是思想方面的都是，这意味着你需要将你辛辛苦苦建立起来的大厦壁垒亲自推倒，重要的是往往优雅的东西，技术思想的进步就发生在那个痛苦的过程。

## 对公司的建议

希望公司对员工的职业发展的福利越来越好，比如安排技术分享会，提供团队付费课程等。
