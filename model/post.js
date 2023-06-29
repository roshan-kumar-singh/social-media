
 const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
      mediaType: {
        type: String,
        enum: ['image', 'video', 'text', 'audio'],
        required: true
      },
      mediaUrl: {
        type: String
              },
      Enabledpoll: {
        type: Boolean,
        default: false,
      },
      ShowPollResults: {
        type: Boolean,
        default: false,
      },
      setTimer: {
        type: Number,
        default: '0',
      },
      caption: String,

      privacy: {
        likesAndViews: {
          type: String,
          enum: ['hideFromEveryone', 'peopleYouFollow', 'noOne'],
          default: 'peopleYouFollow',
        },
        hideLikeAndViewsControl: {
          type: String,
          default: '0',
        },
      },
      tagPrivacy: {
        type: String,
        enum: ['everyone', 'peopleYouFollow', 'noOne'],
        default: 'everyone',
      },

      Reacted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '0'
      }],

      Likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '0'
      }],

      Comments: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
          default: 'no comments'
        }
      }],
      shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],

      pollDuration: {
        type: Number,
        default: 0,
      },
      
      PollResults: {
        yes: {
          type: Number,
          default: 0,
        },
        no: {
          type: Number,
          default: 0,
        },
      },
       },
{ timestamps: true });

PostSchema.virtual('totalLikes').get(function () {
  return this.Likes.length;
});

module.exports = mongoose.model("post", PostSchema);














