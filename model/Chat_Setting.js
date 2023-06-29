const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' },
  status: { 
    type: String,
     enum: ['pending', 'accepted', 'rejected'], 
     default: 'pending' },
  createdAt: { 
    type: Date, 
    default: Date.now },
});

const blockSchema = new mongoose.Schema({
  blockerId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' },
  blockedId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' },
  createdAt: { 
    type: Date,
    default: Date.now },
});

const chatControlSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' },
  allowList: [{ 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' }],
  blockList: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' }],
});

const Request = mongoose.model('Request', requestSchema);
const Block = mongoose.model('Block', blockSchema);
const ChatControl = mongoose.model('ChatControl', chatControlSchema);

module.exports = {
  Request,
  Block,
  ChatControl,
};
