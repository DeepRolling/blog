{{{
    "title"    : "Cryptographic hash function",
    "tags"     : ["hash","cypher"],
    "category" : "underlayer",
    "date"     : "05-13-2021"
}}}

We will discuss some funny things about hash algorithm.

## 关于hash算法

hash算法就是具有某些特性的公式
总的来说，一个有用的hash算法具有如下特性:

1. 有效率的计算(**Computationally Efficient**):也就是说一个计算机必须能在很短的时间内进行一次hash的数学计算
2. 确定性(**Deterministic**):hash算法必须具有确定性，也就是对于一个固定的输入，hash算法必须给出一个与之对应固定的输出，这对hash算法是非常重要的。
3. 抗原像性(**Pre-Image Resistant**):一个好的hash算法不能揭露输入的任何信息，比如如果一个hash算法将输入的长度乘以1.5倍作为输出，那么攻击者就会知道一个36位的输出的输入是24位的字符。比如只改了一个字符串中的一个字符，那么应该得出完全不一样的输出。
> 预先针对可能的输入生成彩虹表，然后拿结果进行比对，可能会知道原始输入。
4. 抗碰撞性(**Collision Resistant**) : 一个hash函数的输入可能是一个字符，字母，数字或者一个文件，但是输出永远是固定长度的字符串，也就是说输出的结果集是有限的，但是输入是无限的，也就是说肯定有两个以上的输入会产生同一个输出。抗碰撞性的目的就是防止根据同一个输入找到两个相同的输出，在现实生活中可能这不构成隐患。
> 如果得到一个经过hash的字符串，经过碰撞可能会得到一个密码可以跟真实密码有相同的hash值，就可以拿这个密码进行攻击。
5. 不可逆向性(**Impossible To Reverse Engineer**) : 也就是说一个hash算法应该在数学上不能被反推演创建输出的过程。就跟Modular functions(one-way functions)一样，比如拿取余操作来说，12取余5是2，22取余5也是2，那么取余输出2的可能有无数个，这就是不可逆向性。


## 一些经典的hash算法

-   Secure Hashing Algorithm (SHA-2 and SHA-3)
-   RACE Integrity Primitives Evaluation Message Digest (RIPEMD)
-   Message Digest Algorithm 5 (MD5)
-   BLAKE2

一个经典的hash函数可能包含多种算法，比如SHA-2是一个hash函数族，包含了多种算法 : SHA-224, SHA-256, SHA-384, SHA-512, SHA-512/224, and SHA-512/256.

SHA256是现在很著名的hash算法，因为中本聪在区块链的实现中用到了SHA-256，看一下它的实现：

_Komodo Platform strives to accelerate the global adoption of blockchain technology and to lead the world in blockchain integration._
比如如上的输入，经过SHA-256处理之后可得到输出如下：
**AE61266750D019063512516C7EE01968012C81F25A896A38517DCD5A7E99FE26**
可以看到这完全是一个64字符的无意义字符串。
然后我们将输入中adoption单词的i和o交换位置，再次运行得到输出如下：
**437974C159B15BAF222F868493C167125FA32452E9460731C57515E76B603EB1**
可以看到两次输出长度一样但是是两个完全不一样的输出，这是改变了一个输入字符的结果
