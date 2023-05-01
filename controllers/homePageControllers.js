const express = require('express');
const HomePageController = express.Router()
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');
var router = express.Router();
var nodemailer = require('nodemailer');

const PRIVATEKEY = "HASSAN-123"

HomePageController.use((req, res, next) => { next() })

HomePageController.get("/", async(req, res) => { res.render("index.html") })
HomePageController.get("/about", async(req, res) => { res.render("about.html") })
HomePageController.get("/contact", async(req, res) => { res.render("contact.html") })
HomePageController.get("/signin", async(req, res) => { res.render("index1.html") })
HomePageController.get("/forget_password", async(req, res) => { res.render("index2.html") })
HomePageController.get("/reset_password/:token", async(req, res) => { res.render("index3.html") })


HomePageController.post('/sendLink', async(req, res) => {
    const data = req.body;
    const dataInsert = [data.email]
    try {
        pool.getConnection(function(err, connection) {
            if (err) {
                res.send({ status: false, message: err })
            } else {
                connection.query('SELECT * FROM user WHERE email=?', dataInsert, async(err2, result2) => {
                    if (err2) {
                        connection.release();
                        res.send({ status: false, message: "Email doesnot exist!" })
                    } else {
                        connection.release();
                        // -------------------------------------------------------- //


                        const tokenGenerated = jwt.sign({ id: data.email }, PRIVATEKEY, { expiresIn: '1h' });
                        console.log(tokenGenerated);

                        const baseRoute = 'http://localhost:4000/home/reset_password';
                        const link = `${baseRoute}/token=${tokenGenerated}`

                        //define mailing options
                        var mail = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'hassanrai594@gmail.com', // Your email id
                                pass: 'vsllxnnztqsrtwrq' // Your password
                            }
                        });
                        var html = `<html>
                        <head>
                        <meta http-equiv="content-type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0;">
                        <meta name="format-detection" content="telephone=no"/>
                        
                        <style>
                        body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
                        body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
                        table, td {  border-collapse: collapse !important; border-spacing: 0; }
                        img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                        #outlook a { padding: 0; }
                        .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
                        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
                        
                        @media all and (max-width: 600px) {
                        .floater { width: 320px; }
                        }
                        a, a:hover {
                        color: #127DB3;
                        }
                        .footer a, .footer a:hover {
                        color: #999999;
                        }
                        
                        </style>
                        
                        </head>
                        <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
                        background-color: #FFFFFF;
                        color: #000000;"
                        bgcolor="#FFFFFF"
                        text="#000000">
                        <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
                        bgcolor="#fff">
                        <table border="0" cellpadding="0" cellspacing="0" align="center"
                        width="600" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                        max-width: 600px;" class="wrapper">
                        
                        <tr>
                        <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                        padding-top: 20px;">
                        
                        
                        <img border="0" vspace="0" hspace="0"
                            src="https://assets-converza.s3.amazonaws.com/logo.png"
                            width="6" height="60"
                            alt="Logo" title="Logo" style="
                            color: #000000;
                            font-size: 10px; margin-top: 30px; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" />
                        <img border="0" vspace="0" hspace="0"
                        src="https://portal.convirzaai.com/assets/Group.png"
                        width="60" height="60"
                        alt="Logo" title="Logo" style="
                        color: #000000;
                        font-size: 10px; margin-top: 50px; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" />
                        </td>
                        </tr>
                        <tr>
                        <td>
                        <div
                        class="textclasss"
                        style="
                        width: 560px;
                        background: #ffffff;
                        padding: 40px;
                        background-image: url(https://portal.convirzaai.com/assets/backemail.png) !important;
                        background-size:  662px 210px !important;
                        padding-bottom : 80px !important;
                        "
                        
                        >
                        <div>
                        <strong
                        style="
                        display: block;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: 600;
                        color: #16192c;
                        width: fit-content;
                        margin-left: auto;
                        margin-right: auto;
                        text-align : center;
                        font-family: Inter, sans-serif !important;
                        "
                        >Welcome</strong
                        ><br />
                        <span
                        style="
                        display: block;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 400;
                        color: #425466;
                        width: fit-content;
                        margin-left: auto;
                        margin-right: auto;
                        margin-top: 15px;
                        text-align : center;
                        font-family: Inter, sans-serif !important;
                        "
                        >
                        A request has been submitted to change the password for your account. 
                        If this was not requested by you then you can simply ignore this message. 
                        If you do want to change the password for your account you can click on the link below, 
                        that will direct you to a page where you can create a new Password. .</span
                        ><br />
                        <a
                        class="btn-primary"
                        style="
                        display: block;
                        margin-left: auto;
                        width: 115px;
                        font: inter;
                        text-align: center;
                        text-decoration: none;
                        margin-right: auto;
                        font-size: 12px;
                        font-weight: 600;
                        margin-top: 7px;
                        padding: 12px 20px 12px 20px;
                        background-color: #2999fd;
                        border-radius: 6px;
                        color: #fff;
                        border: none !important;
                        margin-top:5px;
                        font-family: Inter, sans-serif !important;
                        "
                        href="${link}"
                        >
                        Click here
                        </a>
                        </div>
                        </div>
                        </div>
                        </div>
                        </td>
                        </tr>
                        </table>
                        
                        </body>
                        </html>`;

                        var mailOptions = {
                            from: 'hassanrai594@gmail.com',
                            to: data.email,
                            subject: 'Reset Password Link',
                            html: html
                        };
                        if (result2.length > 0) {
                            const respond = await mail.sendMail(mailOptions);
                            // ----------------------------------------------------------- //
                            res.send({ status: true, message: 'Email Sent Successfully!' })
                        } else {
                            res.send({ status: false, message: 'Email not Found !!' })
                        }
                    }
                })
            }
        })
    } catch (err) {
        res.send({ status: false, message: 'Incorrect Email' })
    }
})


HomePageController.post('/ResetPassword', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;
    if (token) {
        try {
            const tokenData = jwt.verify(token, PRIVATEKEY);
            console.log(tokenData);
            let email = tokenData.id;
            if (data.password) {
                const dataInsert = [data.password, email]
                pool.getConnection(function(err, connection) {
                    if (err) {
                        res.send({ status: false, message: err })
                    } else {
                        connection.query('UPDATE user SET password=? WHERE email=?', dataInsert, (err2, result2) => {
                            if (err2) {
                                connection.release();
                                res.send({ status: false, message: err2 })
                            } else {
                                connection.release();
                                console.log(dataInsert);
                                res.send({ status: true, message: 'Password Updated Successfully' })
                            }
                        })
                    }
                })
            } else {
                res.send({ status: false, message: 'Password not Updated Successfully!' })
            }
        } catch (err) {
            res.send({ status: false, message: 'Incorrect Token' })
        }
    } else {
        res.send({ status: false, message: 'Kindly Provide Token' });
    }
})


module.exports = HomePageController;