const Mongoose = require("mongoose")
const adminSchema = new Mongoose.Schema({
  adminName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
})
const Admin = Mongoose.model("admin", adminSchema)
module.exports = Admin