const PersonalPersona = require("../model/personal_persona");
class messageController {
  
    createPersonalPersona = async (req, res) => {
        try {
          // Extract the fields from the request body
          const { name, Bio, sort_message, photo_image } = req.body;
      
          // Create a new personal persona instance
          const personalPersona = new PersonalPersona({
            name,
            Bio,
            sort_message,
            photo_image,
          });
      
          // Save the personal persona to the database
          const savedPersona = await personalPersona.save();
      
          res.json(savedPersona);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
        }
      };
}
module.exports = new messageController();