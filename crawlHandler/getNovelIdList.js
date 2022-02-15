/**
 * 爬取小说页面，获取书籍的id
 * https://all.kanshu.com/
 */

const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const novelIdList = [];

superagent.get('https://all.kanshu.com/').then(data => {
  const $ = cheerio.load(data.text);

  $('.booksBox .bookItem').each((i, e) => {
    novelIdList.push($(e).attr('href').match(/\/(\d+)\./)[1]);
  })
}).then(() => {
  fs.writeFileSync(path.join(__dirname, '../source/novelIdList.js'), JSON.stringify(novelIdList), function (err) {
    if (!err) {
      console.log('It is successful to save novelIdList into file')
    } else {
      console.log('Fail to save novelIdList into file')
    }
  })
}).catch(err => {
  console.log(err, 'getNovelIdList')
})



