const express = require('express');
const shiftController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');
const moment = require('moment');

const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
shiftController.use((req, res, next) => {
    next();
})

shiftController.get("/dashboard1-shift", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'employee') { res.render("shift.html") }
            if (tokenData.role == "admin" || tokenData.role == "hr") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})


shiftController.post('/checkOut', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'employee') {
                if (data.username && tokenData.username) {
                    var date = moment();
                    var currentDate = date.format('D/MM/YYYY');
                    console.log(currentDate);
                    var currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false })
                    const dataInsert = [data.username];
                    const dataInsert1 = [currentTime, data.username];
                    pool.getConnection((err, connection) => {
                        if (err) {
                            res.send({ status: false, message: err })
                        } else {
                            connection.query('SELECT date,time_stamp FROM attendence WHERE username=? AND ending_time IS NULL AND reason IS NULL AND status="P"', dataInsert, (err1, result1) => {
                                let fetchedDate = result1;
                                console.log(result1);
                                if (err1 || fetchedDate == undefined || fetchedDate.length == 0) {
                                    res.send({ status: false, message: 'Already Checked Out or Start the shift first!' })
                                } else {
                                    const data1 = result1;
                                    let data2 = data1[0].date;
                                    let data3 = data1[0].time_stamp;
                                    console.log(data1, data2, data3)
                                    var myDate = data2;
                                    myDate = myDate.split("/");
                                    let timeStamp = new Date(myDate[2], myDate[1] - 1, myDate[0]).getTime() / 1000;
                                    if (data3 == timeStamp) {
                                        connection.query('UPDATE attendence SET ending_time=? WHERE username=?', dataInsert1, (err2, result2) => {
                                            if (err2) {
                                                res.send({ status: false, message: err2 })
                                            } else {
                                                const dataInsert6 = [data.username, timeStamp];
                                                connection.query('SELECT starting_time,ending_time,date,username FROM attendence WHERE username=? AND reason IS NULL AND time_stamp=?', dataInsert6, (err3, result3) => {
                                                    if (err3 || result3.length == 0) {
                                                        res.send({ status: false, message: err3 })
                                                    } else {
                                                        const data3 = result3;
                                                        const s_time = data3[0].starting_time;
                                                        const e_time = data3[0].ending_time;
                                                        const u_name = data3[0].username;
                                                        const date1 = data3[0].date;
                                                        console.log(data3[0], s_time, e_time, u_name, data1)

                                                        function strToMins(t) {
                                                            var s = t.split(":");
                                                            return Number(s[0]) * 60 + Number(s[1]);
                                                        }

                                                        var Result1 = strToMins(e_time) - strToMins(s_time);
                                                        const hours = Math.floor(Result1 / 60);
                                                        const dataInsert2 = [u_name, hours, date1, timeStamp]
                                                        console.log(dataInsert2);
                                                        connection.query('INSERT INTO shift (username, working_hours, date,time_stamp) VALUES (?,?,?,?)', dataInsert2, (err4, result4) => {
                                                            if (err4 || result4.length == 0) {
                                                                res.send({ status: false, message: err4 })
                                                            } else {
                                                                let date2 = data1[0];
                                                                date2 = date2.date;
                                                                const dataInsert3 = [u_name, date2];
                                                                connection.query('SELECT * FROM loom WHERE username=?', dataInsert3, (err5, result5) => {
                                                                    if (err5 || result5.length == 0) {
                                                                        res.send({ status: false, message: err5 })
                                                                    } else {
                                                                        var selectedLoom = result5[0]
                                                                        selectedLoom = selectedLoom.loom_id;
                                                                        console.log(selectedLoom);
                                                                        console.log(dataInsert3);
                                                                        connection.query('SELECT working_hours FROM shift WHERE username=? AND date=?', dataInsert3, (err6, result6) => {
                                                                            console.log(result6);
                                                                            if (err6 || result6.length == 0) {
                                                                                res.send({ status: false, message: err6 })
                                                                            } else {
                                                                                const dataInsert7 = [data.username];
                                                                                var data7 = result6[0];
                                                                                data7 = data7.working_hours;
                                                                                console.log(data7);
                                                                                connection.query("SELECT productivity_rate,working_time FROM loom WHERE username=?", dataInsert7, (err7, result7) => {
                                                                                    if (err7 || result6.length == 0) {
                                                                                        res.send({ status: false, message: err7 })
                                                                                    } else {
                                                                                        var rate = result7
                                                                                        console.log(rate)
                                                                                        var p_rate = rate[0].productivity_rate;
                                                                                        var w_time = rate[0].working_time;
                                                                                        console.log(w_time);
                                                                                        var productivity = p_rate * data7;
                                                                                        var T_time = parseInt(data7) + w_time;
                                                                                        console.log(productivity, T_time);
                                                                                        const dataInsert4 = [productivity, T_time, selectedLoom, data.username];
                                                                                        console.log(dataInsert4)
                                                                                        connection.query("UPDATE loom SET productivity=?,username=NULL,working_time=?,isOccupied=0 WHERE loom_id=? AND username=?", dataInsert4, (err8, result8) => {
                                                                                            if (err8 || result8.length == 0) {
                                                                                                res.send({ status: false, message: err8 })
                                                                                            } else {
                                                                                                connection.query("SELECT p_weight FROM product", dataInsert, (err9, result9) => {
                                                                                                    if (err9 || result9.length == 0) {
                                                                                                        res.send({ status: false, message: err9 })
                                                                                                    } else {
                                                                                                        var product = result9[0]
                                                                                                        product = product.p_weight;
                                                                                                        var F_product = product + productivity;
                                                                                                        const dataInsert5 = [F_product];
                                                                                                        connection.query("UPDATE product SET p_weight=?", dataInsert5, (err10, result10) => {
                                                                                                            if (err10 || result10.length == 0) {
                                                                                                                res.send({ status: false, message: err10 })
                                                                                                            } else {
                                                                                                                connection.release();
                                                                                                                res.send({ status: true, message: 'Checkout Is Successfull !!' })
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
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        res.send({ status: false, message: 'Date Didnot Matched !!' })
                                    }
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'User Didnot Matched !!' })
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


shiftController.post('/getShift', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            console.log(tokenData)
            if (tokenData.role == 'employee') {
                const dataInsert = [data.username];
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query("SELECT * FROM shift WHERE username=?", dataInsert, (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: ' Your Shift Fetched Successfully !!', "result1": result2 })
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

module.exports = shiftController;