const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: String,
    required: true,//cpassword
  },
  password: {
    type: String,
    required: true,
  },
  GetstatedName: {
    type: String

  },
  accountType: {
    type: String,
    enum: ['personal', 'professional'],
    default: 'personal'
  },
  displayName: {
    type: String
  },
  personalTemplate:{
    type: String
  },
  businessLogo: {
    type: String
  },
  businessName: {
    type: String
  },
  businessType: {
    type: String
  },
  interestName: {
    type: [String],
    default: 'No Interest name'
    },
  coverPic: {
    type: String
  },
  search: [{
    interest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interest'
    }
  }],
  	Followers:{
      type: String,
      default: '0'
  },
  	Followings:{
      type: String,
      default: '0'
    },
    	Hirable:{
      type: String,
      default: 'NO'
    },
    	Rating:{
      type: String,
      default: 'No Rating'
      
    },
    	Reviews:{
      type: String,
      default: 'No Review'//o	Job created 
      
    },
    Poll:{
      type: String,
      default: 'No'
    },
    Jobcreated:{
      type: String,
      default: 'No job'//o	Job created 
      
    },
    	AccountStatus:{
        type: String,
        default: 'Active'
      },
}, {
  timestamps: true
});


module.exports = mongoose.model('UserRegistration', userSchema);



