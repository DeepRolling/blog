{{{
    "title"    : "How to install minIO service",
    "tags"     : [ "minIO", "docker" ],
    "category" : "install",
    "date"     : "5-13-2021"
}}}

MinIo is an opensource oss framework similar to QINIU Cloud.

## 安装原因

minIO是一款开源的oss存储framework，选它的初衷是为了搭建图床写博客。
开始我考察了一些云存储方案，但是还是觉得不满意，主要原因如下：

**七牛云之类的第三方服务需要收费，需要单独申请一个账号，搭配PicGo之类的工具可以调用七牛云的api进行上传，还得进行很多参数的配置，针对我现阶段的简单需求太复杂了。**

**github倒是免费的图床存储方案，但是由于服务器在国外有时访问会慢，再加上github是一个友好的社区，不适合拿来做这个，也是搭配PicGo使用，需要token。**

然后后来就想到可不可以在我买了好几年的腾讯云服务器上搭建一个对象存储，除了存储图片还能存一些别的东西。
随即在网上寻找开源解决方案就找到了minIO,吸引我的是minIO自带一个web控制台，极大方便了安装后的操作。

## 步骤

按照官网的docker直接运行如下命令:
```
docker run -p 9000:9000 \
  --name minio1 \
  -v ${HOME}/pics:/data \
  -e "MINIO_ROOT_USER=AKIAIOSFODNN7EXAMPLE" \
  -e "MINIO_ROOT_PASSWORD=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" \
  minio/minio server /data
```
这里需要注意的是我将docker file system中的数据持久化到了host主机中的~/pics目录（考虑到服务会挂不想数据丢失).

然后在腾讯云服务器上配置防火墙将9000端口的tcp开开，重启服务器。
这个时候访问发现docker挂掉了，查看状态重新开启

    [root@VM-0-4-centos ~]# systemctl status docker
    ● docker.service - Docker Application Container Engine
       Loaded: loaded (/usr/lib/systemd/system/docker.service; disabled; vendor preset: disabled)
       Active: inactive (dead)
         Docs: https://docs.docker.com
    [root@VM-0-4-centos ~]# systemctl restart docker.service
然后重新开启minIO服务

    [root@VM-0-4-centos ~]# docker ps -a
    CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS                      PORTS     NAMES
    ee3575e5f06a   minio/minio   "/usr/bin/docker-ent…"   35 minutes ago   Exited (0) 10 minutes ago             minio1
    bcffaa3ddcb8   hello-world   "/hello"                 3 weeks ago      Exited (0) 3 weeks ago                serene_elgamal
    [root@VM-0-4-centos ~]# docker start ee3575e5f06a
    ee3575e5f06a

这个时候在浏览器上访问9000端口就能看到minIO的控制台页面啦，下面我就上传一个图试一下：
emmmmm，这个时候碰到问题了，在控制台share出来的url在浏览器直接打开会跳转到控制台并定位到具体的文件位置，并不是直接打开图片的。
比如下面这个url:
http://www.deepcode.site:9000/blog/minio-install/20210513111341.jpg?Content-Disposition=attachment%3B%20filename%3D%22minio-install%2F20210513111341.jpg%22&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20210513%2F%2Fs3%2Faws4_request&X-Amz-Date=20210513T032814Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=f38c1d30a63749c6ddf10283245502d40c3501349e4440c52c294288627b3961
解决方案：
将bucket的Bucket Policy新增Read only，这样在浏览器中就可以访问了
![](http://www.deepcode.site:9000/blog/minio-install/20210513111341.jpg?Content-Disposition=attachment;%20filename=%22minio-install/20210513111341.jpg%22&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE/20210513//s3/aws4_request&X-Amz-Date=20210513T032814Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=f38c1d30a63749c6ddf10283245502d40c3501349e4440c52c294288627b3961)
但是这个url的有效时间最多是7天，也就是说7天之后访问这个帖子的话图就看不到了。
查阅官方文档发现需要借助MinIO Client (mc)更改设置为可通过路径直接访问:

    [root@VM-0-4-centos ~]# docker pull minio/mc
    Using default tag: latest
    latest: Pulling from minio/mc
    8f403cb21126: Already exists
    65c0f2178ac8: Already exists
    87e8b43cb741: Pull complete
    ddc56bc88f58: Pull complete
    f81574fa66e2: Pull complete
    Digest: sha256:6ded7aa1bc547752367df2496c6ab89a6c6ca71a8af88c976b4ea69b33054856
    Status: Downloaded newer image for minio/mc:latest
    docker.io/minio/mc:latest
    [root@VM-0-4-centos ~]# docker run -it --entrypoint=/bin/sh minio/mc
    sh-4.4#  ls
    sh: $'\346\230ls': command not found
    sh-4.4# ls
    bin  boot  dev	etc  home  lib	lib64  licenses  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
    sh-4.4#  config host add minio http://127.0.0.1:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    sh: config: command not found
    sh-4.4# config host add minio http://127.0.0.1:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    sh: config: command not found
    sh-4.4# mc config host add minio http://127.0.0.1:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    mc: Configuration written to `/root/.mc/config.json`. Please update your access credentials.
    mc: Successfully created `/root/.mc/share`.
    mc: Initialized share uploads `/root/.mc/share/uploads.json` file.
    mc: Initialized share downloads `/root/.mc/share/downloads.json` file.
    mc: <ERROR> Unable to initialize new alias from the provided credentials. Get "http://127.0.0.1:9000/probe-bucket-sign-wlge4jyhp5sv/?location=": dial tcp 127.0.0.1:9000: connect: connection refused.
    sh-4.4# mc config host add minio http://172.0.0.1:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    mc: <ERROR> Unable to initialize new alias from the provided credentials. Get "http://172.0.0.1:9000/probe-bucket-sign-15q214j1zj6q/?location=": dial tcp 172.0.0.1:9000: i/o timeout.
    sh-4.4# mc config host add minio http://www.deepcode.site:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Added `minio` successfully.
    sh-4.4# mc  policy  set  download  minio/blog
    Access permission for `minio/blog` is set to `download`
    sh-4.4# exit
    exit

然后我们就可以输入路径访问图片啦：
![这是一个在图床上的图片](http://www.deepcode.site:9000/blog/minio-install/20210513111341.jpg)

## 思考
一开始以docker run 的-e参数是设置环境变量到宿主机，
但是在尝试echo $var的时候并没有输出
后来才知道-e参数其实是设置到docker容器的env里面。
所以如果忘记了当时启动容器时注册的用户名密码，可以运行该命令查看

    docker inspect minio1
在输出中的Env字段中就可以看到了。

