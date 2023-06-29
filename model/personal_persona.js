const mongoose = require("mongoose");

const personal_personaSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
      },

      Bio: {
        type: String,
        required: true,
      },
      sort_message: {
        type: String,
        required: true,
      },
      photo_image: {
        type: String,
        required: true,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", personal_personaSchema);
