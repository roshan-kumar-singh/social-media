const { Request, Block, ChatControl } = require('../model/Chat_Setting');

class ChatSettingController {
    requestList = async (req, res) => {
        try {
          const requests = await Request.find().populate('senderId receiverId');
          res.status(200).json(requests);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        }
      }

      acceptMessageRequest = async (req, res) => {
        try {
          const requestId = req.params.requestId;
          const request = await Request.findById(requestId);
      
          if (!request) {
            return res.status(404).json({ message: 'Request not found' });
          }
      
          if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request has already been handled' });
          }
    
          request.status = 'accepted';
          await request.save();
      
          return res.status(200).json({ message: 'Request accepted successfully' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      }

      blockUser = async (req, res) => {
        try {
          const currentUser = req.user; 
          const userToBlockId = req.params.userId;
      
          const block = await Block.findOne({ blockerId: currentUser._id, blockedId: userToBlockId });
          if (block) {
            return res.status(400).json({ message: 'User is already blocked' });
          }
          const chatControl = await ChatControl.findOne({ userId: currentUser._id });
          if (chatControl.allowList.includes(userToBlockId)) {
            return res.status(400).json({ message: 'User is in the allow list' });
          }
          const newBlock = new Block({ blockerId: currentUser._id, blockedId: userToBlockId });
          await newBlock.save();
      
          res.status(200).json({ message: 'User blocked successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      }

      unblockUser = async (req, res) => {
        try {
          const block = await Block.findOne({ blockerId: req.user._id, blockedId: req.params.userId });
          if (!block) return res.status(404).send('Block not found');
      
          await block.remove();
      
          res.send('Block removed');
        } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
        }
      }

      getBlockedUserList = async (req, res) => {
        try {
          const blockedUsers = await Block.find({ blockerId: req.user._id }).populate('blockedId', 'username');
          res.json(blockedUsers);
        } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
        }
      }

      acceptMessageRequest = async (req, res) => {
        try {
          const userId = req.params.userId;
          const chatControl = await chatControl.findOne({ userId }).populate('allowList blockList');
          if (!chatControl) {
            return res.status(400).json({ message: 'Chat control settings not found for the user' });
          }
          res.status(200).json({ chatControl });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      }

}
module.exports = new ChatSettingController();