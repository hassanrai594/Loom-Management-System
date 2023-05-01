const express = require('express');
const profitController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');


const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
profitController.use((req, res, next) => {
    next();
})

profitController.post('/calculateProfit', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err });
                    } else {
                        connection.query("SELECT price FROM sales", (err1, result1) => {
                            if (err1) {
                                connection.release();
                                res.send({ status: false, message: err1 });
                            } else {
                                const expense = result1.reduce((accumulator, object) => {
                                    return accumulator + object.price;
                                }, 0);
                                connection.query("SELECT expenses,profit,loss FROM accounts", (err2, result2) => {
                                    if (err2) {
                                        connection.release();
                                        res.send({ status: false, message: err2 });
                                    } else {
                                        var data1 = result2[0];
                                        var expense1 = data1.expenses;
                                        var profit1 = data1.profit;
                                        var F_amount = expense - expense1;
                                        var existing_loss = data1.loss;
                                        if (F_amount < 0 || expense1 > profit1) {
                                            var F_loss = F_amount * -1;
                                            connection.query("SELECT loss FROM accounts", (err3, result3) => {
                                                if (err3) {
                                                    connection.release();
                                                    res.send({ status: false, message: err3 })
                                                } else {
                                                    const dataInsert1 = [F_loss]
                                                    connection.query("UPDATE accounts SET loss=? WHERE accounts_id=1", dataInsert1, (err4, result4) => {
                                                        if (err4) {
                                                            connection.release();
                                                            res.send({ status: false, message: err4 })
                                                        } else {
                                                            connection.release();
                                                            res.send({ status: true, message: 'Loss Added Successfully !!', "loss": F_loss })
                                                        }
                                                    })
                                                }
                                            })
                                        } else {
                                            connection.query("SELECT profit FROM accounts", (err5, result5) => {
                                                if (err5) {
                                                    connection.release();
                                                    res.send({ status: false, message: err5 })
                                                } else {
                                                    const dataInsert2 = [F_amount];
                                                    connection.query("UPDATE accounts SET profit=? WHERE accounts_id=1", dataInsert2, (err6, result6) => {
                                                        if (err6) {
                                                            connection.release();
                                                            res.send({ status: false, message: err6 })
                                                        } else {
                                                            connection.release();
                                                            res.send({ status: true, message: 'Profit Added Successfully !!', "profit": F_amount, "loss": existing_loss })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
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


profitController.get('/getProfit', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection(function(err, connection) {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT * FROM accounts', (err2, result2) => {
                            if (err2) {
                                connection.release();
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Profit Fetched Successfully!', "profit": result2 })
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

module.exports = profitController;