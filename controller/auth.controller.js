const UserRegistration = require('../model/user');
const OTP = require('../model/otp');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const moment = require('moment');

//const config = require("../config/config");


//const authentication = require("../middleware/auth.middleware");
generateGetstatedName = (username) => {
  const randomString = crypto.randomBytes(4).toString('hex');
  const GetstatedName = `${username}_${randomString}`;
  return GetstatedName;
}; 
const create_token = async (id) => {
  try {
 const token = await jwt.sign({_id: id},config.secret_jwt);
 return token;
  }catch(error) {
  res.status(400).send(error.message);
  }
}
const config = {
  secret_jwt: "thisissecretkey"
};
const registrationSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  dob: Joi.date().iso().required(),
  password: Joi.string().min(8).required(),
});
const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  
});

const changePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
  
});

const profileSchema = Joi.object({
  
  accountType: Joi.string().valid('personal', 'professional').required()
  
});

const   setupPersonalAccountSchema = Joi.object({
  _id: Joi.string().required(),
  displayName: Joi.string().required(),
  personalTemplate: Joi.string().uri().required()
});

const setupProfessionalAccountSchema = Joi.object({
  _id: Joi.string().required(),
  businessLogo: Joi.string().required(),
  businessName: Joi.string().required(),
  businessType: Joi.string().required(),
  personalTemplate: Joi.string().required(),
  
});
//649040c3a2eb1acbd41722fd
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDkwNDBjM2EyZWIxYWNiZDQxNzIyZmQiLCJpYXQiOjE2ODcxNzUzNjN9.452LBm6WahQJf8-X4iffAE2L6RQawOF53TqBfSnIveI
//Authorization
class  authController {
 
