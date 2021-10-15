{{{
"title"    : "The process of setup my personal website",
"tags"     : ["frontend","linux"],
"category" : "frontend develop",
"date"     : "10-15-2021"
}}}


Recently, I focusing on setup my website. And I had this idea about five years ago I think. Because of my procrastination, I pause this idea always.

### Problem

To be more precise, I pause this undertaking because I want to create an ideal website that should have artistic looking and fill with countless advanced technology such as a single-spot login system, a live-reload server, high security, and so on.

So for achieving this goal, I try to learn dozens of knowledge, such as UI/UX skills, I want to use Figma to draw some prerender pictures for my website by myself. I also try to learn to write a login system with the Express framework base on the Node environment. I had been spending a lot of time studying these things after work and imagined that I would be a  big guy who master all of these technologies and can finish the website by myself.

Reality teaches me a lesson, even I can understand these techs deftly. But that is a huge amount of knowledge I need to learn.

### Trick

That thought haunted me, but in the end, I realized a principle: Focus one thing at a time and I break the vicious circle by this principle.  
I decided to set up a simple website at first, then I can perfect it gradually. So that if I use this manner, I don't need to suffer a feeling of defeat.

The important thing is this resolution about workflow can result in positive feedback continually, so you will be happy to see the results of your work and share your work with your friend, then you can hear some advice and form your next plan.

### Technique

Now, let's look techs detail closely :

I use the Poet framework to launch my project.

And for some reason(Node.js Offical implementation), the feature of watch blog file change is not working. So I patch it with third-part library node-watch and upload an npm package to Github with gitpkg.

I learned that the Pug template engine and Express framework are used under the hood of Poet. So I study some material about how Express works with the template engine.

Then,  I ever consider using Docker to deploy my application, but that time, I just got an experience from my co-worker: If you are familiar with Linux enough or your application enough simple, you should not use Docker, It can bring some additional complexity to your workflow. I think He just took the words out of my mouth, I agree with him totally. By the way, He already quit this job when I write these words.

Now, the workflow is clearly, I write code in my local machine when I finished I submit the code to the Git server, pull code from the Git server to my cloud machine, then run the code in the Node environment, so my application will set up an HTTP service and listen the files change in a specified folder which contains all my posts.

The last step is to install an FTP server in my cloud machine. Because for the future, if I release a new post about my life or techs, I can use FTP protocol to upload this file to the folder in my remote machine, and my running application will catch it and update my blog page!

I install the VSFTPD on my server by following the instructions in the post :  
https://phoenixnap.com/kb/how-to-setup-ftp-server-install-vsftpd-centos-7

For the FTP client, there are various clients in different platforms, which have dozens of handy functionality, beautiful visual interfaces, but for my selection, I prefer the old-fashioned GNU FTP client to a modern visualized FTP client. So I install the inettools in my MacOs and read some commands used for FTP commands.

### End

That's all, the above is all aspect of the technique profile of my website.  
After writing the last line, I will upload this Markdown file to my server.  
