const express = require('express')
const employRecordsController = express.Router()


// middleware that is specific to this router
employRecordsController.use((req, res, next) => {
    next();
})


// define the home page route
employRecordsController.get('/all', (req, res) => {
    res.render("employRecordsPage.html" , {locals: {title: 'This is Backend Api Talking !'}} )
})

  

module.exports = employRecordsController;