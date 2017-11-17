var express = require('express');
var app =  require('express')();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var multer = require('multer');
var upload = multer();
var path = require("path");
var User = require(__dirname + '/Model/users');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var io = require('socket.io')(http);
mongoose.connect('mongodb://localhost:27017/ticky');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
app.use(session({
    secret : 'ticky',
    resave: true,
    saveUninitialized:false,
    store: new MongoStore({
        mongooseConnection:db
    })
}));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.locals.currentUser = req.session.userId;
    next();
});
app.use(bodyParser.urlencoded({extended:true}));
app.use(upload.array());
app.set('view engine', 'pug');
app.set('views', './static/views');
app.use(express.static(path.join(__dirname, "/static")));
app.get("/", function(req, res){
    res.render('index.pug')
});
app.get("/developers", function(req, res){
    res.render("developer.pug");
});
app.post("/login", function(req, res, next){
    if(req.body.user && req.body.email && req.body.password){
        var userData ={
            email:req.body.email,
            username: req.body.user,
            password:req.body.password,
            Won: 0,
            Lost: 0,
            image: "https://www.google.com.ng/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiWl9CrnMDXAhXILyYKHXlqCVgQjRwIBw&url=https%3A%2F%2Fpixabay.com%2Fen%2Favatar-male-boy-character-1606916%2F&psig=AOvVaw0YZ8cNeLstN_i4toCzbixc&ust=1510822975985867",
            level: "Amateur"
        };
        User.authenticate(req.body.email, req.body.password, function(error, user){
            if(error){
                var err = new Error("Wrong email or password");
                err.status = 401;
                return next(err);
            }else if(!user){
                User.create(userData, function(error, user){
                    if(error){
                        req.session.userId = user._id;
                        return res.redirect('/home');
                    }
                    else{
                        req.session.userId = user._id;
                        return res.redirect('/home');
                    }
        });
            }
            else{
                req.session.userId = user._id;
                res.redirect('/home');
            }
        })
    }else{
        var err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }

});
var arr = [];
var name;
app.get('/home', function(req, res){ 
    
    User.findOne({_id: req.session.userId}, 'username Won Lost image level', function(err, user){
        if(err){
            var err = new Error("Wrong email or password");
            err.status = 401;
            return next(err);
        }else{
            name = user.username;
            res.render("home.pug", {name: user.username, level: user.level, image:user.image, won : user.Won, lost: user.Lost});
        }
    
});
});
io.on('connection', function(socket){
    socket.id = name;
    arr.unshift(name);
    for(var i = 0; i<arr.length; i++){
    if(arr[1] == ""){
        socket.emit('chat', "No one is online");
        break;
    }
    else{
    socket.emit('chat', arr[i]);
}
    }

    //Get the name of disconnected users and pop it out of arr
socket.on('disconnect', function(){
    for(var i = 0; i<arr.length; i++){
        if(arr[i]==socket.id){
        arr = arr.filter(function(word){
            return word != arr[i];
        });
        }
    }
});
} );
http.listen(8080);