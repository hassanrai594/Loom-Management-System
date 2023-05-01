const express = require('express')
const LoomController = express.Router()
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');


const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
LoomController.use((req, res, next) => {
    next();
})



LoomController.get("/dashboard-looms", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("loom.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {
            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }
})

LoomController.get("/dashboard-looms_add", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("loom_add.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {
            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }
})


LoomController.get("/dashboard-looms_update", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("loom_update.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})



// define the home page route
LoomController.get('/all', (req, res) => {
    res.render("loomsPage.html", { locals: { title: 'This is Backend Api Talking !' } })

})

LoomController.post('/addLoom', async(req, res) => {
    // req --> It is the request Object In which we will get data from user that will hit this api
    // res --> It is the responce Object that this api will send to the user 
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                if (data.loom_name && data.loom_company && data.operate_rate && data.productivity_rate) {
                    const dataInsert = [data.loom_name, data.loom_company, data.operate_rate, data.productivity_rate]
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            res.send({ status: false, message: err })
                        } else {
                            connection.query("INSERT INTO loom (loom_name, loom_company, operate_rate, productivity_rate) VALUES (?,?,?,?)", dataInsert, function(err2, result2) {
                                if (err2) {
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Loom Added Successfully' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: "Kindly Provide Loom Name and Loom Company!" })
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


LoomController.post('/updateLoom', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                if (data.loom_name) {
                    const dataInsert = [data.loom_name, data.loom_company, data.operate_rate, data.productivity_rate, data.loom_name]
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            connection.release();
                            res.send({ status: false, message: err })
                        } else {
                            connection.query('UPDATE loom SET loom_name=?,loom_company=?,operate_rate=?,productivity_rate=? WHERE loom_name = ?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    connection.release();
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Loom Updated Successfully' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Loom not Updated Successfully!' })
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



LoomController.post('/deleteLoom', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin') {
                if (data.loom_name) {
                    const dataInsert = [data.loom_name];
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            connection.release();
                            res.send({ status: false, message: err });
                        } else {
                            connection.query('DELETE FROM loom WHERE loom_name =?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    connection.release();
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Loom Deleted Successfully!' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Loom not Deleted Successfully!' })
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


LoomController.get('/getLoom', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection(function(err, connection) {
                    if (err) {
                        connection.release();
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT * FROM loom', (err2, result2) => {
                            if (err2) {
                                connection.release();
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Looms Fetched Successfully!', result2 })
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



module.exports = LoomController;