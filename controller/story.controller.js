const story = require("../model/Story");
const UserRegistration = require('../model/user');
class storyController{
    
   //add story
   
    addStory = async (req, res) => {
              try {
           const newStory = new story({
             userId:req.body.userId,
            mediaType:req.body.mediaType,
            mediaUrl:req.file.filename
          });
          const savedStory = await newStory.save();
                res.status(200).json({ message: 'Story added successfully', story: savedStory });
    }catch (error){
      res.status(400).send(error.message);
    }
  }

//get all story
getStoryListFollowingUser = async (req, res) => {
  try {
    const stories = await story.find();
    const users = await UserRegistration.find({}, 'username'); // Fetch only the "username" field from UserRegistration

    const result = stories.map((story) => {
      const user = users.find((user) => user._id.toString() === story.userId.toString());
      return { ...story.toObject(), username: user ? user.username : null };
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//user can like the story
      likeStory = async (req, res) => {
        try {
          const { _id } = req.params; //story id
          const { userId } = req.body;//user id
      
          const stories = await story.findOne({ _id });
          if (stories.Likes.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this story' });
          }
          stories.Likes.push(userId);
          await stories.save();
      
          res.json({ message: 'Story liked successfully' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        }
      } 

      //user can comment on story
      // commentStory = async (req, res) => {
      //   try {
      //     const { _id } = req.params;
      //     const { userId, text } = req.body;
      //     const stories = await story.findOne({_id});
      //     const newComment = {
      //       userId,
      //       text
      //     };
      
      //     stories.Comments.push(newComment);
      //     await stories.save();
      
      //     res.json({ message: 'Comment added successfully', stories });
      //   } catch (error) {
      //     console.error(error);
      //     res.status(500).json({ message: 'Server error' });
      //   }
      // };
      commentStory = async (req, res) => {
        try {
          const { _id } = req.params;
          const { userId, text } = req.body;
          const stories = await story.findOne({ _id });
      
          if (!stories) {
            return res.status(404).json({ message: 'Story not found' });
          }
      
          const timestamp = new Date(); // Capture the current timestamp when the comment is created
      
          const newComment = {
            userId,
            text,
            timestamp
          };
      
          stories.Comments.push(newComment);
          await stories.save();
      
          res.json({ message: 'Comment added successfully', stories, timestamp });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      };
      //comment on comment
       commentOnComment = async (req, res) => {
        try {
          const { storyId, commentId, userId } = req.query;

          const {  text } = req.body;
      
          const stories = await story.findOne({ _id: storyId });
      
          if (!stories) {
            return res.status(404).json({ message: 'Story not found' });
          }
      
          const comment = stories.Comments.find((c) => c._id.toString() === commentId);
      
          if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
          }
      
          const timestamp = new Date(); // Capture the current timestamp when the comment is created
      
          // Check if the userId matches the userId of the original comment
          if (comment.userId.toString() === userId) {
            return res.status(403).json({ message: 'User cannot comment on their own comment' });
          }
      
          const newComment = {
            userId,
            text,
            timestamp,
          };
      
          // Check if comment.Comments is defined and an array, if not, initialize it as an empty array
          if (!comment.Comments || !Array.isArray(comment.Comments)) {
            comment.Comments = [];
          }
      
          comment.Comments.push(newComment);
          await stories.save();
      
          res.json({ message: 'Comment added successfully', comment: newComment, timestamp });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      };
      
      
      
      
      
      
      
// get all comment list

      getCommentList =  async (req, res) => {
          try {
    const { _id } = req.params;
    const stories = await story.findOne({_id}); // Populating the userId field to get the username of the commenter
    if (!stories) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ comments: stories.Comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
      }

       //filter comment list
        filterCommentList = async (req, res) => {
          try {
            // Get the filter option from the request query parameters
            const { filter } = req.query;
        
            // Construct the Mongoose aggregation pipeline based on the filter option
            let pipeline = [];
        
            if (filter === 'new_comment') {
              pipeline = [
                { $unwind: '$Comments' },
                { $sort: { 'Comments.createdAt': -1 } },
                {
                  $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    mediaType: { $first: '$mediaType' },
                    mediaUrl: { $first: '$mediaUrl' },
                    Likes: { $first: '$Likes' },
                    shares: { $first: '$shares' },
                    Comments: { $push: '$Comments' }
                  }
                }
              ];
            } else if (filter === 'old_comment') {
              pipeline = [
                { $unwind: '$Comments' },
                { $sort: { 'Comments.createdAt': 1 } },
                {
                  $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    mediaType: { $first: '$mediaType' },
                    mediaUrl: { $first: '$mediaUrl' },
                    Likes: { $first: '$Likes' },
                    shares: { $first: '$shares' },
                    Comments: { $push: '$Comments' }
                  }
                }
              ];
            } else {
              // Default case: no filter, retrieve all stories
              pipeline = [
                {
                  $project: {
                    _id: 1,
                    userId: 1,
                    mediaType: 1,
                    mediaUrl: 1,
                    Likes: 1,
                    shares: 1,
                    Comments: 1
                  }
                }
              ];
            }
        
            // Execute the aggregation pipeline
            const stories = await story.aggregate(pipeline);
        
            res.json(stories);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          }
      }
      addReactComment = async (req, res) => {
        try {
          const { storyId, commentId } = req.params;
          const { reaction } = req.body;
      
          // Find the story by its ID and update the comment's reactions
          const Story = await story.findOneAndUpdate(
            { _id: storyId, 'Comments._id': commentId },
            { $push: { 'Comments.$.reactions': reaction } },
            { new: true }
          );
      
          if (!Story) {
            return res.status(404).json({ message: 'Story or comment not found' });
          }
      
          res.json(Story);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        }

}

// user can like comment
likeComment = async (req, res) => {
  const { storyId, commentId, userId } = req.params;

  try {
    // Validate the object IDs
    if (!mongoose.Types.ObjectId.isValid(storyId) ||
        !mongoose.Types.ObjectId.isValid(commentId) ||
        !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid object ID' });
    }

    // Find the story by its ID
    const story = await story.findById(storyId);

    // Find the comment within the story by its ID
    const comment = story.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return res.status(400).json({ error: 'You have already liked this comment' });
    }

    // Add the user's ID to the comment's likes array
    comment.likes.push(userId);

    // Save the updated story
    await story.save();

    res.json({ message: 'Comment liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

}
module.exports = new storyController();