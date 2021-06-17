


https://blog.csdn.net/xiangguiwang/article/details/76400805
关于.DER编码证书的.CER和.CRT格式


nginux配置：https://wott.io/blog/tutorials/2019/07/15/mtls-with-nginx


客户端配置服务器证书校验:https://blog.csdn.net/sunny2come/article/details/79912024


android 双向认证:https://zhuanlan.zhihu.com/p/142568074


生成密钥库（公钥+私钥）

     keytool -genkeypair -alias client -keyalg RSA -validity 3650 -keypass finsiot0322kps -storepass finsiot0322sps -keystore client.jks

导出公钥

     keytool -export -alias client -file client.cer -keystore client.jks -storepass finsiot0322sps 

.CER格式转.CRT格式

    https://stackoverflow.com/questions/642284/do-i-need-to-convert-cer-to-crt-for-apache-ssl-certificates-if-so-how
    
    Basically there are two CER certificate encoding types, DER and Base64. When type DER returns an error loading certificate (asn1 encoding routines), try the PEM and it shall work.
    
    `openssl x509 -inform DER -in certificate.cer -out certificate.crt`
    
    `openssl x509 -inform PEM -in certificate.cer -out certificate.crt`


从jks中导出私钥

    https://blog.csdn.net/laoyiin/article/details/102861019
    https://www.jianshu.com/p/ba35c7f47d8a
    
    keytool -v -importkeystore -srckeystore client.jks -srcstoretype jks -srcstorepass finsiot0322sps -destkeystore client.pfx -deststoretype pkcs12 -deststorepass finsiot0322sps -destkeypass finsiot0322kps
    
    openssl pkcs12 -in client.pfx -nocerts -nodes -out client_private.key
