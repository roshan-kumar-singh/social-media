//const router = require("express").Router();
const express = require("express");
const router = express();
const bodyParser = require("body-parser")
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const storyController = require('../controller/story.controller');
const multer = require('multer');
const path = require('path');
router.use (express.static('public'));
const authentication = require("../middleware/auth.middleware");
const storage =multer.diskStorage({
    destination:function(req, file,cb){
        cb(null,path.join(__dirname,'../public/storyMedia'),function(error,success){
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

//add story
router.post('/',upload.single('mediaUrl'),authentication, storyController.addStory)

//Get Story List of following user
router.get('/stories',authentication,storyController.getStoryListFollowingUser);

//Like story
router.post("/:_id/like", authentication,storyController.likeStory);

// comment story
router.post('/comment/:_id',authentication, storyController.commentStory);

//comment on comment
router.post('/comment', authentication, storyController.commentOnComment);


//Get comment list
router.get('/get-comments/:_id',authentication,storyController.getCommentList);

//Filter Comment List
router.get("/stories/filter",authentication, storyController.filterCommentList);

//add react to comment
router.post('/stories/:storyId/comments/:commentId/react', authentication,storyController.addReactComment);

//like story comment
router.post("/stories/like",authentication, storyController.likeComment);


