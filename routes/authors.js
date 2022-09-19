
const express = require('express')
const author = require('../models/author')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book').book

// All Authors Route
router.get('/', async (req, res)=>{
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '')
    searchOptions.name = new RegExp(req.query.name, 'i')
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index', 
        { authors: authors,
           searchOptions: req.query })    
    }
    catch{
        //if someting goes wrong in the db fetch redirect to the home page.
        res.redirect('/')
    }


    
})

//New Auther Route )(just for displaying the form not the actual creation operation)
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//Create Author Route. we use post cause we are just sending info to the server rather than rendering page for the client.
router.post('/', async (req,res) => {

    const author = new Author({
        name: req.body.name
    })

    try{
        const newAuthor = await author.save()
        res.redirect('authors')
    }
    catch{
        res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating new auther'
        }) 
    }
})

//single author
router.get('/:id', async (req, res)=>{
    
    try{
        const author= await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show',{
            author: author,
            booksByAuthor: books 
        })
    }catch{
        res.redirect('/')
    }
    let author 

})

router.get('/:id/edit', async (req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    }catch(e){
        res.redirect('/authors/')
    }

    //res.send('edit auther id = '+req.params.id + '<br> <a href="/">Home</a>')
} )

router.put('/:id', async (req, res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        if (author == null){
            throw exception('Failed featching author id '+req.params.id)
        }
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)//maybe chage to ${author.id}
    }
    catch{
        if (author == null){
            res.redirect('/')
        }
        else{
        res.render('/authors/edit', {
        author: author,
        errorMessage: 'Error updating auther'
            })
        }
    }
}) 
 


router.delete('/:id', async(req,res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        if (author == null){
            throw exception('Failed featching author id '+req.params.id)
        }
        await author.remove()
        res.redirect('/authors')
    }
    catch (e){
        console.log('err message starting')
        console.error(e)
        console.log('err message ending')
        if (author == null){
            res.redirect('/')
        }
        else{
         res.redirect(`/authors/${author.id}`)
        }
    }

})

// router.delete('/delete:id', (req,res)=>{
//     res.send('delete auther id = '+req.params.id + '<br> <a href="/">Home</a>')
// })
module.exports = router


 