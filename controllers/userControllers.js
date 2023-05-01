const express = require('express');
const UserController = express.Router()
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');
var router = express.Router();
const multer = require("multer");
const path = require("path")


const PRIVATEKEY = "HASSAN-123"

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './templates/uploads/images/')
    },
    filename: function(req, file, cb) {
        cb(null, req.body.username + path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage });


// middleware that is specific to this router
UserController.use((req, res, next) => { next() })
    // define the User Routes 


UserController.get('/dashboard', async(req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("dashboard.html") }
            if (tokenData.role == "employee") { res.render("dashboard1.html") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }
})


UserController.get("/dashboard-users", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("user.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {
            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }
})


UserController.get("/dashboard1", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'employee') { res.render("dashboard1.html") }
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {
            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }
})



UserController.get("/dashboard-user_list", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("user_list.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})

UserController.get("/dashboard-user_attendence", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("user_attendence.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})



UserController.get("/dashboard-user_leave", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("user_leave.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})

UserController.get("/dashboard-user_add", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("user_add.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})

UserController.get("/dashboard-user_update", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("user_update.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})


UserController.post('/loginUser', async(req, res) => {
    // req --> It is the request Object In which we will get data from user that will hit this api
    // res --> It is the responce Object that this api will send to the user 
    const data = req.body;
    if (data.username && data.password) {
        const dataInsert = [data.username, data.password]
        pool.getConnection(function(err, connection) {
            if (err) {
                // connection.release();
                res.send({ status: false, message: "Unable to make connection with servers" })

                // Comment before sending to hassan //
                // res.cookie("token", "dummyToken").send({ "status": false, "message": "Unable to make connection with servers" })
                // -------------------------------- //

            } else {
                connection.query("SELECT * FROM user WHERE username=? AND password=?", dataInsert, function(err2, result2) {
                    if (err2) {
                        res.send({ "status": false, "message": "Some Error occured" })
                    } else {
                        connection.release();
                        if (result2.length > 0) {
                            let token = jwt.sign({ username: data.username, role: result2[0].role }, PRIVATEKEY);
                            res.cookie("token", token).send({ "token": token, "role": result2[0].role, "status": true, "result": result2 })
                        } else { res.send({ "status": false, "message": "Incorrect username or password" }) }
                    }
                })
            }
        })
    } else {
        res.send({ "status": false, "message": "Please provide username and password" })
    }
})


UserController.post('/addUser', async(req, res) => {
    // req --> It is the request Object In which we will get data from user that will hit this api
    // res --> It is the responce Object that this api will send to the user 
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                if (data.username && data.role) {
                    var password = 'Eloom@123';
                    const dataInsert = [data.username, password, data.role, data.phone, data.cnic, data.email, data.gender, data.address]
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            res.send(err)
                        } else {
                            connection.query("INSERT INTO user (username, password,role, phone, cnic, email, gender, address) VALUES (?,?,?,?,?,?,?,?)", dataInsert, function(err2, result2) {
                                if (err2) {
                                    res.send({ status: false, message: 'User Not added successfully', err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'User Added Successfully' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Plz Provide Username and Password' })
                }
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


UserController.post('/updateAdmin', upload.single('file'), async(req, res) => {
    const fileName = req.file.filename; // Store this fileName in your database table
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                if (data.username) {
                    const dataInsert = [data.email, data.password, data.cnic, data.phone, data.gender, data.address, fileName, data.username]
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            res.send({ status: false, message: err })
                        } else {
                            connection.query('UPDATE user SET email=?,password=?,cnic=?,phone=?,gender=?,address=?,image=? WHERE username = ?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Admin or HR updated successfully!' });
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Admin or HR not Updated Successfully!' })
                }
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


UserController.post('/updateEmployee', upload.single('file'), async(req, res) => {
    const fileName = req.file.filename; // Store this fileName in your database table
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'employee') {
                if (data.username) {
                    const dataInsert = [data.email, data.password, data.cnic, data.phone, data.gender, data.address, fileName, data.username]
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            res.send({ status: false, message: err })
                        } else {
                            connection.query('UPDATE user SET email=?,password=?,cnic=?,phone=?,gender=?,address=?,image=? WHERE username = ?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Employee updated successfully' });
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Employee not Updated Successfully!' })
                }
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


UserController.post('/updateUser', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                if (data.username) {
                    const dataInsert = [data.email, data.password, data.cnic, data.phone, data.gender, data.address, data.role, data.username]
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            res.send({ status: false, message: err })
                        } else {
                            connection.query('UPDATE user SET email=?,password=?,cnic=?,phone=?,gender=?,address=?,role=? WHERE username = ?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'User updated successfully' });
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'User not Updated Successfully!' })
                }
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


UserController.post('/deleteUser', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin') {
                if (data.username) {
                    const dataInsert = [data.username];
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            connection.release();
                            res.send({ status: false, message: err });
                        } else {
                            connection.query('DELETE FROM user WHERE username =?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    connection.release();
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'User Deleted Successfully!' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'User not Deleted Successfully!' })
                }
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


UserController.get('/getUser', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT * FROM user', (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Users Fetched Successfully!', "usersList": result2 })
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

module.exports = UserController;