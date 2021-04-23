const express = require('express')  // imports express module
const path = require('path')


//const pages = require('./routes/anyRoutes')  // imports pages file

const app = express()
const port = process.env.PORT | 5000
const host = 'localhost'

//app.use('/', pages)  // uses the get route og "/" 

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, host, () => {
    console.log(`server running on ${port} ...`)
})