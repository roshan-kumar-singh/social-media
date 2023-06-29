const router = require("express").Router();
const messageController = require('../controller/message.controller');
const authentication = require("../middleware/auth.middleware");

//add new messages
router.post("/",authentication,messageController.addNewMessages);

//get messages
router.get("/:conversationId",authentication, messageController.getMessages);

module.exports = router;