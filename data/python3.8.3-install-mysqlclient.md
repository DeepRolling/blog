{{{
    "title"    : "Python3.8.3 install mysqlclient package",
    "tags"     : [ "error-record", "python","mysqlclient" ],
    "category" : "install",
    "date"     : "07-05-2021"
}}}

entered some error when install mysqlclient package use python3.8.3

find some error such :
> ```bash
> error architecture not supported
> error: unknown type name '__int64_t'
> ```

solved by ref : https://stackoverflow.com/a/68052339

```bash
clang -bundle -undefined dynamic_lookup -Wl,-headerpad,0x1000 -arch arm64 -arch x86_64 -L/usr/local/opt/mysql-client/lib -D__x86_64__ -I/usr/local/opt/mysql-client/include build/temp.macosx-10.14.6-x86_64-3.8/MySQLdb/_mysql.o -L/usr/local/Cellar/mysql/8.0.25_1/lib -lmysqlclient -lz -lzstd -lssl -lcrypto -lresolv -o build/lib.macosx-10.14.6-x86_64-3.8/MySQLdb/_mysql.cpython-38-darwin.so
library not found for -lssl
```

this error means can't found ssl library from library path  /usr/local/Cellar/mysql/8.0.25_1/lib

solved by following command : 

```bash
export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"
```

ref(clang's official document):

https://clang.llvm.org/docs/ClangCommandLineReference.html#linker-flags
