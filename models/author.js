const mongoose = require('mongoose')
const Book = require('./book').book
const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    } 
})

authorSchema.pre('remove', function(next) {
        Book.find({author: this.id}, (err, books)=>{
            if (err){ // fetching from the DB failed
                next(err)
            } else if (books.length > 0){
                next(new Error('this author has books, and so cannot be deleted!'))
            } else {
                next()
            }

        })
    })


module.exports = mongoose.model('Author', authorSchema)