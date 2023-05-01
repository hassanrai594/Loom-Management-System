const express = require('express');
const expenseController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');


const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
expenseController.use((req, res, next) => {
    next();
})

expenseController.post('/calculateExpense', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query("SELECT salary FROM user", (err1, result1) => {
                            if (err1) {
                                connection.release();
                                res.send({ status: false, message: err1 })
                            } else {
                                const expense = result1.reduce((accumulator, object) => {
                                    return accumulator + object.salary;
                                }, 0);

                                connection.query("SELECT operate_rate, working_time FROM loom", (err2, result2) => {
                                    if (err2) {
                                        connection.release();
                                        res.send({ status: false, message: err2 })
                                    } else {
                                        var data1 = result2[0];
                                        var rate = data1.operate_rate;
                                        const expense1 = result2.reduce((accumulator, object) => {
                                            return accumulator + object.working_time;
                                        }, 0);

                                        var expense2 = expense1 * rate;
                                        connection.query("SELECT price FROM purchase", (err3, result3) => {
                                            if (err3) {
                                                connection.release();
                                                res.send({ status: false, message: err3 })
                                            } else {
                                                const expense3 = result3.reduce((accumulator, object) => {
                                                    return accumulator + object.price;
                                                }, 0);
                                                var F_expense = expense2 + expense + expense3;
                                                connection.query("SELECT expenses FROM accounts", (err4, result4) => {
                                                    if (err4) {
                                                        connection.release();
                                                        res.send({ status: false, message: err4 })
                                                    } else {
                                                        const dataInsert1 = [F_expense];
                                                        connection.query("UPDATE accounts SET expenses=? WHERE accounts_id=1", dataInsert1, (err5, result5) => {
                                                            if (err5) {
                                                                connection.release();
                                                                res.send({ status: false, message: "err5" })
                                                            } else {
                                                                connection.release();
                                                                res.send({ status: true, message: 'Expenses Added Successfully !!', "expense": F_expense })
                                                            }
                                                        })

                                                    }
                                                })
                                            }
                                        })
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

module.exports = expenseController;