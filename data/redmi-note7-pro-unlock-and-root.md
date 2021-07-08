# 记一次Redmi note7 pro unlock(bootloader) and root

## fastboot 和 bootloader

在很多嵌入式系统中(android也是一种嵌入式系统base on linux)并没有BIOS这样的固件程序，整个系统的启动全靠一个叫bootloader的引导程序去加载操作系统内核。
> 比如在一个基于ARM7TDMI core的嵌入式系统中，系统在上电或复位时通常都从地址0x00000000处开始执行，而在这个地址处安排的通常就是系统的BootLoader程序。

说白了fastboot就是一个通讯协议，能在手机进入fastboot模式的时候与bootloader进行通信
直接向手机的各个分区刷入.img文件以达到分区重新烧写的目的。

关于线刷和卡刷的区别如下:

**线刷：** 直接想手机硬盘写入*.img 文件，我个人觉得这种方法比较快捷，而且省事。但是必须借助电脑和数据线。  
也就是通过bootloader直接刷分区。

**卡刷：** 就是利用recovery的从SD卡中更新系统的这个功能，如果你想刷第三方Rom，必须刷入个第三方recovery，只有fastboot模式才能刷recovery.img。卡刷有个限制，必须要把想要更新的ROM（Android系统）拷贝到SD卡上。如果手机已经是砖了。那只能用线刷了。
关于recovery下面会解释。

不管是通过recovery或者fastboot刷分区都需要先解锁bootloader，因为刷入第三方custom recovery也需要通过fastboot刷入，所以**要通过fastboot刷分区必须先解锁bootloader**

## 解锁bootloader

**首先你需要一个不那么贵甚至你随时可以换新的手机**(Readmi note7 pro)
> ov厂会锁bootloader而且boot.img都是经过加密的，用在线二进制编辑打开可以看到OPPOENCRYPTION的字样说明加过密，在xda上有python的解密脚本，但是我自己未验证过

**首先万事的第一步就是解锁bootloader.**

在解锁之前需要安装android必备的环境(platform-tools),android studio的sdk manager可以直接更新。

Redmi note7 pro需要如下步骤 :

1. 进入开发者模式打开*OEM解锁*并在 *设备解锁状态*绑定小米账号。（不要用cable连接电脑）
2. 关机后按 Volume Down + Power 进入fastboot模式（会看到一个带帽子的小米，不要用cable连接电脑）
3. 在电脑上下载[小米官方解锁工具](https://www.miui.com/unlock/index.html),登录进入显示未连接手机，这个时候拿cable连电脑，点解锁就可以啦。

**这里需要注意的一点就是platform-tools一定要是最新的，因为adb 和 fastboot都是这个文件夹下的命令，否则会出现找不到设备的情况。还有就是手机的驱动要在电脑上提前安（连接电脑就会自动安，当然是在开机状态下）**
> 驱动要是真没有了可以在设备管理器中手动更新驱动，选择下载的unlock程序中的driver文件夹。

## unlock 后 install Magisk for root

我安的是Magisk 23.0 , [官方教程](https://magiskroot.net/magisk-app/)提供了两种方式 :

1. Patching Images
2. Custom Recovery

Patching Images的原理就是使用Magisk manager application将一个补丁安装到boot.img或者recovery.img上，然后重启手机的时候自然加载，这样来说对系统是没有更改的，是官方推荐的方式。
如果手机带boot ramdisk的话就patch 到boot.img上，如果不带的话就patch到recovery.img上
然后通过fastboot命令去刷入对应的分区:
```
fastboot flash boot /path/to/magisk_patched.img
fastboot flash recovery /path/to/magisk_patched.img
```
这里只所以没有采用该方式是因为通过Magisk manager 检测Redmi note 7 pro不带boot ramdisk并且recovery.img文件我也找不到（解压官方的ROM并没有这个文件，第三方recovery的文件我感觉也不像)
这里有一段摘录:

	I just installed the latest MIUI 12.5 weekly rom and I'm facing the same issues.  
	The new [Magisk installation instructions](https://topjohnwu.github.io/Magisk/install.html) provide 3 options:  
		1. Install by patching boot.img, best approach (no booting into recovery every reboot to activate Magisk) but you need to have ramdisk support (indicated in the Magisk app).  
		2. Install by patching recovery.img, when no ramdisk support, but you need to boot to recovery on every boot/reboot otherwise Magisk isn't loaded.  
		3. Install by renaming Magisk.apk to Magisk.zip and flash using custom recovery. Now considered 'legacy' install method by Magisk, better to use the 1st or 2nd option according to the instructions.  
	  
	I have found that my device (Mi 9T) does not use ramdisk, so option 1 is not usable for me.  
	  
	Trying option 2 is a little unclear as to which recovery to use. It seems like they refer to using the stock recovery pulled from the ROM, but that recovery does not exist in the Xiaomi.eu ROMs. Also, if you were to patch and flash the recovery pulled from the ROM, you'll end up with the stock recovery which you cannot use to flash/update the Miui ROMs, perform backups etc...  
	I tried patching the TWRP recovery that was installed on the phone, but it resulted in the phone booting to fastboot when following the instructions to boot with Magisk support, so I think you cannot use TWRP or other custom recoveries with method 2.  
	  
	Renaming the Magisk.apk to Magisk.zip is the only method that successfully installed Magisk for me when using a Xiaomi.eu ROM.  
	  
	To get back to your issue, are you able to try the same with TWRP recovery instead of OrangeFox? Maybe there is some compatibility issue with OrangeFox.

所以最终还是决定先安装custom recovery(TWRP),再通过zip的方式安装Magisk。
[安装TWRP](https://twrp.me/xiaomi/xiaomiredminote7pro.html)也需要用fastboot将recovery.img刷入recovery分区。
官方提供了详细的教程，值得注意的一点就是 :
**在刷入twrp完成后，fastboot reboot重启，接着直接长按Volume Up + Power 进入twrp，要不就会被stock recovery覆盖。**


在进入twrp之后直接install Magisk-23.0.zip 然后reboot就可以了。

需要注意的是:
**要允许修改system分区（不允许修改的话可能会出现/metadata mount的情况)**
> 我也是安了两次才成功的，第一次好像没有允许修改system分区，安装Magisk直接失败了，报的就是/metadata mount fail，然后在设置里面恢复默认设置，取消勾选*不允许修改system分区*，然后再安就成功了.

## after install Magisk

do some funny ~

## ref
https://twrp.me/xiaomi/xiaomiredminote7pro.html
https://magiskroot.net/magisk-app/
https://magiskroot.net/install-download-magisk-manager-latest/
https://xiaomi.eu/community/threads/magisk-22-resolved.60102/
[Magisk的原理](https://topjohnwu.github.io/Magisk/boot.html)
