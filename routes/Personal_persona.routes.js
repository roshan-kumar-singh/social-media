const router = require("express").Router();
const messageController = require('../controller/message.controller');
const authentication = require("../middleware/auth.middleware");

//add new messages
router.post("/",authentication,messageController.addNewMessages);



module.exports = router;