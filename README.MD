# 爬取小说数据

## 使用npm包
+ express web服务器
+ cheerio 
+ superagent
+ superagent-charset用来转码，与superagent结合使用
+ mongoose, 连接操作mongodb数据库

## 数据库
+ mongodb
### 数据库结构
```
{
  novelId: 1,
  novelTitle: 'novel',
  chapterList: [
    {
      chapterId: 1,
      chapterTitle: 'chapter',
      contentList: ['this is content']
    }
  ],
  startChapterId: 1,
  endChapterId: 100
}
```

## 使用
+ 先执行source文件夹下的index文件获取小说信息，然后在回到项目目录，执行app.js文件

## 学到的知识
+ node文件的执行是同步的
+ cheerio的each方法的第二个参数代表元素本身

## TODO: 
+ novelId去重
+ 数据判断
