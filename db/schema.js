/**
 * 创建数据表
 */
const mongoose = require('mongoose');

// 小说表
const novelSchema = new mongoose.Schema({
    novelId: {
        type: Number,
        required: true
    },
    novelTitle: {
        type: String,
        required: true
    },
    chapterList: {
        type: Array,
        required: true
    },
    startChapterId: {
        type: Number,
        required: true
    },
    endChapterId: {
        type: Number,
        required: true
    }
})

const Novel = mongoose.model('novel', novelSchema);

module.exports = {
    Novel
}