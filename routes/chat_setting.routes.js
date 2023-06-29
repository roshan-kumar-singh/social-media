const router = require('express').Router();
const ChatSettingController = require('../controller/chat_setting.controller');
const authentication = require("../middleware/auth.middleware");


//Request List
router.get('/requests',authentication, ChatSettingController.requestList);

//accept message request
router.post('/requests/:requestId/accept',authentication, ChatSettingController.acceptMessageRequest );

// Block user
router.post('/block/:userId',authentication, ChatSettingController.blockUser);

// Unblock user
router.delete('/blocks/:userId',authentication,ChatSettingController.unblockUser );
  
// Get blocked user list
  router.get('/blocks',authentication, ChatSettingController.getBlockedUserList);
  
//Accept message request
  router.get('/:userId',authentication, ChatSettingController.acceptMessageRequest);
  
  module.exports = router;