{{{
    "title"    : "React Native CD experience record",
    "tags"     : ["react-native","CI-CD"],
    "category" : "mobile develop",
    "date"     : "09-09-2021"
}}}

记一次在Centos7上做react-native的CI/CD的流程

## 需要安装的环境

Node v16.4.0
Some extra package（yarn nrm )
JDK
Android SDK


## 安装思路

首先想要编译react-native的第一步我们是需要将我们的js代码打包成bundle文件并放入android目录中，我们给它取个名字叫**js编译阶段**。

**在编译js代码阶段有如下步骤:**

1. 安装node环境，这样我们的js代码构建工具才能和系统交互进行文件读取编译
2. 在有node环境之后我们需要进行yarn以及nrm的安装
> yarn是当前rn项目采用的包管理器，隐藏了npm繁琐的实现，nrm的安装是为了从内网私有npm仓库中拉取私有软件包
> ```bash
> npm install --global yarn
> yarn add -G nrm 
> nrm add finsiot http://192.168.1.198:4873/
> nrm use finsiot
> ```
3. 然后使用yarn install 在项目根目录拉取项目依赖的软件包

在js编译好之后我们便可以进行android原生代码的编译，我们给它取个名字叫**native编译阶段**。

**在编译native代码阶段有如下步骤:**

1. 安装JDK开发环境
2. 下载Android SDK并设置环境变量
3.  在android项目里面有gradle的包装器并且已有相应的脚本，所以我们直接在android目录执行命令就可以进行apk文件的构建了
> 我们并不需要进行gradle的下载，因为Android项目采用了[gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)的方式去管理gradle版本
> ```bash
> cat android/gradle/wrapper/gradle-wrapper.properties
> android/gradlew ${the command you want to execute} #在执行构建命令的时候如果没有安装gradle会自动下载
> ```

## 遇到的问题

### **在编译js代码阶段**
我们的依赖有很多都在内网npm服务器上，所以要用nrm将yarn的registry换位内网地址。
> 其实nrm不会改变yarn的config，只会改变npm的config，但是npm的config比yarn的config优先级要高,也就是说[yarn会优先 > 采用npm中配置的仓库地址](https://github.com/yarnpkg/yarn/issues/4862#issuecomment-368688262)

### 在编译native代码阶段

**第一个问题 ：在linux上安装Android SDK。**
由于没有Andriod Studio图形化的SDK Manager,所以我们需要借助[sdkmanager](https://developer.android.com/studio/index.html#command-tools) 这条命令去安装sdk，
在这里下载的时候我们需要先创建好sdk的目录，然后将下载下来的东西放在sdk下面的cmdline-tools/tools目录中
```bash
[root@localhost local]# ls
androidsdk  bin  etc  games  include  java  lib  lib64  libexec  mysqldata  nginx  node  sbin  share  src  zentao
[root@localhost local]# cd androidsdk/
[root@localhost androidsdk]# ls
build-tools  cmdline-tools  emulator  licenses  patcher  platforms  platform-tools  tools
[root@localhost androidsdk]# cd cmdline-tools/tools/
[root@localhost tools]# ls
bin  lib  NOTICE.txt  source.properties
```

正确放置sdkmanager之后我们就可以设置ANDROID的环境变量了:
```bash
[root@localhost tools]# cat ~/.bash_profile 
...
export ANDROID_HOME=/usr/local/androidsdk/  
export ANDROID_SDK_ROOT=/usr/local/androidsdk/  
export PATH=$PATH:$ANDROID_HOME/emulator  
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/tools/bin  
export PATH=$PATH:$ANDROID_HOME/platform-tools
...
```

***必须将sdkmanager正确放在指定目录中并且设置相应环境变量，否则会提示sdk找不到***
在设置完成之后我们便可以使用sdkmanager去下载我们所需要的sdk:
因为当前项目是用API 30的sdk编译的，所以我们只下载API 30的sdk以及构建工具
```bash
[root@localhost /]# sdkmanager --list | grep 30
  build-tools;30.0.2   | 30.0.2  | Android SDK Build-Tools 30.0.2 | build-tools/30.0.2  
  emulator             | 30.8.4  | Android Emulator               | emulator            
  platforms;android-30 | 3       | Android SDK Platform 30        | platforms/android-30
  build-tools;30.0.0                                                                       | 30.0.0       | Android SDK Build-Tools 30                                          
  build-tools;30.0.1                                                                       | 30.0.1       | Android SDK Build-Tools 30.0.1                                      
  build-tools;30.0.2                                                                       | 30.0.2       | Android SDK Build-Tools 30.0.2                                      
  build-tools;30.0.3                                                                       | 30.0.3       | Android SDK Build-Tools 30.0.3                                      
  emulator                                                                                 | 30.8.4       | 

[root@localhost /]# sdkmanager "build-tools;30.0.2" "platforms;android-30"
```


**第二个问题 ：gradle无法连接google maven仓库下载依赖**

由于在国内无法访问google的maven仓库，所以我们需要将项目中的仓库地址换为[阿里云的镜像](https://developer.aliyun.com/mvn/guide),在其官方网站中可以看到镜像仓库中的包，但是直接访问镜像仓库地址是看不到的。（可以用于诊断一个包是否于镜像中存在）
```bash
yons@yonsdeiMac SmartTinyGrid % cat android/build.gradle 
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    ext {
        buildToolsVersion = "30.0.2"
        minSdkVersion = 21
        compileSdkVersion = 30
        targetSdkVersion = 30
        ndkVersion = "20.1.5948944"
    }
    repositories {
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/public' }
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin'}
        maven { url 'https://maven.aliyun.com/repository/central'}
    }
    dependencies {
        classpath("com.android.tools.build:gradle:4.2.1")
        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/public' }
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin'}
        maven { url 'https://maven.aliyun.com/repository/central'}
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url("$rootDir/../node_modules/react-native/android")
        }
        maven {
            // Android JSC is installed from npm
            url("$rootDir/../node_modules/jsc-android/dist")
        }
        maven { url 'https://www.jitpack.io' }
        //for jpush huawei HMS integrate repository
        maven { url 'http://developer.huawei.com/repo/' }
    }
}

```

需要注意的是如果有一些子模块的build.gradle声明了repository的话会覆盖掉根目录的地址,比如如下是react-native-card包下的build.gradle:
```bash
buildscript {
	repositories {
		mavenCentral()
		jcenter()
		maven {
		url 'https://maven.google.com/'
		name 'Google'
		}
	}
	dependencies {
		classpath 'com.android.tools.build:gradle:3.5.0'
	}
}
```
针对于这种第三方包,gradle会去google 的maven仓库拉取3.5.0版本的gradle构建工具，所以会引发timeout。
我们可以通过patch这种第三方包的方式解决这种问题。

**第三个问题 ：gradle内存溢出**

gradle是非常吃内存的，所以在只给服务器分配了2g的内存的时候会[报错](https://stackoverflow.com/a/56575872/11742589),这个时候要加大服务器的内存.