{{{
    "title"    : "Frontend UI/UX usage guide",
    "tags"     : ["frontend","ui-ux"],
    "category" : "frontend develop",
    "date"     : "05-19-2021"
}}}

This article describe some UI/UX usage principle in frontend dev .

## 图片格式选择（位图）

前端是展现给用户看的，不可避免的我们的产品中要放置大量的图片，这个时候怎么能把图片用好，怎么能让图片展示出最
佳效果，使设备消耗最小的性能就格外重要。
在开发过程中，我们常见的图片格式有GIF、PNG8、PNG24、JPEG、WEBP，在不同的场景中我们需要根据不同的特性选择合适的图片格式。

#### GIF
> **图像互换格式**（英语：Graphics Interchange Format，简称**GIF**）是一种[位图](https://zh.wikipedia.org/wiki/%E4%BD%8D%E5%9B%BE "位图")[图形文件格式](https://zh.wikipedia.org/wiki/%E5%9B%BE%E5%BD%A2%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F "图形文件格式")，以8位色（即256种颜色）重现[真彩色](https://zh.wikipedia.org/wiki/%E7%9C%9F%E5%BD%A9%E8%89%B2 "真彩色")的图像。它实际上是一种[压缩](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%8E%8B%E7%BC%A9 "数据压缩")文档，采用[LZW](https://zh.wikipedia.org/wiki/LZW "LZW")压缩算法进行编码，有效地减少了图像文件在网络上传输的时间。它是目前[万维网](https://zh.wikipedia.org/wiki/%E5%85%A8%E7%90%83%E8%B3%87%E8%A8%8A%E7%B6%B2 "万维网")广泛应用的网络传输图像格式之一。

可以看到gif本质上是对位图的压缩文件，存储格式如下 :
![enter image description here](http://www.deepcode.site:9000/blog/front-end-spec/20210519105159.jpg)

虽然gif可以表现静止的图片，但是现在主流都用gif作为动图来使用。

优点 :
适用于一些简单的图片或者动画（指色彩适用较少的动画）,在各个平台兼容性较好。

缺点 ：

1. 文件体积其实不小，一个简单动画gif差不多130KB左右，相比于能实现同样效果的lottie的几KB文件就大更多了。
2. 颜色限制大，只能使用256种颜色，所以不适用做于一些色域丰富的动图，表现力会很差。
3. 透明度问题，gif只支持全透明或者不透明，不支持半透明，所以在某些时候表现力略差。
4. 毛边问题，产出的gif图可以通过添加颜色相近的背景达到去除毛边的目的，但是这样针对不同背景的适配就需要多个gif图，无形之中就增加了打包进产品的gif图的体积，整体来看得不偿失。

所以整体来看除了一些极其简单并且色彩单调的动画，在其余情况还是尽量避免使用gif格式。
可参考的一些文档:
>[gif在线改色工具](https://ezgif.com/help/gif-transparency)
[去毛边教程](https://zhuanlan.zhihu.com/p/188502696)
[256色图鉴](https://jonasjacek.github.io/colors/)

#### PNG
>PNG是20世纪90年代中期开始开发的图像文件存储格式，其目的是企图替代GIF和TIFF文件格式，同时增加一些GIF文件格式所不具备的特性。流式网络图形格式(Portable Network Graphic Format，PNG)名称来源于非官方的“PNG’s Not GIF”，是一种位图文件(bitmap file)存储格式，读成“ping”。PNG用来存储灰度图像时，灰度图像的深度可多到16位，存储彩色图像时，彩色图像的深度可多到48位，并且还可存储多到16位的α通道数据。PNG使用从LZ77派生的无损数据压缩算法。

png支持存储附加文本信息，以保留图像名称、作者、[著作权](https://zh.wikipedia.org/wiki/%E7%89%88%E6%9D%83)、创作时间、注释等信息。
并且png的一个强大的优势在于它对丰富色彩的支持以及Alpha通道全支持：
> PNG可提供更大颜色深度的支持，包括24位（8位3通道）和48位（16位3通道）真彩色。加入[Alpha通道](https://zh.wikipedia.org/wiki/Alpha%E9%80%9A%E9%81%93 "Alpha通道")后可进一步支持每像素64位的表示。
也就是说PNG中的一个像素最低是8-bit色深(分为3通道)，这就跟gif的色深是一样的。
如果PNG中的一个像素的色深大于8-bit，在转为gif之后会出现图像质量下降（颜色数减少）

优点：
色彩表现力丰富，并且全alpha通道支持，可以做一些表现力丰富的图像。
使用了无损压缩算法，文件体积较小。
支持渐进式流式读写(progressive display)

缺点：

1. 官方不支持动画，但是有一些社区实现APNG（Animated **PNG**）等
2. 对于大型文件（如图像），文件大小会随着图像的尺寸设定而明显增加

png常用的有三种格式 ： PNG-8、24、32
其中 PNG-8与PNG-32是支持透明度的，所以也是用的最多的两个

在开发过程中如果png颜色比较单调且没有半透明效果应该采用PNG-8格式以减小体积，如果色彩丰富应采用PNG-32。

可参考的一些文档:
>[Color-Depth](https://en.wikipedia.org/wiki/Color_depth#48-bit)
[png渐进式加载](https://www.cnblogs.com/chayangge/p/4861369.html)
[React-native实现渐进式加载](https://github.com/HandlebarLabs/react-native-examples-and-tutorials/tree/master/tutorials/progressive-image-loading)
[React-native实现渐进式加载翻译](https://blog.csdn.net/villa_mou/article/details/106140446)
[macos下获取PNG图片格式](https://stackoverflow.com/a/39529262)
[8-bit colormap是否带透明度](https://stackoverflow.com/a/1973761/11742589)


#### JPEG
>JPEG是一种针对照片视频而广泛使用的一种有损压缩标准方法。这个名称代表Joint Photographic Experts Group（联合图像专家小组）。此团队创立于公元1986年，1992年发布了JPEG的标准而在1994年获得了ISO 10918-1的认定。

JPEG格式是一种大小与质量相平衡的压缩图片格式。通俗一点讲，就是：高的压缩比=低的图片质量=小的文件大小。反之，低的压缩比=高的图片质量=大的文件大小。由于JPEG文件无法保持100 ％的原始图像的像素数据，所以它不被认为是一种无损图像格式。

优点：
体积相较于32-bit的png图片较小
支持有损压缩
压缩比在10左右肉眼无法辨出压缩图与原图的差别

由于这种极其敏感的平衡特性，JPEG非常适合被应用在那些允许轻微失真的像素色彩丰富的图片（照片）场合。反之，JPEG格式图片并不适合做简单色彩（色调少）的图片，比如LOGO，各种小图标（ICONS）。

#### WEBP
待补充


#### 总结
经过以上几种图片方案的对比，总结出以下应用场景：

- 如果图片带半透明，首选png-32
- 如果图片带全透明，首选png-8
- 如果图片要求显示丰富的色彩，首选jpeg
- 如果图片一点透明都不带，色彩也不怎么丰富，那么png8和jpeg都是可以的。

为了更好的用户体验，针对于各个平台的位图大小作出如下限制:
**PC平台单张的图片的大小不应大于 200KB。
移动平台单张的图片的大小不应大于 100KB。**

## 矢量图与拓展

矢量图是可以用很少的点线面信息表达出简单图像包含的信息的一种技术。
相比于传统的位图使用像素点表示图像信息，svg表示图像信息的方式是用xml文件技术表示信息路径。
减少了很多的无用信息，大大缩小了图像显示的大小。

现在svg技术在web端和移动端支持都很好。
相对于网络图片来说，本地渲染的svg图片并不会消耗很多网络带宽，并且渲染速度很快。
关于矢量图和位图的优势以及适用场景，有一偏帖子写的很好：
[既然矢量图放大缩小都不失真，为什么还要使用位图？ - 冬月的回答 - 知乎](https://www.zhihu.com/question/21283005/answer/710171911)
[查看位图放大和矢量图放大的例子](https://mdn.github.io/learning-area/html/multimedia-and-embedding/adding-vector-graphics-to-the-web/vector-versus-raster.html)

#### SVG
>**可缩放矢量图形**（**Scalable Vector Graphics，SVG**），是一种用于描述二维的[矢量图形](https://zh.wikipedia.org/wiki/%E7%9F%A2%E9%87%8F%E5%9B%BE%E5%BD%A2)，基于 [XML](https://developer.mozilla.org/zh-CN/docs/Web/XML/XML_Introduction) 的标记语言。作为一个基于文本的开放网络标准，SVG能够优雅而简洁地渲染不同大小的图形，并和[CSS](https://developer.mozilla.org/zh-CN/docs/Learn/CSS)，[DOM](https://developer.mozilla.org/zh-CN/docs/MDN/Doc_status/API/DOM)，[JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)和[SMIL](https://developer.mozilla.org/zh-CN/docs/Web/SVG/SVG_animation_with_SMIL)等其他网络标准无缝衔接。本质上，SVG 相对于图像，就好比 [HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML) 相对于文本。

SVG的主要特点为：**描述简单图形体积小，放大不失真，多平台支持好**

#### 延伸-vector icon

考虑到位图的优势，仔细想想在web端或者移动端最适合用位图的地方可能就是icon图标了。
比如一个返回按钮，只是传达了二条线条的图片信息，如果用位图来表示，那么除去二条线条之外的所有像素其实都是无效信息，并且随着放大还会出现失真的情况。
这个时候位图的优势就出来了，**以最小的信息在不会失真的情况下表示出有效的返回图标信息**。

矢量图图标就是针对位图的这一痛点的一种解决方案。
通过将svg矢量图转化字体文件之后在web端通过font face进行显示，在移动端可以通过react-native-vector-icon进行显示。
**字体文件中只包含了所需要的icon的图像信息，并且渲染时效率很高。**

## 动效设计

针对于前端的动效设计，Lottie定义了一种新的处理方式。
相对于gif使用位图实现动效，lottie借鉴了矢量图的设计方式，将动效果所蕴含的信息打包在一个json文件里面，
并通过在原生平台上解析json文件并放入嵌入的canvas的方式实现动效果。
在lottie的官方，给出了apng，gif和lottie的json文件的大小比对：
![lottie文件大小对比](http://www.deepcode.site:9000/blog/front-end-spec/20210519152217.jpg)
可见使用lottie极大减小了文件的大小。

lottie也可以用于做一些文本的动态替换，比如抢红包效果之类的，可以在前端实现很炫酷的动效。

贴几个开放的动画分享平台，下载下来json可以直接放在lottie中播放。
[免费动画icon1](https://lordicon.com/icons)
[免费动画icon2](https://icons8.com/free-animated-icons)
[官方动画社区](https://lottiefiles.com/)
[在线编辑lottie颜色](https://magna25.github.io/lottie-editor/.)

但是除了动态文本替换，在一些可以随着动态数据变化的动画lottie就显得无能为力了，比如一个电池电量动画要随着值的改变动态上升下降，这个时候lottie做起来就很麻烦了，设计师要定义动画固定的帧数，前端还要动态根据值计算从哪一帧开始播放，相比于移动端自己实现的话便捷不了多少，所以有的时候为了减少设计师的工作量还是需要掌握一些原生上的动画绘制的。

如果涉及到view的动效lottie就无能为力了，lottie做的动画只限于lottie自己产生的canvas中。
所以一些button的透明度改变或者页面之间的hero animation是不能使用lottie的。
