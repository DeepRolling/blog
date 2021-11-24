import express from 'express';
const Poet = require('poet')
const app =  express()
const port = 2000
import watch from 'node-watch'
//@ts-ignore
import { marked } from 'marked';
import hljs from "highlight.js";

const pathConfig = {
  postDir:__dirname + '/../data',
  viewDir:__dirname + '/../views',
  publicResourceDir:__dirname + '/../public'
}
const poet = new Poet(app, {
    posts: pathConfig.postDir,
    postsPerPage: 8,
    metaFormat: 'json',
    routes: {
        '/myposts/:post': 'post',
        '/pagination/:page': 'page',
        '/mytags/:tag': 'tag',
        '/mycategories/:category': 'category'
    }
});
poet.templateEngines.marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code: any, lang: any) {
        const hljs = require('highlight.js');
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        const formatResult = hljs.highlight(code, { language })
        console.log('current block use lang  : '+formatResult.value)
        return formatResult.value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
});


const whenPostChange = () => {
    console.log('detected post change , clear poet instance and regenerate it')
    poet.clearCache();
    poet.init();
}
poet.init();

watch(pathConfig.postDir,{recursive:true},whenPostChange)

app.set('view engine', 'pug');
app.set('views', pathConfig.viewDir);
app.use(express.static(pathConfig.publicResourceDir));

app.get('/', function (req, res) { res.render('index');});

app.listen(port);

