const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
// slightly modified to use the pug home page
app.use('/', express.static('fitness', {index:['/']}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'students',
    password: 'myP4ssw0rd',
    database: 'fitness'
});

connection.connect((err) => {
    if(err){
        throw err;
    }
    console.log("mySQL connected");
});

app.get('/createdb', (req, res) => {
    let sql = "CREATE DATABASE fitness";
    connection.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        res.send("Database create!")
        console.log(result);
    });
});

app.get('/createplanstable', (req, res) => {
    let sql = 'CREATE TABLE plans (id INT AUTO_INCREMENT, link TEXT, image TEXT, alt_text TEXT, caption TEXT, PRIMARY KEY (id))';
    connection.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        res.send("Plans table created!")
        console.log(result);
    });
});

app.get('/createcontacttable', (req, res) => {
    let sql = 'CREATE TABLE contact (id INT AUTO_INCREMENT, name TEXT, email TEXT, question TEXT, PRIMARY KEY (id))';
    connection.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        res.send("Contact table created!")
        console.log(result);
    });
});

// Run this 3 times, replace the details in record with content from lines 75-77 to fully populate the table. You could also use phpMyAdmin to create the records
app.get('/addplanrecord', (req, res) => {
    let record = {caption:"Group Fitness", image:"images/fitness-group.jpg", link:"classes.html", alt_text:"group of fitness people"}
    let sql = 'INSERT INTO plans SET ?';
    connection.query(sql, record, (err, result) => {
        if(err){
            throw err;
        }
        res.send("Plan record created!")
        console.log(result);
    });
});

app.get('/contact', (req, res) => {
    res.type('text/html');
    res.render('contact', {title:"Forward Fitness Club | Contact Us"});
});

app.post('/submit', (req, res, next) => {
    let name = req.body.name;
    let email = req.body.email;
    let question = req.body.question;
    let sql = `INSERT INTO contact (name, email, question) VALUES ('${name}', '${email}', '${question}')`;
    connection.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        //res.send("Contact record created!");
        console.log(result.insertId);
        res.redirect('/contact');
    });
});

app.get('/', (req, res) => {
    res.type('text/html');
    connection.query('SELECT link, image, alt_text, caption FROM plans', (err, result, fields) => {
        console.log(result);
        if(err){
            console.log(err);
        }
        let plans = JSON.parse(JSON.stringify(result));
        /*let plans = [];
        for(var i = 0; i < result.length; i++) {
            let plan = {
                'link':result[i].link,
                'image':result[i].image,
                'alt_text':result[i].alt_text,
                'caption':result[i].caption
            }
            plans.push(plan);
        }*/
        console.log(plans);
        res.render('index', {title:"Forward Fitness Club", FitPlans:plans});
    });
});

app.set('view engine', 'pug');
app.set('views', './views');

/* From Lesson 7, replaced with call to database above
app.get('/', (req, res) => {
    res.type('text/html');
    const plans = ([
    {type:"Group Fitness", photo:"images/fitness-group.jpg", link:"classes.html", alt:"group of fitness people"},
    {type:"Meal Plans", photo:"images/food-heart.jpg", link:"nutrition.html", alt:"healthy food in the shape of a heart"},
    {type:"Start Today", photo:"images/personal-trainer.jpg", link:"contact.html", alt:"personal trainer with a clipboard"}
    ]);
    res.render('index', {title:"Forward Fitness Club", FitPlans:plans});
});*/

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});