    //Register
    register = async (req, res) => {
      try {
        const { error, value } = registrationSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ error: "Invalid registration data. " + error.details[0].message });
        }
    
        const { username, email, dob, password } = value;
    
        const existingUser = await UserRegistration.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          if (existingUser.username === username) {
            return res.status(401).json({ error: "Username already exists. Please try with a different name." });
          }
          if (existingUser.email === email) {
            return res.status(401).json({ error: "User already exists with that email." });
          }
        }
    
        const newUser = await UserRegistration.create({
          username,
          email,
          dob,
          password
        });
    
        const tokenData = await create_token(newUser._id);
        const userResult = {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          dob: newUser.dob,
          token: tokenData,
        };
    
        const response = {
          userId: userResult._id,
          token: userResult.token,
        };
    
        return res.status(200).send(response);
      } catch (e) {
        return res
          .status(400)
          .json({ error: true, msg: "Something went wrong", meta: e.message });
      }
    };
    //get user details by using user id
    getUserDetailsById=async(req,res) =>{
      try {
        const userId = req.params.id; 
    
      
        const user = await UserRegistration.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Return the user details
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
  }

   //get all data
    userDetails=async(req,res) =>{
        try{
            const allData = await UserRegistration.find();
            return res.json(allData);  
           }
           catch(err){
            console.log(err.message);
           }
    }
    //sign in
     signIn = async (req, res) => {
      try {
        const { error } = signInSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
    
        const { email, password } = req.body;
        const user = await UserRegistration.findOne({ email });
        if (!user || user.password !== password) {
          return res.status(401).json({ message: 'User not found or invalid credentials' });
        }
        
        const tokenData = await create_token(user._id);
        const userResult = {
          _id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          token: tokenData
        };
    
        const response = {
          
          msg: "Sign in successful",
          data: userResult
        };
    
        return res.status(200).send(response);
      } catch (err) {
        console.log(err.message);
        return res.status(500).send('Internal Server Error');
      }
    }
    
    
  
      //change Password
      changePassword =async(req, res) => {
        try {
          const { error } = changePasswordSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ error: error.details[0].message });
          }
    
          const { email, password } = req.body;
          const user = await UserRegistration.findOne({ email });
          if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
          }
          user.password = password;
          await user.save();
          console.log(user.password);
          return res.json({ message: 'Password changed successfully' });
          
        } catch(err) {
          console.log(err.message);
          res.status(500).send('Internal Server Error');
        }
      }
      
      //user profile setup (personal or professional)
      profile = async (req, res) => {
        try {
          
      
          const { _id } = req.params;
          const { accountType } = req.body;
      
          const user = await UserRegistration.findById(_id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          if (accountType === 'personal' || accountType === 'professional') {
            user.accountType = accountType;
          } else {
            return res.status(400).json({ message: 'Invalid account type' });
          }
      
           await user.save();
          return res.json({ message: 'Profile updated successfully' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        }
      };
       
    //get GetstatedName
    getGetstatedName = async (req, res) => {
      try {
        const { _id } = req.params;
        const user = await UserRegistration.findById(_id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        if (user.GetstatedName) {
          return res.json({ GetstatedName: user.GetstatedName });
        }
        const uniqueName = generateGetstatedName(user.username);
        user.GetstatedName = uniqueName;
        await user.save();
        return res.json({ GetstatedName: uniqueName });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    
    
    
      
      //personal account setup
      setupPersonalAccount = async (req, res) => {
        try {
          
      
          const { _id, displayName } = req.body;
      
          const user = await UserRegistration.findOne({ _id });
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          if (user.accountType !== 'personal') {
            return res.status(403).json({ message: "Access denied" });
          }
      
          // Update personalTemplate with uploaded media file
          if (req.file) {
            user.personalTemplate = req.file.filename;
          }
      
          user.displayName = displayName;
      
          await user.save();
      
          return res.status(200).json({ message: 'Personal account set up successfully' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      }
      
     // professional account setup
     setupProfessionaAccount = async (req, res) => {
      try {
        // const { error } = setupProfessionalAccountSchema.validate(req.body);
        // if (error) {
        //   return res.status(400).json({ message: error.details[0].message });
        // }
    
        const { _id, businessName, businessType, template } = req.body;
    
        const user = await UserRegistration.findById(_id);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        if (user.accountType !== 'professional') {
          return res.status(403).json({ message: 'Access denied' });
        }
    
        // Update businessLogo with uploaded media file
        if (req.file) {
          user.businessLogo = req.file.filename;
        }
    
        user.businessName = businessName;
        user.businessType = businessType;
        user.personalTemplate = template;
    
        await user.save();
    
        return res.status(200).json({ message: 'Professional account set up successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
    
      
      //intrest list
      intrest = async (req, res) => {
  try {
    const keywords = req.query.search;
    let interests;

    if (keywords) {
      const regexKeywords = keywords.split(',').map(keyword => new RegExp(keyword.trim(), 'i'));

      interests = await UserRegistration.find({
        interestName: {
          $in: regexKeywords
        }
      }).select('interestName coverPic');
    } else {
      interests = await UserRegistration.find().select('interestName coverPic');
    }

    res.json(interests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}


      //choose intrest
      chooseIntrest = async (req, res) => {
        try {
          const { _id, interestName } = req.body;
      
          // Find the user by userId
          const user = await UserRegistration.findById(_id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Update the interest name
          user.interestName = interestName;
          await user.save();
      
          res.json({ message: 'Interest name updated successfully', user });
        } catch (error) {
          console.log(error);
          res.status(500).send('Internal Server Error');
        }
};

// emailSend = async (req, res) => {
//   let data = await UserRegistration.findOne({ email: req.body.email });
//   const responseType = {};
//   if(data){
//     let otpcode = Math.floor((Math.random() *10000)+1);
//     let otpData = new OTP({
//       email:req.body.email,
//       code:otpcode,
//       expiresIn: new Date().getTime()+300*1000

//     })
//     let otpResponse = await otpData.save();
//     responseType.statusText = 'Success'
//     responseType.message = 'please check your email id'
//   } else {
//     responseType.statusText = 'error'
//     responseType.message = 'email id not exist';
//   }
//   res.status(200).json(responseType);
// }

//mailer = 




}

module.exports = new authController();