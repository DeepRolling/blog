{{{
    "title"    : "Frontend code quality ensure",
    "tags"     : ["frontend","ts"],
    "category" : "frontend develop",
    "date"     : "05-24-2021"
}}}

作为一个开发者，我经常考虑一个事情，怎么能在前端开发中保证代码的质量，今天我分享一下我个人的拙见 : 

## javascript生态以及替代

javascript是一种轻量级，函数优先的即时编译型语言，开始源于浏览器领域实现与用户的交互，并随着发展在web开发领域一家独大（根本没有别的选择）,并且因为node.js等服务端framework的出现更是将js带入了服务端领域并引发了经两年的"大前端"潮流。

但是随着前端的不断发展，在移动端或桌面端开发程序中使用js的场景不断增多，人们开始发现js的一些致命缺点。

- 作用域混乱，各种变量来回声明导致一些奇怪的bug。
- 弱类型编程，不能包含团队协作需要的信息。
- 动态类型更改，在运行时可以动态更改变量的类型，容易产生bug。

比如举几个例子：

- 在后端返回json的时候，前端拿到请求回来的对象，在js中只能使用dot操作符去访问变量，但是怎么知道后台到底返回了怎么样的json格式，假设后台返回一个json对象里面有字段叫join，那么response.join在不同的开发人员看来可能把response看成对象，也有人可能认为他是一个数组。而且在现在编辑器中想查看response对象的结构只能在web上查找官方api去查看。这种信息缺失的现象其实很大程度上拖慢了开发效率。
- 在多人协作的场景下，A开发者用js写了一个函数给B开发者去调用。但是B开发者并不知道每个参数应该传递什么样的类型，这个时候A同事又联系不到，然后B开发者怎么传怎么报错。其实这样的情况是在说函数上并没有表现出足够的信息。
- 在你想访问height属性的时候写成了heigth，而js只会在运行的时候抛出运行时错误，在正式环境中运行的话很难去排查错误。


那么随着这些情况的出现，ECMA在近两年纷纷不断提升标准，提案ES6,ES7去解决js的痛点问题，针对于js的弱类型，facebook也推出了Flow可以无侵入的方式在js上加类型检查。微软也开源了TypeScript这个超集来给js加上类型检查以及高级oop的支持。

要知道很**多高级语言存在的意义在于更好的表达能力**，而不完全是性能为主的。所以为了解决js的痛点有CoffeeScript在语言层面上提供语法糖去使js更加有表现力，Flow和TypeScript则倾向于**在编译期优化的这些语言，他们从工程角度增强了js。**

所以经过调研之后我采用了**TypeScript**作为js的替代。主要考虑到如下几个方面：

1. ts是js的一种flavor，可以完美兼容js。
2. ts提供了Type check，在编译时避免了错误拼写以及上线后可能潜在的bug。
3. ts可以使用类型输出足够的信息给团队开发者。
4. ts提前实现了ECMA标准，可使编写代码更加有效率并且不用担心兼容性问题。

**所以我们应统一采用ts作为javascript的替代品。**


## 代码的格式与质量

在企业级开发中,linter是不可或缺的一部分。lint可以帮助我们对编写的代码进行静态分析，提高代码的质量。

>在计算机科学中，lint是一种工具的名称，它用来标记代码中，某些可疑的、不具结构性（可能造成bug）的语句。它是一种静态程序分析工具，最早适用于C语言，在UNIX平台上开发出来。后来它成为通用术语，可用于描述在任何一种编程语言中，用来标记代码中有疑义语句的工具。 -- by wikipedia

在js的lint工具中，最早出现的是**JsLint**（一个极具个人主义的lint工具），接着是**JsHint**（可配置的lint工具，现在已经合并到EsLint），最后就是**EsLint**。

>ESLint 号称下一代的 JS Linter 工具，它的灵感来源于 PHP Linter，将源代码解析成 AST，然后检测 AST 来判断代码是否符合规则。ESLint 使用 esprima 将源代码解析吃成 AST，然后你就可以使用任意规则来检测 AST 是否符合预期，这也是 ESLint 高可扩展性的原因。

最重要的是ESLINT完全是可插拔的，每一条规则都可以进行定制，还可以继承第三方规则，这很适用于团队进行规则的配置。

>其实typescript作为一个type checker,在某些程度上也起到了lint的作用

所以我们应该根据我们选用的技术框架制定适合该项目的ESLINT配置文件。
现在主流的IDE都支持eslint，可以在项目跟目录通过[`.eslintrc.*`](https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-file-formats) file去配置lint策略。

**所以我们应该在通过ESLINT之后再进行提交**

## 使用husky强制在提交前进行ESLINT

有的时候我们会忘记在提交前进行lint检查，那么提交上去的代码就可能存在潜在的问题。
好在git为我们提供了[git hooks](https://git-scm.com/docs/githooks)可以在提交前执行任意命令，如果该命令执行成功才会进行git commit。
我们可以通过配置pre-commit实现lint检查。

    yarn add husky --dev

然后我们可以在package.json里面配置husky用来打开git hooks以及关闭git hooks的脚本
```
"scripts": { 
  "install-hasky": "husky install",  
  "uninstall-hasky": "yarn remove husky && git config --unset core.hooksPath"  
},
```
在安装husky后执行下列命令打开git hooks功能:
```
yarn install-husky
```
在打开git hooks之后我们可以再配置两个脚本用于执行ESLINT检测执行:
```
"scripts": { 
	"lint": "eslint . --format html > .husky/eslint.html & open .husky/eslint.html",  
	"open-lint-problems": "open .husky/eslint.html",
},
```
然后我们使用husky命令添加一个hooks shell

    yarn husky add .husky/pre-commit

执行后在.husky目录下会有一个叫pre-commit的shell脚本，我们编辑该shell脚本:
```
#!/bin/sh  
. "$(dirname "$0")/_/husky.sh"  
  
  
yarn lint  
if [[ "$?" != 0 ]]; then  
  echo "find not-pass eslint , will open problems for you"  
  yarn open-lint-problems  
    exit 1 # reject  
fi
```

这个时候我们再提交，在提交之前husky回去执行pre-commit，如果lint失败，就会打开输出的html文件**并以1作为程序结束码**。这个时候husky读取到程序结束码不为0，就不会去执行git commit了。
