const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connect successfully");
  //error handler for connect  
  } catch (error) {
    console.error("MongoDB connect error", error);
    process.exit(1);
  }
};

module.exports = connectDB;