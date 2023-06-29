//const router = require('express').Router();
const express = require("express");
const router = express();
const bodyParser = require("body-parser")
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const authController = require('../controller/auth.controller');
const multer = require('multer');
const path = require('path');
router.use (express.static('public'));
const authentication = require("../middleware/auth.middleware");
//const config = require("../config/config");


const storage =multer.diskStorage({
    destination:function(req, file,cb){
        cb(null,path.join(__dirname,'../public/authMedia/professional'),function(error,success){
            if(error) throw error;
        })
    },
    filename:function(req,file,cb){
       const name = Date.now()+'-'+file.originalname;
       cb(null, name, function(error1,success1){
        if(error1) throw error1;
       })
    }
});

const upload = multer({storage:storage});

//Register
router.post("/register",authController.register )

//using user id i will get details of the user
router.get("/get-user-details/:id",authentication,authController.getUserDetailsById)

//get all data
router.get('/userdetails',authentication,authController.userDetails)

//signin
router.post('/login', authController.signIn);
 
//change Password
router.post('/changepassword',authentication, authController.changePassword);


//user profile setup (personal or professional)
router.put('/profile/:_id',authentication, authController.profile);

//get GetstateName
router.get('/profile/get-unique-name/:_id',authentication, authController.getGetstatedName);

//personal account setup
router.post('/setup-personal-account',authentication, authController.setupPersonalAccount);

//professional account setup 
router.post('/setup-professional-account',authentication,upload.single('businessLogo'), authController.setupProfessionaAccount);


//intrest list
router.get('/interests',authentication, authController.intrest);

//choose intrest
router.post('/addInterest',authentication,authController.chooseIntrest);

//email send
//router.post('/email-send',authController.emailSend);

//change password
router.post('/change-password',authentication,authController.changePassword);

// i have updated the code for this...i have used jsonwebtoken for authentication
module.exports = router

