{{{
    "title"    : "Android 与 IOS 关于wifi信息获取的适配",
    "tags"     : ["android", "ios","wifi"],
    "category" : "mobile develop",
    "date"     : "06-29-2021"
}}}

在app开发过程中，有时候我们可能需要去对当前智能手机的网络信息，比如当前是否处于Wi-Fi连接状态，连接的Wi-Fi的名字（SSID）又是什么，连接的频率是2.4Hz或者是5.0Hz的。
而且这些信息在Android各个版本之间的获取方式以及所需权限也都是不一样的。

## Android中wifi信息的获取

在Android8.0到Android11我们都可以使用WifiManager进行wifi信息的获取
```
WifiManager wifi;
wifi = (WifiManager) reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
try {  
	    WifiInfo info = wifi.getConnectionInfo();  
		 // This value should be wrapped in double quotes, so we need to unwrap it.  
		 // https://stackoverflow.com/a/34848930/5732760  String ssid = null;  
		 if (info.getSupplicantState() == SupplicantState.COMPLETED) {  
		        ssid = info.getSSID();  
		 if (ssid.startsWith("\"") && ssid.endsWith("\"")) {  
		            ssid = ssid.substring(1, ssid.length() - 1);  
		  }  
    }  
    promise.resolve(ssid);  
} catch (Exception e)
    promise.resolve(null);  
}
```
但是根据[官方文档](https://developer.android.com/guide/topics/connectivity/wifi-scan#wifi-scan-permissions)所描述的Wi-Fi探测权限，我们需要如下权限开启并声明：
-   [`ACCESS_FINE_LOCATION`](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION)
-   [`ACCESS_COARSE_LOCATION`](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION)
-   [`CHANGE_WIFI_STATE`](https://developer.android.com/reference/android/Manifest.permission#CHANGE_WIFI_STATE)

**这其中需要动态申请的只有FINE_LOCATION(已包含COARSE_LOCATION).**

值得注意的一点是在Android9.0及以上版本需要确保手机的**Location service处于开启状态**，所以我们在获取前需要进行判断:
```
//ensure Location services are enabled on the device  
let enabled = DeviceInfo.isLocationEnabledSync();  
if (enabled) {  
  //continuce fetch wi-fi information
  ...
} else {  
    showToast('请打开位置服务后重试');  
}
```
这就能适配到2021年的大部分设备，对于极少数安装了Android S（Android 12)的用户，就不能使用WifiManager获取了：
从[官方api](https://developer.android.com/reference/android/net/wifi/WifiManager#getConnectionInfo%28%29)可以看出getConnectionInfo在Android S已经废弃，所以我们要对其进行适配:
```java
if (Build.VERSION.SDK_INT > 30) {
	    // On Android S+, need to use NetworkCapabilities to get the WifiInfo.  
	  Network[] allNetworks = connectivityManager.getAllNetworks();  
	  // TODO(curranmax): This only gets the WifiInfo of the first WiFi network that is  
	  // iterated over. On Android S+ there may be up to two WiFi networks.  
	 // https://crbug.com/1181393  for (Network network : allNetworks) {  
	        NetworkCapabilities networkCapabilities =  
	                connectivityManager.getNetworkCapabilities(network);  
	 if (networkCapabilities != null  
	  && networkCapabilities.hasTransport(  
	                NetworkCapabilities.TRANSPORT_WIFI)) {  
	            TransportInfo transportInfo = networkCapabilities.getTransportInfo();  
	 if (transportInfo instanceof WifiInfo) {  
	                try {  
	                    WifiInfo info = (WifiInfo) transportInfo;  
	  // This value should be wrapped in double quotes, so we need to unwrap it.  
	 // https://stackoverflow.com/a/34848930/5732760  String ssid = null;  
	 if (info.getSupplicantState() == SupplicantState.COMPLETED) {  
	                        ssid = info.getSSID();  
	 if (ssid.startsWith("\"") && ssid.endsWith("\"")) {  
	                            ssid = ssid.substring(1, ssid.length() - 1);  
	  }  
	                    }  
	                    promise.resolve(ssid);  
	  } catch (Exception e) {  
	                    promise.resolve(null);  
	  }  
	            }  
	        }  
	    }  
}
```

## IOS中wifi信息的获取

首先我们需要购买 apple 开发这账号，在 ion/FinsiotApp/FinsiotApp.entitlements，FinsiotAppRelease.entitlements 文件中添加

```  
<dict>  
 <key>com.apple.developer.networking.wifi-info</key> <true/></dict>  
```

#### IOS获取Wi-Fi频率
在IOS中wifi频率以及wifi信息的获取是分开的。
如果要获取Wi-Fi频率的话需要向iphone申请**Network Extension**功能（需要通过邮件申请，很难批下来）
申请过后通过[Hotspot Helper](https://developer.apple.com/documentation/networkextension/hotspot_helper?language=objc)获取频率。
> 在react-native 端可以通过[react-native-wifi-frequency](https://github.com/juliehubs/react-native-wifi-frequency)进行获取

#### IOS获取Wi-Fi名称
[在IOS中获取Wi-Fi名称（SSID）需要精确定位权限](https://blog.csdn.net/ios1501101533/article/details/109306856)。
在申请成功Location权限之后还要申请FullAccuracy Permission。
**注意FullAccuracy 必须在Location之后申请！**
