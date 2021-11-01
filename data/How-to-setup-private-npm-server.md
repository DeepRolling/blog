{{{
    "title"    : "How to setup private npm server",
    "tags"     : ["frontend","linux"],
    "category" : "frontend develop",
    "date"     : "04-27-2021"
}}}


This post describe the steps of set up a private npm server and some matters need attention.

## 原因
只所以要搭建npm私有服务器主要考虑到如下两个原因：

- 针对一些open source的第三方包的bug，官方没有及时合并pull request或者我们基于第三方包进行的一些定制性的更改可以发布到私有服务器上方便我们拉取
- 我们自主研发的模块由于某些原因不想发布到外网

## 选型

经过多个npm私服的对比我选取了verdaccio(https://verdaccio.org/)作为内网npm服务，
在verdaccio官网针对其的概括性介绍为：A lightweight open source private npm proxy registry
从这里可以看出verdaccio具有如下优势:

- 轻量级易部署（官方提供了方便的docker镜像用来进行服务器部署）
- 可作为npm代理仓库针对已拉取的外网npm包进行缓存，提升下次拉取速度
- 可实现内网外网隔离，可使用内网包对相同名称的外网包进行覆盖

## 搭建步骤

这里为了不污染服务器环境，选取了docker进行verdaccio的部署。
`docker pull verdaccio/verdaccio`拉取docker镜像
`docker run -it --name verdaccio -p 4873:4873 verdaccio/verdaccio`启动docker容器

>这里踩了一个坑，一开始运行的是官网的docker运行命令：
>docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio，
>比正确的命令多了一个 --rm 参数
>然后导致服务器重启的时候以前传到私服上的npm包全部被清除掉了
>后来经过查询文档得知 --rm参数会在容器退出的时候自动清理容器内部的文件系统（在verdaccio中用于存放为们上传的包）

如果我们需要让verdaccio在后台运行，需要在运行docker的时候加上-d选项


## 使用



### 手动删除已上传的npm包

如果我们想要删除在verdaccio上的npm包，使用npm unpublish指令是不行的 ( unsolved issue )
我们需要在verdaccio的docker容器中手动删除,步骤如下:

> 1 . 使用docker inspect指令去查看verdaccio docker容器创建的虚拟卷
> `docker inspect -f '{{ json .Mounts }}' verdaccio`
> [{"Type":"volume","Name":"fc519bb149c666e49d15eaf625dac09ad6c1fcd57953a19565146bf31679bad0","Source":"/var/lib/docker/volumes/fc519bb149c666e49d15eaf625dac09ad6c1fcd57953a19565146bf31679bad0/_data","Destination":"/verdaccio/storage","Driver":"local","Mode":"","RW":true,"Propagation":""}]
> 我们可以知道verdaccio只创建了一个虚拟卷，路径为 : /verdaccio/storage
> 2 . 知道存储路径以后使用docker exec -it verdaccio sh 创建和verdaccio容器的交互式shell
> > ```shell
> >~ $ cd /verdaccio/storage/
> >/verdaccio/storage $ ls
> >data      htpasswd
> >/verdaccio/storage $ cd data/
> >/verdaccio/storage/data $ ls
> >@antv                                         create-ecdh                                   https-browserify                              move-concurrently                             > >rimraf
> >@babel                                        create-error-class                            https-proxy-agent                             mqtt-match                                    > >ripemd160
> >@bcoe                                         create-hash                                   human-signals                                 mqtt-pattern                                  > >rnpm
> >@cnakazawa                                    create-hmac                                   husky                                         mqtt-wildcard                                 > >rnpm-plugin-install
> >@commitlint                                   create-react-class                            iconv-lite                                    ms                                            > >rnpm-plugin-link
> >@egjs                                         create-react-native-library                   ieee754                                       ms-rest                                       > >rsvp
> > ```
> 3 . rm -rf ${specified_package}删除包
