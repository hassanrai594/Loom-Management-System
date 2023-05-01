const express = require('express');
const EmailController = express.Router();
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');
var nodemailer = require('nodemailer');


const PRIVATEKEY = "HASSAN-123"


// middleware that is specific to this router
EmailController.use((req, res, next) => {
    next();
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hassanrai594@gmail.com',
        pass: 'vsllxnnztqsrtwrq'
    }
});

EmailController.post('/replyQuery', async(req, res) => {
    // req --> It is the request Object In which we will get data from user that will hit this api
    // res --> It is the responce Object that this api will send to the user 
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            const dataInsert = [data.query_id];
            if (tokenData.role == 'admin' || tokenData.role == 'hr') {
                var mailOptions = {
                    from: 'hassanrai594@gmail.com',
                    to: data.email,
                    subject: 'Reply from E-LOOM',
                    text: data.message
                };

                transporter.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err);
                        res.send({ status: false, message: 'Email not sent', "error": err })
                    } else {
                        pool.getConnection(function(err, connection) {
                            if (err) {
                                res.send({ status: false, message: err })
                            } else {
                                connection.query('UPDATE query SET status=1 WHERE query_id=?', dataInsert, (err2, result2) => {
                                    if (err2) {
                                        res.send({ status: false, message: err2 })
                                    } else {
                                        connection.release();
                                        res.send({ status: true, message: 'Email Sent Successfully!!' })
                                    }
                                })
                            }
                        })
                    }
                });
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


module.exports = EmailController;