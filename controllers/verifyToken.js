const express = require('express');
const verifyTokenController = express.Router()
var jwt = require('jsonwebtoken');
const pool = require('../dataBase/dbConnector');

const PRIVATEKEY = "HASSAN-123"

verifyTokenController.use((req, res, next) => { next() })

function checkToken(req, res, next) {
    if (!req.body.token)
        return res.statue(401).send()
    else
        next()
}


verifyTokenController.post('/token', async(req, res) => {
    const data = req.body;

    try {
        let resultVerify = jwt.verify(data.token, PRIVATEKEY);
        if (resultVerify.role == data.role || resultVerify.role == "admin") { res.send({ "status": true }) } else { res.send({ "status": false, "message": "Message You Are not authorized to view this page" }) }
    } catch (err) { res.send({ "status": false, "message": "Invalid token" }) }

})

module.exports = verifyTokenController;