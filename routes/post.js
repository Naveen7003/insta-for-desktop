const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  picture: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  date: {
    type: Date,
    default: Date.now
  },
  caption: String,
  likes: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
    }
  ]
})

module.exports= mongoose.model("post", postSchema);

