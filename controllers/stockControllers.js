const express = require('express');
const StockController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');


const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
StockController.use((req, res, next) => {
    next();
})

StockController.get("/dashboard-stock", async(req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("stock.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})


StockController.get('/getStock', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT * FROM product , raw_material', (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Stock Fetched Successfully!', "stock": result2 })
                            }
                        })
                    }
                })
            } else {
                res.send({ status: false, message: 'You are not Authenticated to perform this Operation' })
            }
        } catch (err) {
            res.send({ status: false, message: 'Incorrect Token' });
        }
    } else {
        res.send({ status: false, message: 'Kindly Provide token' });
    }
})

module.exports = StockController;