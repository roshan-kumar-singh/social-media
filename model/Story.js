const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'text'],
      required: true
    },
    mediaUrl: {
      type: String,
      required: true
    },
    likes: [{
      type: String,
      default: '0'
    }],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
        },
        reactions: [
          {
            type: String,
            enum: ['love', 'smiley', 'like'],
          },
        ],
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          }
        ],
        comments: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            text: {
              type: String,
              required: true,
            },
            timestamp: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        timestamp: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    shares: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
