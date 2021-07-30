#### there have two way download js bundle from metro server:

1. use adb reverse tcp:8081 tcp:8081 forward local tcp port to computer tcp port ,
so use usb-line you can download js-bundle from computer extremely fast
defect : you must have use-line and adb env setup
advantage : fast download and not not need let your phone and computer on same LAN


2. set debug server host to 192.168.x.xxx:8081 in your application
so you can download js-bundle from remote computer without use-line connect
defect : js-bundle can be download slowly when WIFI connect is slow
advantage : you can download js-bundle from any computer in same LAN


#### Animation.loop have small pause between each animation cycle
solution:https://stackoverflow.com/questions/56155555/react-native-animation-has-a-small-pause


#### debug android in release mode
solution : add debuggable true in release in buildTypes
