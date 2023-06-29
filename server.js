require('dotenv').config();
const express = require('express');
 const app = express();
const http = require('http').createServer(app);// Create an HTTP server instance
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
//const config = require("../config/config");


const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes');
const conversationRoute = require('./routes/conversation.routes');
const messageRoute = require('./routes/messages.routes');
const chat_settingRoute = require('./routes/chat_setting.routes');
const storyRoute = require('./routes/story.rotues');
const adminRoute = require('./routes/admin.routes');
const otpRoutes = require('./routes/otpRoutes');

mongoose.connect("mongodb+srv://Emagz:EmagzWorldWide@cluster0.gzd8yd0.mongodb.net/?retryWrites=true&w=majority").then(
  () => console.log('db is connected..')
).catch(err => console.log(err));
//MONGO_URI = mongodb+srv://roshankumarsinghbhumca21:ROSHAN@cluster0.jug58hc.mongodb.net/?retryWrites=true&w=majority

// middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/chat_setting", chat_settingRoute);
app.use("/api/story", storyRoute);
app.use("/api/admin", adminRoute);
app.use('/api/otp', otpRoutes);



// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



