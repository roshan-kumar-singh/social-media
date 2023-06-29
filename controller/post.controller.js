const Post = require("../model/post");
const UserRegistration = require('../model/user');
class postController {
  
//create post 

  createPost  = async (req, res) => {
try{
       const post = new Post({
        userId:req.body.userId,
        mediaType:req.body.mediaType,
        mediaUrl:req.file.filename,
        Enabledpoll:req.body.Enabledpoll,
        ShowPollResults:req.body.ShowPollResults,
        setTimer:req.body.setTimer,
        caption:req.body.caption,
        privacy:req.body.privacy,
        tagPrivacy:req.body.tagPrivacy,
        Reacted:req.body.Reacted,
        shares:req.body.shares,
        pollDuration:req.body.pollDuration,
      }); 
      const savedPost = await post.save();
      res.status(200).json({ postId: savedPost._id, message: 'Post created successfully' });
} catch (error){
  res.status(400).send(error.message);
}
}
  
//user can get all post 
getPostListFollowingUser = async (req, res) => {
  try {
    let limit = Number(req.params.limit) || 10;
    let skip = Number(req.query.skip) || 0;

    const posts = await Post.find().skip(skip).limit(limit);
    const users = await UserRegistration.find(); // Retrieve users from the UserRegistration model

    return res.status(200).json({ posts, users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//user can get link of media url
getPostMediaUrlLink = async (req, res) => {
  try {
    const posts = await Post.find({}, { mediaUrl: 1, _id: 1 });
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

  //user can like other post
  likePost = async (req, res) => {
    try {
      const { _id } = req.params; // post id
      const { userId } = req.body; // user id
  
      const post = await Post.findOne({ _id });
  
      // Check if the user has already liked the post
      const userIndex = post.Likes.indexOf(userId);
      if (userIndex !== -1) {
        // User has already liked the post, so unlike it
        post.Likes.splice(userIndex, 1);
        await post.save();
        return res.json({ message: 'Post unliked successfully', totalLikes: post.totalLikes });
      }
  
      // User hasn't liked the post, so like it
      post.Likes.push(userId);
      await post.save();
  
      res.json({ message: 'Post liked successfully', totalLikes: post.totalLikes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
//user can comment on post
addCommentPost = async (req, res) => {
  try {
    const { _id } = req.params;
    const { userId, text } = req.body;
    const post = await Post.findOne({ _id });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const timestamp = new Date(); // Capture the current timestamp when the comment is created

    const newComment = {
      userId,
      text,
      timestamp
    };

    post.Comments.push(newComment);
    await post.save();

    res.json({ message: 'Comment added successfully', post, timestamp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//all comments
  getCommentList = async (req, res) => {
     try {
      const { _id } = req.params;
      const post = await Post.findOne({_id}); // Populating the userId field to get the username of the commenter
      if (!post) {
        return res.status(404).json({ message: 'post not found' });
      }
      res.json({ comments: post.Comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }

  }

  filterCommentList = async (req, res) => {
    const { postId } = req.params;
    const { sort } = req.query;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      let comments = post.comments;
  
      switch (sort) {
        case "new":
          comments = comments.sort((a, b) => b.createdAt - a.createdAt);
          break;
        case "old":
          comments = comments.sort((a, b) => a.createdAt - b.createdAt);
          break;
        case "likes":
          comments = comments.sort((a, b) => b.reactions.likes - a.reactions.likes);
          break;
        case "reactions":
          comments = comments.sort((a, b) => b.reactions.count - a.reactions.count);
          break;
        default:
          break;
      }
  
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json(err);
    }
  }
//do poll 

doPoll = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { vote, userId } = req.body; // Assuming the request body contains the vote (either "yes" or "no")
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.Enabledpoll) {
      return res.status(400).json({ error: "Poll is not enabled for this post" });
    }

    // Check if the user has already voted
     const user = await UserRegistration.findById(userId);
     if (user.Poll === "yes") {
       return res.status(400).json({ error: "You have already liked this story" });
    }

    if (vote === "yes") {
      post.PollResults.yes++;
    } else if (vote === "no") {
      post.PollResults.no++;
    } else {
      return res.status(400).json({ error: "Invalid vote" });
    }

    await post.save();

    // Update user's poll status to "yes"
    user.Poll = "yes";
    await user.save();

    res.json({ message: "Poll results updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

getPollResult = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.ShowPollResults) {
      return res.status(400).json({ error: "Poll results are not visible for this post" });
    }

    const { PollResults, ...postWithoutPollResults } = post.toObject();
   

    res.json({ post: postWithoutPollResults, PollResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }


}

}
module.exports = new postController();