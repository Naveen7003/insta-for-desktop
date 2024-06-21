const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const path = require('path');  //ye package file ko extension dene ke liye liya hai

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      const unique = uuidv4();    //isline ki wajah se ek unique name milta hai
      cb(null, unique + path.extname(file.originalname)); //file ko extension dene ke liye
    }
  })

  const upload = multer({ storage: storage })
  module.exports = upload;