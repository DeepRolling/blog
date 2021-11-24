{{{
    "title"    : "Mysql8.0.24 change root password",
    "tags"     : ["mysql"],
    "category" : "install",
    "date"     : "09-03-2021"
}}}

I am so stupid that I often forget my mysql password ...

First at all , I googling for a solution ,and i found some clue from this [post](https://www.tecmint.com/reset-root-password-in-mysql-8/) :

```bash
systemctl stop mysqld.service     # for distros using systemd
mysqld --skip-grant-tables --user=mysql &
mysql  # Then, you can connect to the mysql server by simply running.
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_passowrd';
systemctl stop mysqld.service        # for distros using systemd
```

After that , i try to restart mysqld with systemctl command and i run into a error :
```shell
[root@VM-0-4-centos /]# systemctl restart mysqld.service
Job for mysqld.service failed because the control process exited with error code. See "systemctl status mysqld.service" and "journalctl -xe" for details.
```
So I try to look detail of this error : 
```shell
[root@VM-0-4-centos /]# systemctl status mysqld.service
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since Fri 2021-09-03 15:16:45 CST; 10min ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 32086 ExecStart=/usr/sbin/mysqld $MYSQLD_OPTS (code=exited, status=1/FAILURE)
  Process: 32042 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 32086 (code=exited, status=1/FAILURE)
   Status: "Server startup in progress"

Sep 03 15:15:01 VM-0-4-centos systemd[1]: Starting MySQL Server...
Sep 03 15:16:45 VM-0-4-centos systemd[1]: mysqld.service: main process exited, code=exited, status=1/FAILURE
Sep 03 15:16:45 VM-0-4-centos systemd[1]: Failed to start MySQL Server.
Sep 03 15:16:45 VM-0-4-centos systemd[1]: Unit mysqld.service entered failed state.
Sep 03 15:16:45 VM-0-4-centos systemd[1]: mysqld.service failed.
```
But this not clear enough to kill this problem , so i look for mysqld log file :
```shell
[root@VM-0-4-centos /]# cat var/log/mysqld.log 
2021-05-07T10:25:54.748778Z 0 [System] [MY-013169] [Server] /usr/sbin/mysqld (mysqld 8.0.24) initializing of server in progress as process 3569
2021-05-07T10:25:54.762166Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2021-05-07T10:25:55.940071Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2021-05-07T10:25:57.506890Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: v.IpFRtUv9u,
2021-05-07T10:26:01.373969Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.24) starting as process 3642
2021-05-07T10:26:01.387122Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2021-05-07T10:26:01.790727Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2021-05-07T10:26:01.952212Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: '::' port: 33060, socket: /var/run/mysqld/mysqlx.sock
2021-05-07T10:26:02.161035Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.
2021-05-07T10:26:02.161225Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
2021-05-07T10:26:02.185366Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.24'  socket: '/var/lib/mysql/mysql.sock'  port: 3306  MySQL Community Server - GPL.
2021-05-13T02:40:15.688279Z 0 [System] [MY-013172] [Server] Received SHUTDOWN from user <via user signal>. Shutting down mysqld (Version: 8.0.24).
2021-05-13T02:40:17.069220Z 0 [System] [MY-010910] [Server] /usr/sbin/mysqld: Shutdown complete (mysqld 8.0.24)  MySQL Community Server - GPL.
2021-05-13T02:40:39.060128Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.24) starting as process 1967
2021-05-13T02:40:39.112727Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2021-05-13T02:40:39.903029Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2021-05-13T02:40:40.114583Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: '::' port: 33060, socket: /var/run/mysqld/mysqlx.sock
2021-05-13T02:40:40.380391Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.
2021-05-13T02:40:40.380563Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
2021-05-13T02:40:40.407924Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.24'  socket: '/var/lib/mysql/mysql.sock'  port: 3306  MySQL Community Server - GPL.
2021-09-03T06:56:26.315839Z 16 [Warning] [MY-013360] [Server] Plugin sha256_password reported: ''sha256_password' is deprecated and will be removed in a future release. Please use caching_sha2_password instead'
2021-09-03T06:56:41.405487Z 17 [Warning] [MY-013360] [Server] Plugin sha256_password reported: ''sha256_password' is deprecated and will be removed in a future release. Please use caching_sha2_password instead'
2021-09-03T06:59:38.740656Z 21 [Warning] [MY-013360] [Server] Plugin sha256_password reported: ''sha256_password' is deprecated and will be removed in a future release. Please use caching_sha2_password instead'
2021-09-03T07:08:31.507132Z 0 [System] [MY-013172] [Server] Received SHUTDOWN from user <via user signal>. Shutting down mysqld (Version: 8.0.24).
2021-09-03T07:08:32.777765Z 0 [System] [MY-010910] [Server] /usr/sbin/mysqld: Shutdown complete (mysqld 8.0.24)  MySQL Community Server - GPL.
2021-09-03T07:09:42.572875Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.24) starting as process 31156
2021-09-03T07:09:42.589981Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2021-09-03T07:09:43.021166Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2021-09-03T07:09:43.312074Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Socket: /var/run/mysqld/mysqlx.sock
2021-09-03T07:09:43.483418Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.
2021-09-03T07:09:43.483576Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
2021-09-03T07:09:43.497223Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.24'  socket: '/var/lib/mysql/mysql.sock'  port: 0  MySQL Community Server - GPL.
2021-09-03T07:11:14.021436Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.24) starting as process 31460
2021-09-03T07:11:14.046225Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2021-09-03T07:11:14.211528Z 1 [ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
2021-09-03T07:11:15.216445Z 1 [ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
2021-09-03T07:16:43.530266Z 1 [ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
2021-09-03T07:16:44.531549Z 1 [ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
...
2021-09-03T07:16:44.533212Z 1 [ERROR] [MY-012592] [InnoDB] Operating system error number 11 in a file operation.
2021-09-03T07:16:44.533752Z 1 [ERROR] [MY-012596] [InnoDB] Error number 11 means 'Resource temporarily unavailable'
2021-09-03T07:16:44.534809Z 1 [ERROR] [MY-012215] [InnoDB] Cannot open datafile './ibdata1'
2021-09-03T07:16:44.535521Z 1 [ERROR] [MY-012959] [InnoDB] Could not open or create the system tablespace. If you tried to add new data files to the system tablespace, and it failed here, you should now edit innodb_data_file_path in my.cnf back to what it was, and remove the new ibdata files InnoDB created in this failed attempt. InnoDB only wrote those files full of zeros, but did not yet use them in any way. But be careful: do not remove old data files which contain your precious data!
2021-09-03T07:16:44.536055Z 1 [ERROR] [MY-012930] [InnoDB] Plugin initialization aborted with error Cannot open a file.
2021-09-03T07:16:44.963715Z 1 [ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
2021-09-03T07:16:44.964574Z 0 [ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
2021-09-03T07:16:44.965810Z 0 [ERROR] [MY-010119] [Server] Aborting
2021-09-03T07:16:44.969840Z 0 [System] [MY-010910] [Server] /usr/sbin/mysqld: Shutdown complete (mysqld 8.0.24)  MySQL Community Server - GPL.
2021-09-03T07:30:51.678182Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.24) starting as process 2064
2021-09-03T07:30:51.701791Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2021-09-03T07:30:51.850829Z 1 [ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
2021-09-03T07:30:52.851200Z 1 [ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
2021-09-03T07:30:53.851516Z 1 [ERROR] [MY-012574] [InnoDB] Unable to lock ./ibdata1 error: 11
....
```

Seem to a InnoDB problem ,finally find solution from [here](https://stackoverflow.com/a/35978229/11742589) : 
```shell
[root@VM-0-4-centos /]# ps aux | grep mysql
root      5710  0.0  0.0 112808   964 pts/0    R+   15:55   0:00 grep --color=auto mysql
mysql    31156  0.1 17.5 1315760 330608 pts/0  Sl   15:09   0:03 mysqld --skip-grant-tables --user=mysql
[root@VM-0-4-centos /]# kill 31156
[root@VM-0-4-centos /]# systemctl start mysqld.service
[root@VM-0-4-centos /]# systemctl status mysqld.service
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since Fri 2021-09-03 15:57:57 CST; 4s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 6081 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 6113 (mysqld)
   Status: "Server is operational"
    Tasks: 38
   Memory: 398.5M
   CGroup: /system.slice/mysqld.service
           └─6113 /usr/sbin/mysqld

Sep 03 15:57:55 VM-0-4-centos systemd[1]: Starting MySQL Server...
Sep 03 15:57:57 VM-0-4-centos systemd[1]: Started MySQL Server.
```

