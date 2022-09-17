const express = require('express')
const author = require('../models/author')
const BookModel = require('../models/book')
const Book = BookModel.book
const coverImgBasePath = BookModel.coverImgBasePath
const router = express.Router()


const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


// All Books Route
router.get('/', async (req, res)=>{
    try{
        let query = Book.find()
        if (req.query.title != null && req.query.title.trim() != ''){
            query = query.regex('title', new RegExp(req.query.title, 'i'))
        }
        if (req.query.publishedBefore != null && req.query.publishedBefore.trim() != ''){
            query = query.lte('publishDate', req.query.publishedBefore)
        }
        if (req.query.publishedAfter != null && req.query.publishedAfter.trim() != ''){
            query = query.gte('publishDate', req.query.publishedAfter)
        }
        const books = await query.exec() 
        res.render('books/index', 
            {books: books, 
            searchOptions: req.query
        })
    } catch (e){
      console.log (e)  
      
      res.redirect('/')  
    }
    //res.send('All Books')
    
})




//New Book Route )(just for displaying the form not the actual creation operation)
router.get('/new', async (req, res) => {
    
    randerNewPage(res, new Book())
})

//Create Book Route. we use post cause we are just sending info to the server rather than rendering page for the client.
router.post('/', async (req,res) => {
    const fileName = req.file != null ? req.file.filename : null
    console.log('loging new book param:')
    // console.log(req.body.title.trim())
    // console.log(req.body.author.trim())
    // console.log(req.body.publishDate)
    // console.log(req.body.pageCount)
    // console.log(fileName.trim())
    // console.log(req.body.description.trim())
    const book = new Book(
        {
            title: req.body.title.trim(),
            author: req.body.author.trim(),
            publishDate: new Date(req.body.publishDate),
            pageCount: req.body.pageCount,
            description:  req.body.description.trim()
        })
        saveCover(book, req.body.cover)
        try{
            const newBook = await book.save()
            //res.redirect(`books/${newBook.id}`)
            res.redirect('books')
        }
        catch (e){
            console.log('got to the catch part in create book method')
            console.error(e)
            randerNewPage(res, book, true)      
        }
})




async function randerNewPage(res, book, hasErr = false){
    try{
        const allAuthors = await author.find({})
        const params = {
            author: allAuthors,
            book: book
        }
        if (hasErr) {
            params.errorMessage = 'erorr creating book'
        }

        res.render('books/new', params)

    }catch(e){
        console.error(e)
        res.redirect('books')
    }
}


function saveCover(book, coverEncoded){
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router


 