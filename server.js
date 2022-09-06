if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')

const indexRoute = require('./routes/index')
 
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
// set site views in the views folder under currrent directory.
app.set('layout', 'layouts/layout')
// set layouts (header & footer across all pages) inside a layout file
app.use(expressLayout)
app.use(express.static('public'))
// that means all public files (html, css, js) will be there.


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.on('open', () => console.log('connected to mongoose'))


// use the index route form the root of our app
app.use('/', indexRoute)

app.listen(process.env.PORT || 3000)
// listen on the defined port, and if it not been defined (as in the dev env for example) set it to port 3000.
 