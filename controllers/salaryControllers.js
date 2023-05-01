const e = require('express');
const express = require('express');
const SalaryController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');


const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
SalaryController.use((req, res, next) => {
    next();
})

SalaryController.post('/calculateSalary', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'employee') {
                const date1 = data.date1;
                const date2 = data.date2;
                var myDate1 = date1;
                myDate1 = myDate1.split("/");
                let timeStamp1 = new Date(myDate1[2], myDate1[1] - 1, myDate1[0]).getTime() / 1000;
                var myDate2 = date2;
                myDate2 = myDate2.split("/");
                let timeStamp2 = new Date(myDate2[2], myDate2[1] - 1, myDate2[0]).getTime() / 1000;
                const dataInsert = [data.username, timeStamp1, timeStamp2];
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query("SELECT working_hours FROM shift WHERE username=? AND time_stamp between ? AND ?", dataInsert, (err1, result1) => {
                            if (err1) {
                                connection.release();
                                res.send({ status: false, message: err1 });
                            } else {
                                var data7 = result1.map(({
                                    working_hours
                                }) => working_hours)
                                var numberArray = data7.map(Number);
                                numberArray = numberArray.reduce((partialSum, a) => partialSum + a, 0);
                                var hourlyWage = 250;
                                var salary1 = hourlyWage * numberArray;
                                // 10% tax
                                var tax = (salary1 * 10) / 100;
                                console.log(tax);
                                salary1 = salary1 - tax;
                                if (salary1 >= 20000) {
                                    var bonus = (salary1 * 20) / 100;
                                    salary1 = salary1 + bonus;
                                }
                                console.log(salary1);
                                const dataInsert1 = [data.username];
                                connection.query("SELECT salary FROM user WHERE username=?", dataInsert1, (err2, result2) => {
                                    if (err2) {
                                        connection.release();
                                        res.send({ status: false, message: err2 });
                                    } else {
                                        const dataInsert2 = [salary1, data.username];
                                        connection.query("UPDATE user SET salary=? WHERE username=?", dataInsert2, (err3, result3) => {
                                            if (err3) {
                                                connection.release();
                                                res.send({ status: false, message: err3 })
                                            } else {
                                                connection.release();
                                                res.send({ status: true, message: 'Salary calculated successfully!', "salary": salary1 })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                res.send({ status: false, message: 'You are not Authenticated to perform this Operation' });
            }
        } catch (err) {
            res.send({ status: false, message: 'Incorrect Token' });
        }
    } else {
        res.send({ status: false, message: 'Kindly Provide Token' });
    }
})



SalaryController.get('/getSalary', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                const dataInsert = [data.username];
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT salary FROM user WHERE username=?', (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Salary Fetched Successfully!', "salary": result2 })
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

module.exports = SalaryController;