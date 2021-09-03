"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Poet = require('poet');
const app = express_1.default();
const port = 2000;
const node_watch_1 = __importDefault(require("node-watch"));
const pathConfig = {
    postDir: __dirname + '/../data',
    viewDir: __dirname + '/../views',
    publicResourceDir: __dirname + '/../public'
};
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
    console.log('detected post change , clear poet instance and regenerate it');
    poet.clearCache();
    poet.init();
};
poet.init();
node_watch_1.default(pathConfig.postDir, { recursive: true }, whenPostChange);
app.set('view engine', 'pug');
app.set('views', pathConfig.viewDir);
app.use(express_1.default.static(pathConfig.publicResourceDir));
app.get('/', function (req, res) { res.render('index'); });
app.listen(port);
//# sourceMappingURL=app.js.map