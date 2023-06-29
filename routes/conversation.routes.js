const router = require('express').Router();
const conversationController = require('../controller/conversation.controller');
const authentication = require("../middleware/auth.middleware");


//new conversation

router.post("/",authentication,conversationController.newConversation );
  
//get conversation of a users
router.get("/:userId",authentication, conversationController.getConversationUsers);
  
// get conversation includes two userId
  router.get("/find/:firstUserId/:secondUserId",authentication, conversationController.getConversationIncludesTwoUserId );
  
  module.exports = router;