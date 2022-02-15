/**
 * 根据novelId爬取的小说信息
 * unescape
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
// id去重
const novelIdList = Array.from(new Set(JSON.parse(fs.readFileSync(path.join(__dirname, '../source/novelIdList.js'), 'utf-8'))));
const length = novelIdList.length;
// 最终的列表
const result = [];
let index = 0;
let novelId = novelIdList[index];

function crawlNovelInfo(id) {
    return axios.get(`https://www.kanshu.com/new/iframe/rewrite/kswMuluJs?book_id=${id}&v2.1&_=1615470473481`).then(data => {
        // 解析数据
        let novelData = JSON.parse(data.data.replace(/.*\=/, '').replace(/;$/, ''));
        let chapterIdList = [];

        novelData.forEach((item) => {
            if (Number(item.isvip) === 0) {
                chapterIdList.push(item.chapterid);
            }
        })

        // 如果章节列表为空，不存储
        if (chapterIdList.length !== 0) {
            result.push({
                chapterIdList,
                novelId: id,
                origin: '看书网'
            })
        }
    }).then(() => {
        index++;

        if (index < length) {
            novelId = novelIdList[index];
            crawlNovelInfo(novelId);
        } else {
            // 爬完了，将数据写入到文件
            fs.writeFileSync(path.join(__dirname, '../source/novelInfoList.js'), JSON.stringify(result), function (err) {
                if (!err) {
                    console.log('writing data into file successfully...')
                } else {
                    console.log('Fail to write data into file...')
                }
            })
        }
    }).catch(err => {
        console.log(err, crawlNovelInfo)
    })
}

crawlNovelInfo(novelId);