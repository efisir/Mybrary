
const express = require('express')
const router = express.Router()
const Author = require('../models/author')

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


module.exports = router


 