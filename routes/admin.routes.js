const router = require('express').Router();
const adminController = require('../controller/admin.controller');
const authentication = require("../middleware/auth.middleware");


//Admin Register
 

 //Admin login 
 router.post('/admin-login',authentication, adminController.adminSignIn);
 
//get all user data in admin panel
router.get('/user-details',authentication, adminController.userDetailsInAdmin);

//admin can see users followers, following , hirable, rating
router.get('/admin-personal-user-view/:userId',authentication, adminController.adminUserPersonalAccountView);

//admin can see bussiness user 
router.get('/admin-bussiness-user-view/:userId',authentication, adminController.adminUserBussinessAccountView);

//admin can see users likes, comments adminViewPost
router.get('/story/:userId',authentication, adminController.adminViewStory);

//admin can see users
router.get('/admin-post-view',authentication, adminController.adminViewPost);

//admin can see intrest adminViewIntrest
router.get('/admin-intrest-view/:userId',authentication, adminController.adminViewIntrest);

//adminViewchat admin can see chat
router.get('/admin-chat-view/:userId',authentication, adminController.adminViewchat);

//admin explore can see
router.get('/admin-chat-view/:userId',authentication, adminController.adminViewchat);


module.exports = router