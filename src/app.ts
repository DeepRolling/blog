import express from 'express';
const Poet = require('poet')
const app =  express()
const port = 2000
import watch from 'node-watch'


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

