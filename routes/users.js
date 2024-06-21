const mongoose = require('mongoose');
const passport = require("passport");
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/instaclone');

const userSchema = mongoose.Schema({
  username : {
    type: String,
  },
  fullname: {
    type : String,
  },
  email:{
    type: String,
  },
  password: {
    type: String,
  },
  profileImage: {
    type:String,
    default:"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
  },
  posts: [{type: mongoose.Schema.Types.ObjectId, ref:"post"}],

  Bio: String,
})

userSchema.plugin(plm);
module.exports= mongoose.model("user", userSchema);

