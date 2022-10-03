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
      
      res.redirect('/')  
    }
    
})

//New Book Route )(just for displaying the form not the actual creation operation)
router.get('/new',  (req, res) => {
    renderFormPage(res, new Book(), 'new', false)
})


router.get('/:id', async (req,res) => {
    try{

        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render(`books/show`,
        {book: book,
        author: book.author})
    }catch (e){
        res.redirect('/')
    }
})



//Create Book Route. we use post cause we are just sending info to the server rather than rendering page for the client.
router.post('/', async (req,res) => {
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
            res.redirect('books')
        }catch{
            renderFormPage(res, book, 'new', true)
        }
})

router.get('/:id/edit', async (req, res)=> {
        const book = await Book.findById(req.params.id)
        renderFormPage(res, book, 'edit', false)
})


router.put('/:id', async (req, res)=> {
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        author: req.body.author.trim()
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover != ''){
            saveCover(book, req.body.cover)
        } 
        await book.save()            
        res.redirect(`/books/${book.id}`)
    }catch{
        if (book != null){
             renderFormPage(res, book, 'edit')
        }else{
            res.redirect('/')        }
        res.redirect(`books/${req.params.id}`)

    }
})

router.delete('/:id', async (req, res)=>{
    let book
    try{
        book = await Book.findById(req.params.id).populate('author').exec()
        book.remove()
        res.redirect('/')
    }catch(e){
        if (book == null){
            res.redirect('/')
        }else{
            res.render('books/show',{
                book: book,
                errorMessage: 'could not remove book'+e
            }
            )
        }
    }

})

async function renderFormPage(res, book, form, hasErr = false){
    try{
        const allAuthors = await author.find({})
        const params = {
            author: allAuthors,
            book: book
        }
        if (hasErr) {
            if (form == 'new'){
                params.errorMessage = 'erorr creating book'
            }else{
                params.errorMessage = 'erorr updating book'
            }
            
        }
        res.render(`books/${form}`, params)

    }catch(e){
        res.redirect('/books')
        
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


 