// const router = require("express").Router();
const express = require("express");
const router = express();
const bodyParser = require("body-parser")
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const postController = require('../controller/post.controller');
const multer = require('multer');
const path = require('path');
router.use (express.static('public'));
const authentication = require("../middleware/auth.middleware");

const storage =multer.diskStorage({
    destination:function(req, file,cb){
        cb(null,path.join(__dirname,'../public/postMedia'),function(error,success){
            if(error) throw error;
        })
    },
    filename:function(req,file,cb){
       const name = Date.now()+'-'+file.originalname;
       cb(null, name, function(error1,success1){
        if(error1) throw error1;
       })
    }
});


const upload = multer({storage:storage});

//create a post
router.post("/",upload.single('mediaUrl'),authentication,postController.createPost);

//Get Post List of following user
router.get("/following/",authentication,postController.getPostListFollowingUser);

////user can get link of media url
router.get("/mediaUrl/",authentication,postController.getPostMediaUrlLink);

//Like post
router.post("/:_id/likeANDunlike",authentication,postController.likePost);


//Add comment to a post
router.post("/:_id/comment",authentication,postController.addCommentPost );

//Get comment list
router.get("/:_id/getcomments",authentication,postController.getCommentList);

//Filter comment list
router.get("/:postId/comments",authentication,postController.filterCommentList );


//do poll in yes and no
router.post("/:postId/Poll",authentication, postController.doPoll);

//
router.get("/:postId/PollResults",authentication,postController.getPollResult);



module.exports = router;