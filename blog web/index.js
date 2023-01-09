const express = require('express');
const session = require("express-session")
const path = require('path');
const bodyParser = require('body-parser');
const public = path.join(__dirname, '/public')
const app = express();
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { application } = require('express');
const exp = require('constants');
app.use(express.json());

//connection of models form static admin
const User = require('./models/User')

//Database connection
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://salonid:91VwfCs9vAOsnhtn@cluster0.8fqg85l.mongodb.net/website", () => {
    console.log('database connected');
})

//folder which allows to access external css
app.use(express.static(public));
app.use(express.static("uploads"));

// parse requests to body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//setup view engine
app.set('view engine', 'ejs');

//session message 
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}))

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//All Category page
app.get('/category', (req, res) => {
    res.render('Category');
})

//create category page
app.get('/createcat', (req, res) => {
    res.render('Createcat');
})

//edit category page
app.get('/editcat', (req, res) => {
    res.render('Editcat');
})




//login page for static admin
app.get('/login', (req, res) => {
    console.log(req.query);
    User.find().exec((err, user) => {
        console.log("user", user);
        if (user[0].email === req.query.email && user[0].password === req.query.password) {
            res.redirect('/admin')
        } else {

            res.render('Login')
        }
    })
})
app.post('/create', (req, res) => {
    console.log("req", req);
})
//Blogs page
app.get('/blog', (req, res) => {
    res.render('Blog');
})



//routes
app.use("/", require("./routes/Category"))
app.use("/", require("./routes/Blogs"))


// server has started
app.listen(5000)