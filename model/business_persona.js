const mongoose = require("mongoose");

const business_personaSchema = new mongoose.Schema(
  {
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", business_personaSchema);
