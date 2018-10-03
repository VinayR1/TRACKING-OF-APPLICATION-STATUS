var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user'),
mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(require('express-session')({
  secret: "sun rises in the east",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

var Schema = mongoose.Schema;


var studentSchema = new Schema({
    hallticket:  String,
    status: String,
    applicationType:   String,
    remarks: String,
    Date: String
}
);





    var Student = mongoose.model('Student_schema',studentSchema);

app.get("/admin", isLoggedIn,function(req, res){

        res.render("admin");
  }
);

 // app.get("/cleardb",function(req,res){
 //  mongoose.connection.db.dropDatabase('app', function(err, result) {
 //      if(err)
 //        console.log(err);
 //         else
 //         res.send(result);
 //    });
 //  });



app.post("/add",isLoggedIn, function(req, res){
    

    var hallticket = req.body.idno;
    var status = req.body.status;
    var applicationType = req.body.applicationType;
    var remarks = req.body.remarks;
    var date=req.body.Date;
     
    var newStudent= {hallticket: hallticket, status: status, applicationType: applicationType,remarks: remarks, Date: date}

    
    Student.create(newStudent,function (err, member) {
       if(err){
         console.log(err);
       }
       else {
         res.send("added Successfully");
             
       }
     });
   });

   app.get("/status",function(req, res){

    res.render("status");
}
);

app.post("/status", function(req, res){
	Student.find({'hallticket':req.body.idnum,'applicationType':req.body.applicationType,'Date':req.body.Date}, function(err, member){

		if(err){
			console.log(err);
		} else {
            console.log(member);
			res.render("status", {students: member[0]});
        }
	});
});

 app.get("/admin/status",isLoggedIn,function(req, res){

     res.render("adminstatus");
 }
 );

app.post("/admin/status",isLoggedIn, function(req, res){
	Student.find({'hallticket':req.body.idnum,'applicationType':req.body.applicationType,'Date':req.body.Date}, function(err, member){

		if(err){
			console.log(err);
		} else {
           
			res.render("adminstatus", {students: member[0]});
        }
	});
});

// _id: 5b2262a34c60041f44cec51c



app.get("/admin/edit/:id", isLoggedIn,function(req, res){
	Student.findOne({'_id':req.params.id}, function(err, member){

		if(err){
			console.log(err);
		} else {
            
            res.render("adminedit", {students: member});
        }
            });
			
        }

);


app.put("/admin/update/:id", isLoggedIn,function(req, res){

    

	Student.findByIdAndUpdate(req.params.id,req.body.student, function(err, updated){

		if(err){
			console.log(err);
		} else {
            console.log(req.body.student);
			res.send("updated");
        }
	});
});


app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: "/admin",
  failureRedirect: "/login"
}), function (req, res) {

});


app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}






app.get('/register', function (req, res) {
  res.render('register');
});


app.post('/register', function (req, res) {
  var newUser = new User({ username: req.body.username }); // Note password NOT in new User
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/admin');
      });
    }
  });
});



app.listen(3000, process.env.IP, function(){
    console.log("server started.......");
})
