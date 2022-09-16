const express = require('express')
const router = express.Router()
const BookModel = require('../models/book')
const Book = BookModel.book


// creating a Get action located at '/', which means the root of our application.
// the second parameter is a function with 2 params req we get and res we sending back 
router.get('/', async(req, res)=>{
    let books
    try{
        books = await Book.find().sort({creationDate: 'desc'}).limit(10).exec()
    }catch (e){
        console.log(e)
        books = []

    }
    res.render('index', {books: books}) // renders the index view (from index.ejs embeded inside the layout in the layputqlayouts.ejs file)
})
// export our router for then main script to require it
module.exports = router