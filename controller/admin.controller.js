const Admin = require('../model/admin');
const UserRegistration = require('../model/user');
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";
const story = require("../model/Story");
const Post = require("../model/post");
const Conversation = require("../model/Conversation");
class adminController  {
//admin can register himself on admin panel
    adminRegister = async (req, res) => {
        const { adminName, password } = req.body
        if (password.length < 6) {
          return res.status(400).json({ message: "Password less than 6 characters" })
        }
        try {
          await Admin.create({
            adminName,
            password,
          }).then(user =>
            res.status(200).json({
              message: "User successfully created",
              user,
            })
          )
        } catch (err) {
          res.status(401).json({
            message: "User not successful created",
            error: err.message,
          })
        }
      }
//admin details 
      adminDetails=async(req,res) =>{
        try{
            const allData = await Admin.find();
            return res.json(allData);  
           }
           catch(err){
            console.log(err.message);
           }
        }

  //admin panel signin
    adminSignIn = async (req, res) => {
  
      try {
        const { adminName, password } = req.body;
        const admin = await Admin.findOne({ adminName });
    
        if (!admin) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
    
        if (admin.password !== password) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        return res.status(200).json({ message: "Logged in successfully" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
}


     //get all user data in admin panel

     userDetailsInAdmin=async(req,res) =>{
      try{
          const allData = await UserRegistration.find();
          return res.json(allData);  
         }
         catch(err){
          console.log(err.message);
         }
  }

//admin can access personal accounts
adminUserPersonalAccountView = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserRegistration.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.accountType !== 'personal') {
      return res.status(403).json({ message: "Access denied" });
    }

    const stats = {
      followers: user.Followers,
      following: user.Followings,
      hirable: user.Hirable,
      rating: user.Rating,
      accountstatus: user.AccountStatus
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
 //admin can see bussiness account
 adminUserBussinessAccountView = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserRegistration.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.accountType !== 'professional') {
      return res.status(403).json({ message: "Access denied" });
    }

    const stats = {
      followers: user.Followers,
      following: user.Followings,
      hirable: user.Hirable,
      rating: user.Rating,
      accountstatus: user.AccountStatus,
      reviews: user.Reviews,
      jobcreated: user.Jobcreated,
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
//admin can access user story
  adminViewStory = async (req, res) => {
    try {
      // Find the user's story by userId
      console.log(req.params.userId,"view story");
      const Story = await story.find({ userId: req.params.userId })
        // .populate("Comments.userId", "username")
        // .populate("Likes", "username")
        // .select("Likes Comments");
    //  Only send back the comments and likes
    console.log(Story);
    // res.json({ Likes: story.Likes, Comments: story.Comments });
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
//admin can access user post

  adminViewPost = async (req, res) => {
    const { _id } = req.body;
      try {
      const post = await Post.findById({_id});
  
      if (!post) {
        return res.status(404).json({ message: "post not found" });
      }

      const stats = {
        likes: post.Likes,
        poll: post.Poll,
        votes: post.Votes,//comments
       // comments: post.Comments,//AccountStatus
        
        };
  
      return res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  }

  //admin can see user intrest
  adminViewIntrest = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await UserRegistration.findById({userId});
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } 
      const stats = {
        InterestName: user.interestName,
        };
  
      return res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  };
//admin can access chat
  adminViewchat = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await Conversation.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } 
      const stats = {
        Members: user.members,
        };
  
      return res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  };
}
module.exports = new adminController();