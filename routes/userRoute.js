const express = require('express')
const router = express.router()

const Usercontroller = require('../controller/userController')

router.get('/getuser',Usercontroller.getuser)

router.get('/createuser',Usercontroller.createuser)