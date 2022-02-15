const cheerio = require('cheerio');
const request = require('superagent');
const superagent = require('superagent-charset')(request);
const { Novel } = require('../db/schema');
const { trim } = require('../utils/string');

/**
 * 根据获取到的真实novelId和chapterId爬取小说数据
 * https://www.kanshu.com/files/article/html/2062864/14483599.html
 * @param {*} crawlNovelInfo 
 */
function crawl(crawlNovelInfo) {
    // 章节相关变量
    let chapterIndex = 0;
    let chapterListLength = 0;
    let chapterId = 0;
    let chapterIdList;
    let finalNovel = {};
    // 小说相关变量
    let novelIndex = 0;
    let realNovelId;
    let currentNovel;
    let novelLength = crawlNovelInfo.length;
    let myNovelId = 1;

    if (crawlNovelInfo.length !== 0) {
        crawlNovel();
    }

    // 爬取小说
    function crawlNovel() {
        currentNovel = crawlNovelInfo[novelIndex];
        finalNovel.novelId = myNovelId;
        finalNovel.chapterList = [];
        chapterIndex = 0;
        chapterIdList = currentNovel.chapterIdList;
        chapterListLength = currentNovel.chapterIdList.length;
        chapterId = chapterIdList[chapterIndex];
        realNovelId = currentNovel.novelId;

        return new Promise(function (resolve) {
            crawlChapter(chapterId, realNovelId, function () {
                resolve()
            });
        }).then(() => {
            novelIndex++;
            myNovelId++;

            if (novelIndex < novelLength) {
                crawlNovel();
            } else {
                // 所有图书爬取完毕
                console.log('It is successful to crawl all the novels... ')
            }
        }).catch((err) => {
            console.log(err, 'crawlNovel...')
        })
    }

    // 爬取小说章节
    function crawlChapter(chapterId, realNovelId, finishCB) {
        return superagent.get(`https://www.kanshu.com/files/article/html/${realNovelId}/${chapterId}.html`).charset('gbk').buffer({ mime: false }).then(data => {
            const $ = cheerio.load(data.text);
            // 获取段落列表
            let contentList = [];
            $('.tempcontentBox p').each(function () {
                contentList.push(trim($(this).text()));
            })

            // 获取小说标题 取消前后的空格和无用字符
            finalNovel.novelTitle = trim($('.title1 span').text().replace(/00$/, ''));

            finalNovel.chapterList.push({
                chapterId: chapterIndex + 1,
                // 获取章节标题
                chapterTitle: trim($('.title').text().replace(/^目录设置/, '').replace(/账户余额不足$/, '')),
                contentList
            })

            chapterIndex++;
            chapterId = chapterIdList[chapterIndex];
        }).then(() => {
            if (chapterIndex < chapterListLength) {
                crawlChapter(chapterId, realNovelId, finishCB);
            } else {
                // 判断数据是否符合数据库标准
                if (finalNovel.novelTitle && finalNovel.chapterList.length !== 0) {
                    finalNovel.startChapterId = 1;
                    finalNovel.endChapterId = chapterIndex;
                    // 存到数据库
                    let crawlNovel = new Novel(finalNovel);
                    crawlNovel.save(function (err) {
                        if (err) {
                            console.log('Fail to store the data to database...', err);
                            res.send('Fail to store the data to database...');
                        } else {
                            console.log('Saving data to the database successfully...', realNovelId)
                        }
                    })
                }

                // 该本书爬虫完毕
                return finishCB();
            }
        }).catch(err => {
            console.log(err, 'crawlChapter...')
        })
    }
}

module.exports = {
    crawl
}