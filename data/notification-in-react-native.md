{{{
    "title"    : "How to achieve notification in React-Native",
    "tags"     : ["react-native"],
    "category" : "mobile develop",
    "date"     : "11-02-2021"
}}}


Notification is a importent part of mobile application development .As you see , most  application have serveral functionality to interact with user .

For example , the Alarm application can notificate user it's time to do something. And the food-express application can remind user to get them food back , and if there are some problem open when delivery-man delivery the fresh food to you.

On acount of **serveral custom ROM base on AOSP(Android Open Source Project)** in China , send notification to phone become **more complicated** when user kill the running application.
>By the way , the behavior of built some application user not wantted in smart-phone is really sicky ! Fuck the manufacturers!

We know that the offline notification is importent for us , Imagine you would not receive the book success notification after you kill the airport ticket book application . It's definitely terrible. So for achieve this capbility ,we need integrate the library published by manufactuters to our project.

# In-application notification

For cost and fast-development reasons , I decide use third-part notification push facilitator : [JPush](https://www.jiguang.cn/).
To push notification to our device when our application is alive , the only thing we need to do is install the jpush package to our project :

    yarn add jpush-react-native
    yarn add jcore-react-native

For some compilement problem , you also need **do some tedious work** for config Jpush account even the auto-linking(introducing in react-native0.60) already widely used .

After that , for make this library work properly , you need write some code in **entry file** in different platform :
>**MainApplication.java** and **app/build.gradle** for Android
>**AppDelegate.m** for IOS
>For the detail , also see [README.md](https://github.com/jpush/jpush-react-native)  metioned above .

After these work , we can use this library in our react-native code :

```
import JPush from 'jpush-react-native';
JPush.getRegistrationID(res => {  
   //use res.registerID for logic code 
});
```
By now , you can send some in-application notification by use dashboard of Jpush , fill registrationId and write some title , content , then click send notification :
![test notification](http://www.deepcode.site:9000/blog/jpush/jpush-test-push.jpg)

We are done here , the basic functionality of this library already integrated , congratulation!!!

# System-level notification (offline push notification)

But don't count your chickens before they hatched . The in-application notification just a piece of shit . The important functionality is offline-notification ,  it also very important for our user , isn't it ?

I will talk some thought of how to build a wrapper library to offer offline-notification ability to us :

> notice : these step is only for **Android platform** , for **Ios system** , you need config the offical **APS(Apple push service) with Jpush** to get things work .

I wanna create a library that ship with all third-part notification library , so that I can integrate all platforms by install this package and fill the keys applyed in the ROM offical website .
```
npx create-react-native-library react-native-jpush-rom-wrapper
```
> The reason why I put the word "wrapper" to name of this library is that this library represent a thought of composition .
> Librarys should become individual ,

After this instruction , the library dir look like below :
```
.  
├── CONTRIBUTING.md  
├── LICENSE  
├── README.md  
├── android  
│ ├── build.gradle  
│ └── src  
│     └── main  
│         ├── AndroidManifest.xml  
│         └── java  
│             └── com  
│                 └── reactnativejpushromwrapper  
│                     ├── JpushRomWrapperModule.java  
│                     └── JpushRomWrapperPackage.java  
├── babel.config.js  
├── example(have some file)  
├── ios  
│ ├── JpushRomWrapper.h  
│ ├── JpushRomWrapper.m  
│ └── JpushRomWrapper.xcodeproj  
│     ├── project.pbxproj  
│     └── project.xcworkspace  
│         └── contents.xcworkspacedata  
├── old-project-structure.txt  
├── package.json  
├── react-native-jpush-rom-wrapper.podspec  
├── scripts  
│ └── bootstrap.js  
├── src  
│ ├── __tests__  
│ │ └── index.test.tsx  
│ └── index.tsx  
├── tsconfig.build.json  
└── tsconfig.json  
  
46 directories, 68 files
```
We can see the file under the android folder is un-compiled gradle project , if you need pull some dependices down , you can use AndroidStudio open the android folder and wait the build process finish , you will see the standard folder structure you familar with .

Then we can modify build.gradle file  to add some library dependices , after add these lines , build.gralde looks like below :
> For HUAWEI library you also need import a specified Gradle build plugin in this file.

```
buildscript {  
       repositories {  
           google()  
           jcenter()  
           mavenCentral()  
           maven {url 'https://developer.huawei.com/repo/'}  
       }  
       dependencies {  
           classpath 'com.android.tools.build:gradle:3.5.3'  
  //huawei gradle plugin  
           classpath 'com.huawei.agconnect:agcp:1.4.1.300'  
       }  
}  
  
apply plugin: 'com.android.library'  
apply plugin: 'com.huawei.agconnect'  
  
def safeExtGet(prop, fallback) {  
    rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback  
}  
  
android {  
    compileSdkVersion safeExtGet('JpushRomWrapper_compileSdkVersion', 29)  
    buildToolsVersion safeExtGet('JpushRomWrapper_buildToolsVersion', '29.0.2')  
    defaultConfig {  
        minSdkVersion safeExtGet('JpushRomWrapper_minSdkVersion', 16)  
        targetSdkVersion safeExtGet('JpushRomWrapper_targetSdkVersion', 29)  
        versionCode 1  
        versionName "1.0"  
  
    }  
  
    buildTypes {  
        release {  
            minifyEnabled false  
        }  
    }  
    lintOptions {  
        disable 'GradleCompatible'  
    }  
    compileOptions {  
        sourceCompatibility JavaVersion.VERSION_1_8  
        targetCompatibility JavaVersion.VERSION_1_8  
    }  
}  
  
repositories {  
    mavenLocal()  
    maven {  
        // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm  
  url("$rootDir/../node_modules/react-native/android")  
    }  
    google()  
    jcenter()  
    mavenCentral()  
    maven {url 'https://developer.huawei.com/repo/'}  
}  
  
dependencies {  
    //noinspection GradleDynamicVersion  
    implementation "com.facebook.react:react-native:+" // From node_modules  
  
 //huawei message server    implementation 'com.huawei.hms:push:5.3.0.301'  
  //jpush huawei plugin  
    api 'cn.jiguang.sdk.plugin:huawei:4.2.8'  
  //oppo  
    api 'cn.jiguang.sdk.plugin:oppo:4.2.8'  
  //xiaomi  
    api 'cn.jiguang.sdk.plugin:xiaomi:4.2.8'  
  //vivo  
    api 'cn.jiguang.sdk.plugin:vivo:4.2.8'  
  //meizu  
    api 'cn.jiguang.sdk.plugin:meizu:4.2.8'  
}
```
When we add this package to our project , android will compile this library by read  build.gradle file and download these dependices and our application will have ability of ROM custom notification .

**The last step is we need create serveral application in Manufactuter's developer offical website , copy the key and secrets of these application we just created to jpush dashboard.**

For the more detail information and configration , such as how to apply secret keys of serveral notification server and do some extra configration to get whole notification functionality work ,  see README in my published [ wrapper project](https://github.com/DeepRolling/react-native-jpush-rom-wrapper) .
