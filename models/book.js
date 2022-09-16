const mongoose = require('mongoose')

const coverImgBasePath = 'uploads/bookCovers'

const path = require('path')

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },  
    publishDate: {
        type: Date,
        required: true
    },
    pageCount:{
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        required: true, 
        default: Date.now
    },
    coverImgName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }

})

bookSchema.virtual('coverImagePath').get(function(){
    if (this.coverImgName != null){
        return path.join('/', coverImgBasePath, this.coverImgName)
    }
})

module.exports.book = mongoose.model('Book', bookSchema)
module.exports.coverImgBasePath = coverImgBasePath