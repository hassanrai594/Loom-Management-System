const express = require('express');
const QueryController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');


const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
QueryController.use((req, res, next) => {
    next();
})


QueryController.get("/dashboard-query", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("query.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {
            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})


QueryController.post('/addQuery', async(req, res) => {
    const data = req.body;
    // req --> It is the request Object In which we will get data from user that will hit this api
    // res --> It is the responce Object that this api will send to the user 
    if (data.name && data.email && data.subject && data.message) {
        const status = 0;
        const dataInsert = [data.name, data.email, data.subject, data.message, status]
        pool.getConnection(function(err, connection) {
            if (err) {
                res.send({ status: false, message: err })
            } else {
                connection.query("INSERT INTO query (name, email, subject, message,status) VALUES (?,?,?,?,?)", dataInsert, function(err2, result2) {
                    if (err2) {
                        res.send({ status: false, message: err2 })
                    } else {
                        connection.release();
                        res.send({ status: true, message: 'Query Sent Successfully' })
                    }
                })
            }
        })
    } else {
        res.send({ status: false, message: 'Plz Provide Name and email' })
    }
})


QueryController.get('/getQueries', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection(function(err, connection) {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT * FROM query WHERE status=0', (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Queries Fetched Successfully!', "query": result2 })
                            }
                        })
                    }
                })
            } else {
                res.send({ status: false, message: 'You are not Authenticated to perform this Operation' })
            }
        } catch (err) {
            res.send({ status: false, message: 'Incorrect Token' })
        }

    } else {
        res.send({ status: false, message: 'Kindly Provide token' })
    }
})


QueryController.post('/getQuery', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                const dataInsert = [data.query_id]
                pool.getConnection(function(err, connection) {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT * FROM query WHERE query_id=?', dataInsert, (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Query Fetched Successfully!', "query1": result2 })
                            }
                        })
                    }
                })
            } else {
                res.send({ status: false, message: 'You are not Authenticated to perform this Operation' })
            }
        } catch (err) {
            res.send({ status: false, message: 'Incorrect Token' })
        }

    } else {
        res.send({ status: false, message: 'Kindly Provide token' })
    }
})

module.exports = QueryController;