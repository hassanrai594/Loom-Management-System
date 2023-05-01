const express = require('express');
const SaleController = express.Router();
var jwt = require('jsonwebtoken');
const { connection, setDriver } = require('mongoose');
const pool = require('../dataBase/dbConnector');
const moment = require('moment');

const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
SaleController.use((req, res, next) => {
    next();
})

SaleController.get("/dashboard-sale", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("sale.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})

SaleController.get("/dashboard-sale_add", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("sale_add.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})


SaleController.post('/deleteSale', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin') {
                if (data.sales_id) {
                    const dataInsert = [data.sales_id];
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            connection.release();
                            res.send({ status: false, message: err });
                        } else {
                            connection.query('DELETE FROM sales WHERE sales_id =?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    connection.release();
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Sale Deleted Successfully!' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Sale not Deleted Successfully!' })
                }
            } else {
                res.send({ status: false, message: 'You are not Authenticated to perform this Operation' })
            }
        } catch (err) {
            res.send({ status: false, message: 'Incorrect Token' });
        }
    } else {
        res.send({ status: false, message: 'Kindly Provide Token' });
    }
})


SaleController.post('/addSale', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            // let currentDate = new Date().toJSON().slice(0, 10);
            var date = moment();
            var currentDate = date.format('D/MM/YYYY');
            console.log(currentDate);
            var myDate = currentDate;
            myDate = myDate.split("/");
            let timeStamp = new Date(myDate[2], myDate[1] - 1, myDate[0]).getTime() / 1000;
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin') {
                if (data.price && data.weight && data.company_name) {
                    const dataInsert = [data.price, data.weight, currentDate, data.company_name, timeStamp];
                    pool.getConnection((err, connection) => {
                        if (err) {
                            connection.release();
                            res.send({ status: false, message: err })
                        } else {
                            connection.query('INSERT INTO sales (price, weight, date, company_name, time_stamp) VALUES (?,?,?,?,?)', dataInsert, (err1, result1) => {
                                if (err1) {
                                    connection.release();
                                    res.send({ status: false, message: err1 })
                                } else {
                                    connection.query('SELECT p_price, p_weight,p_rate FROM product', (err2, result2) => {
                                        if (err2) {
                                            connection.release();
                                            res.send({ status: false, message: err2 })
                                        } else {
                                            const data1 = result2[0];
                                            var b = dataInsert.map(Number);

                                            const data2 = b[0]
                                            const data3 = b[1]
                                            var rate = data1.p_rate;
                                            var F_weight = data1.p_weight - data3;
                                            var F_price = F_weight * rate;
                                            const dataInsert1 = [F_price, F_weight];
                                            connection.query('UPDATE product SET p_price=?,p_weight=?', dataInsert1, (err3, result3) => {
                                                if (err3) {
                                                    connection.release();
                                                    res.send({ status: false, message: err3 })
                                                } else {
                                                    connection.release();
                                                    res.send({ status: true, message: 'Sale Added Successfully !!' })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Kindly Provide Company Name, Sale Price and Weight!' })
                }
            } else {
                res.send({ status: false, message: 'You are not Authenticated to perform this Operation' })
            }
        } catch (err) {
            res.send({ status: false, message: 'Incorrect Token' })
        }
    } else {
        res.send({ status: false, message: 'Kindly Provide Token' });
    }
})


SaleController.get('/getSale', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT * FROM sales', (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Sales Fetched Successfully!', "sales": result2 })
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


SaleController.post('/getSaleRange', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin') {
                const date1 = data.date1;
                const date2 = data.date2;
                var myDate1 = date1;
                myDate1 = myDate1.split("/");
                let timeStamp1 = new Date(myDate1[2], myDate1[1] - 1, myDate1[0]).getTime() / 1000;
                var myDate2 = date2;
                myDate2 = myDate2.split("/");
                let timeStamp2 = new Date(myDate2[2], myDate2[1] - 1, myDate2[0]).getTime() / 1000;
                const dataInsert = [timeStamp1, timeStamp2];
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query("SELECT * FROM sales WHERE time_stamp between ? AND ?", dataInsert, (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Sales are filtered by dates', "TimeStamp": result2, })
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
        res.send({ status: false, message: 'Kindly Provide Token' });
    }
})

module.exports = SaleController;