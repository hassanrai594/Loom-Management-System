const express = require('express');
const AttendenceController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');
const moment = require('moment');

const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
AttendenceController.use((req, res, next) => {
    next();
})


AttendenceController.get("/dashboard1-attendence", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'employee') { res.render("attendence1.html") }
            if (tokenData.role == tokenData.role == 'admin' || tokenData.role == 'hr') { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {
            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }
})

AttendenceController.get("/dashboard1-leave", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'employee') { res.render("leave1.html") }
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {
            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }
})


AttendenceController.get("/dashboard1-markLeave", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'employee') { res.render("mark_leave.html") }
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {
            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }
})

AttendenceController.post('/markAttendence', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'employee') {
                if (data.username == tokenData.username) {
                    var date = moment();
                    var currentDate = date.format('D/MM/YYYY');
                    console.log(currentDate);
                    var myDate = currentDate;
                    myDate = myDate.split("/");
                    let timeStamp = new Date(myDate[2], myDate[1] - 1, myDate[0]).getTime() / 1000;
                    var currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false })
                    const dataInsert = [data.username, currentDate, currentTime, timeStamp]
                    const dataInsert2 = [data.username]
                    pool.getConnection((err, connection) => {
                        if (err) {
                            res.send({ status: false, message: err })
                        } else {
                            connection.query("INSERT INTO attendence (username, date,starting_time ,status, time_stamp) VALUES (?,?,?,'P',?)", dataInsert, (err, result) => {
                                if (err) {
                                    res.send({ status: false, message: err })
                                } else {
                                    connection.query("SELECT * FROM loom WHERE isOccupied=0 LIMIT 1", (err2, result2) => {
                                        if (err2) {
                                            res.send({ status: false, message: err2 })
                                        } else {
                                            var selectedLoom = result2[0];
                                            selectedLoom = selectedLoom.loom_id
                                            const dataInsert1 = [data.username, selectedLoom]
                                            console.log(dataInsert1)
                                            connection.query("UPDATE loom SET isOccupied=1,username=? WHERE loom_id=?", dataInsert1, (err3, result3) => {
                                                if (err3) {
                                                    res.send({ status: false, message: err3 })
                                                } else {
                                                    connection.query("UPDATE attendence SET `status`='A' WHERE username=? AND status IS NULL", dataInsert2, (err4, result4) => {
                                                        if (err4) {
                                                            res.send({ status: false, message: err4 })
                                                        } else {
                                                            connection.release();
                                                            res.send({ status: true, message: 'Attendence Marked Successfully !!' })
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



AttendenceController.post('/markLeave', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'employee') {
                if (data.username == tokenData.username) {
                    // let currentDate = new Date().toJSON().slice(0, 10);
                    var date = moment();
                    var currentDate = date.format('D/MM/YYYY');
                    console.log(currentDate);
                    const dataInsert = [data.username, currentDate, data.reason]
                    pool.getConnection((err, connection) => {
                        if (err) {
                            res.send({ status: false, message: err })
                        } else {
                            connection.query("INSERT INTO attendence (username, date, reason) VALUES (?,?,?)", dataInsert, (err2, result2) => {
                                if (err2) {
                                    res.send({ status: false, message: err2 })
                                } else {
                                    res.send({ status: true, message: 'Leave Marked Successfully !!' })
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
        res.send({ status: false, message: 'Incorrect Token' });
    }
})



AttendenceController.post('/verifyLeave', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                if (data.username && data.date) {
                    const dataInsert = [data.date, data.username.toString()];
                    pool.getConnection((err, connection) => {
                        if (err) {
                            res.send({ status: false, message: err })
                        } else {
                            connection.query("UPDATE attendence SET `status`='L' WHERE date=? AND username=?", dataInsert, (err2, result2) => {
                                if (err2) {
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Leave Verified Successfully !!' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Leave not Verified Successfully!' })
                }
            } else {
                res.send({ status: false, message: 'You are not Authenticated to perform this Operation' })
            }
        } catch (err) {
            res.send({ status: false, message: 'Incorrect Token' });
        }
    } else {
        res.send({ status: false, message: 'Incorrect Token' });
    }
})


AttendenceController.post('/getAttendence', async(req, res) => {
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
                        connection.query("SELECT * FROM attendence WHERE username=? AND `status`='P'", dataInsert, (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: ' Your Attendence Fetched Successfully !!', "result1": result2 })
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


AttendenceController.post('/getLeave', async(req, res) => {
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
                        connection.query("SELECT * FROM attendence WHERE username=? AND `status`='L'", dataInsert, (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: ' Your Leave Fetched Successfully !!', "result1": result2 })
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


AttendenceController.get('/getUserattendence', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == "hr") {
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query("SELECT * FROM attendence WHERE `status`='P'", (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Attendence Fetched Successfully !!', result2 })
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

AttendenceController.get('/getUserleave', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == "hr") {
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query("SELECT * FROM attendence WHERE `status` IS NULL AND reason IS NOT NULL", (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Leaves Fetched Successfully !!', result2 })
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


AttendenceController.post('/getUserStatus', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            console.log(tokenData)
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                const dataInsert = [data.username];
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query("SELECT * FROM attendence WHERE username=?", dataInsert, (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'All User Attendence and leaves Fetched Successfully !!', "userReport": result2 })
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


AttendenceController.post('/getDateRange', async(req, res) => {
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
                const dataInsert = [data.username, timeStamp1, timeStamp2];
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query("SELECT * FROM attendence WHERE username=? AND time_stamp between ? AND ?", dataInsert, (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                let length = result2.length;
                                var status = result2.map(({
                                    status
                                }) => status)

                                var presents = 0,
                                    absents = 0,
                                    leaves = 0;
                                const count = {}

                                function find_duplicate_in_array(array) {
                                    const result = []
                                    array.forEach(item => {
                                        if (count[item]) {
                                            count[item] += 1
                                            return
                                        }
                                        count[item] = 1
                                    })

                                    for (let prop in count) {
                                        if (count[prop] >= 2) {
                                            result.push(prop)
                                        }
                                    }
                                    console.log(count)
                                    return result;
                                }

                                find_duplicate_in_array(status)
                                presents = count.P;
                                absents = count.A;
                                leaves = count.L;
                                presentsPercent = (presents / length) * 100;
                                absentsPercent = (absents / length) * 100;
                                leavesPercent = (leaves / length) * 100;
                                console.log(length, status, count, presentsPercent, absentsPercent, leavesPercent);
                                res.send({ status: true, message: 'Data is filtered by dates', "TimeStamp": result2, "P_percentage": presentsPercent, "A_percentage": absentsPercent, "L_percentage": leavesPercent })
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
module.exports = AttendenceController;