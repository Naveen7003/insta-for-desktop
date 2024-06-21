var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const localStrategy = require('passport-local');
const passport = require('passport');
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()))

router.get('/', function(req,res, next){
  res.render('login');
})

router.get('/register', function(req,res, next){
  res.render('register');
})

router.post('/register', function (req, res) {
  const {email, fullname, username } = req.body;
  const userData = new userModel({email, fullname, username  });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })
});

router.get('/login', (req, res, next)=>{
  res.render('login');
})

router.post('/login', passport.authenticate('local',{
  successRedirect: "/profile",
  failureRedirect : "/login",
}))

router.get('/profile', isLoggedIn, async (req, res, next)=>{
  const user = await userModel.findOne({ username : req.session.passport.user}).populate("posts")
  res.render('profile',{user});
})

router.get('/home', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user})
  const allUser = await userModel.find({});
  const posts = await postModel.find().populate("user");
  res.render('home', {posts, user, allUser});
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/logout', (req, res , next)=>{
  res.redirect('/');
})

router.post('/update',upload.single('image'), async function(req, res){
  const user = await userModel.findOneAndUpdate({username: req.session.passport.user},     //is line se hume wo user milte hai jo loggedIn hai
     { username: req.body.username, fullname:req.body.fullname, Bio:req.body.Bio},         //is line me wo chize di hai jo  update krni hai
      {new:true});                                                                         // is line ka mtlb hai ki update ki hui cheez purani jaisi nhi honi chajiye

      if(req.file){                                                                        //if isliye lagaya hai ki agar image ke alawa kuch aur update krna hai to wo bhi hoh jaye
        user.profileImage = req.file.filename;                                             //is line se user ki profile image update hogi
      }
      await user.save()                                                                    //jab bhi database ka kaam karenge async await lagega

      res.redirect('/profile');
})

router.get('/edit', isLoggedIn, async function(req, res , next){
 const user = await userModel.findOne({ username : req.session.passport.user})
  res.render('edit', {user});
})

router.get('/create', isLoggedIn, async function(req, res , next){
   res.render('upload');
 })

router.get('/username/:username', isLoggedIn, async function(req, res ){
  const regex = new RegExp(`^${req.params.username}`, 'i'); 
  const users = await userModel.find({username : regex});
  res.json(users);
})

router.get('/like/post/:id', isLoggedIn, async function(req, res) {
  const user= await userModel.findOne({username : req.session.passport.user})
  const post= await postModel.findOne({_id: req.params.id});


  if(post.likes.indexOf(user._id) === -1){
    post.likes.push(user._id);
  }
  else{
    post.likes.splice(post.likes.indexOf(user._id), 1);
  }
  await post.save()
  res.redirect('/home');
})


 //niche wale code se post create karenge
 router.post('/create', isLoggedIn, upload.single("image"), async function(req, res){            //upload.single se image upload ho jayegi
  const user = await userModel.findOne({ username : req.session.passport.user});
  const post = await postModel.create({
    picture: req.file.filename,                           //isse picture milegi
    user: user._id,                                       // isse userid milegi
    caption: req.body.caption,                             //isse caption milega    par abhi tak sirf user mila hai
  })
    user.posts.push(post._id);                             //is line se user ko pata chalega ki post usi ki hai ya kisi aur ki
    await user.save();
    res.redirect('/home');
 })

 router.get('/explore',isLoggedIn, async (req, res)=>{
  const user = await userModel.findOne({ username: req.session.passport.user})
  const posts = await postModel.find()
  res.render('explore', {posts, user});
 })

 router.get('/suggested',async (req, res, next)=>{
  const user = await userModel.findOne({ username: req.session.passport.user})
  const allUser = await userModel.find({});
  res.render('suggested.ejs',{user, allUser});
})

module.exports = router;
