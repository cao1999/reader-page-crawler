/**
 * 爬取小说数据
 * TODO: 爬取小说的作者、封面图片等信息
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const db = mongoose.connection;
const { crawl } = require('./crawlHandler/crawl');

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/reader', { useNewUrlParser: true, useUnifiedTopology: true });
// 连接数据库成功
db.on('open', function () {
    console.log('Connecting database successfully')
})
// 连接数据库失败
db.on('error', function () {
    console.log('Fail to connect database')
})

// 从文件中获取到要爬取的小说信息
let crawlNovelInfo = JSON.parse(fs.readFileSync(path.join(__dirname, './source/novelInfoList.js'), 'utf-8'));

// 开始爬取小说数据
crawl(crawlNovelInfo);