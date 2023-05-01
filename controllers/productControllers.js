const express = require('express');
const ProductController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');


const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
ProductController.use((req, res, next) => {
    next();
})


ProductController.get("/dashboard-product", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("product.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})

ProductController.get("/dashboard-product_add", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("product_add.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})

ProductController.get("/dashboard-product_update", async(req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            // if token is provided authenitcate it and then allow it to show html page 
            if (tokenData.role == 'admin' || tokenData.role == 'hr') { res.render("product_update.html") }
            if (tokenData.role == "employee") { res.redirect("http://localhost:4000/home/signin") }
        } catch (err) {

            res.redirect("http://localhost:4000/home/signin")
        }
    } else { res.redirect("http://localhost:4000/home/signin") }

})


ProductController.post('/addProduct', async(req, res) => {
    // req --> It is the request Object In which we will get data from user that will hit this api
    // res --> It is the responce Object that this api will send to the user 
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                if (data.p_description && data.p_rate) {
                    const dataInsert = [data.p_description, data.p_rate]
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            res.send(err)
                        } else {
                            connection.query("INSERT INTO product (p_description, p_rate) VALUES (?,?)", dataInsert, function(err2, result2) {
                                if (err2) {
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Product Added Successfully' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: "Kindly Provide Product Name and Product Rate" })
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


ProductController.post('/updateProduct', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                if (data.p_description) {
                    const dataInsert = [data.p_description, data.p_rate, data.p_description]
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            connection.release();
                            res.send({ status: false, message: err })
                        } else {
                            connection.query('UPDATE product SET p_description=?,p_rate=? WHERE p_description = ?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    connection.release();
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Product Updated Successfully' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Product not Updated Successfully!' })
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

ProductController.post('/deleteProduct', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;

    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin') {
                if (data.p_description) {
                    const dataInsert = [data.p_description];
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            res.send({ status: false, message: err });
                        } else {
                            connection.query('DELETE FROM product WHERE p_description =?', dataInsert, (err2, result2) => {
                                if (err2) {
                                    res.send({ status: false, message: err2 })
                                } else {
                                    connection.release();
                                    res.send({ status: true, message: 'Product Deleted Successfully!' })
                                }
                            })
                        }
                    })
                } else {
                    res.send({ status: false, message: 'Product not Deleted Successfully!' })
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


ProductController.get('/getProduct', async(req, res) => {
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('SELECT * FROM product', (err2, result2) => {
                            if (err2) {
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                res.send({ status: true, message: 'Product Fetched Successfully!', result2 })
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

module.exports = ProductController;