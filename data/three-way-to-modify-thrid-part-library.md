{{{
    "title"    : "Third-part libraries modification",
    "tags"     : ["frontend"],
    "category" : "frontend develop",
    "date"     : "09-27-2022"
}}}

The real-life fact is that development in modern manner depend on third-part libraries heavenly.
Wec can't write everything by ourself in project, we need libraries to speed us and reduce bugs in production.

Most times, we can play with them happily, but sometimes we get bothered by these libraries because some code 
inside them, such as some bug, some deprecated function invocation, some design limitation. These problems often
stop us from release our production or continually write codes.

Let's recall two situations we encounter them:
1. This library is un-maintained, The least official package is defective, we can't use this package directly and we
can't find a fork of this library which work properly. But we don't want to develop this functionality by ourselves,
because this is heaven work and bug-prone. This situation will break the whole day...
2. Some libraries are bad-documented, we can't find the distinct Changelog without take time to through commit history,
but waste time for this fucking information is stupid. The sad new is we can't find more information without do this because 
there not have any valuable information. Although we can just read the code to find information, but the code implementation is 
complex in general...

You must have experienced some bad times about third part libraries before you become a big guy ~

So, I want to share three method with you about how to modify and re-publish them, and you should know that both 
of them have two sides, so which is best really depend on your purpose.

## Method 1 : Modify the source code and re-publish on npm

This method is not difficult, you just need fork the repository and pull it down in your computer, modify them.
After that you can use **_npm publish_** command to re-publish them in your account if you already have a npm 
account login.( or you may want to publish them on local [npm registry](http://www.deepcode.site/myposts/how-to-setup-private-npm-server) )
> You may need **change information in some descriptions file**( package.json file in js world). For example, change 
> the name field from xxx-xxx-xxx to xxx-xxx-xxx-fix, indicate this package is different with the official package.
> 
> A good convention is **written chang-log for your change**, so you can recall them easily when you need them.

Advantages of this method :
* You can import them as convenience as other packages by your build tools ( maven/gradle/npm... )
* Other personal may use your published package if you distribute them on internet. And you can make things better
if some forks create an issue in your fork repository. 

Disadvantages of this method:
* Some public registry may have some limitation about publication. As an example, you can't re-publish package use the 
name that you just delete it in your account in same day.
* If you don't have good document, your repository will be a trash in internet. I think this behavior is bad for development
ecosystem.


## Method 2 : Publish modified package in your git repository as a git tag

If you don't want to publish your package as a public resource which can be used by dozens of developer, 
Here is a good library named [gitpkg](https://github.com/ramasilveyra/gitpkg) help you publish your package
in your own private repository.

Most of build tool can let you use dependencies from git repository, such as you can import dependence from git
repository in npm/yarn as following:
```json
{
    "name": "example",
    "version": "0.0.1",
    "dependencies": {
       "react-native-code-push": "git+ssh://git@gitee.com:deepcodestudio/gitpkg-repository.git#react-native-code-push-v7.0.5-gitpkg-fix",
    }
}
```

So, here are some advantages of this method :
* You can control the registry access permission by create a private repository, so this excellent for people who
don't want to publish their package to public web. 
* You can publish any gitpkg package to same repository, so you can decouple release version from internal 
development version. **A repository is a registry.**

>But notice that, gitpkg in Windows have a bug can stop you from publish package.You can resolve it by delete 
temp dictionary in your computer then re-execute command.

I am planning make a fix for this...

## Method 3 : use [patch-package](https://github.com/ds300/patch-package#readme) to make patch on local

Here is another great library for modify libraries.

This library use **_git diff_** under the hood to record your local change and make a patch file for your project.
These patch record permanently, so you don't need to suffer lost modification after each time running 
**_yarn install , yarn add_** xxx...

This method is lightweight and can limit your modification in your project, make them irrelevant with other project.

So you can call this method a project-level library modification resolution!!!

I like this method very mach, [give it a try](https://github.com/ds300/patch-package#readme) !

## Summary

After list some modification method above, I fell glad to share this information with you.

You can find different package-modification library in different language ecosystem. And the implementation theory
can be little different.

Wast you find the best one which make you fell comfortable!

Code Happy~
