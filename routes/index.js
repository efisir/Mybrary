const express = require('express')
const router = express.Router()

// creating a Get action located at '/', which means the root of our application.
// the second parameter is a function with 2 params req we get and res we sending back 
router.get('/', (req, res)=>{
    //res.send('hello world!')
    res.render('index') // renders the index view (from index.ejs embeded inside the layout in the layputqlayouts.ejs file)
})
// export our router for then main script to require it
module.exports = router