const express = require('express');
const app = express();

app.use('/', express.static('fitness'));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.type('text/html');
    const plans = ([
    {type:"Group Fitness", photo:"images/fitness-group.jpg", link:"classes.html", alt:"group of fitness people"},
    {type:"Meal Plans", photo:"images/food-heart.jpg", link:"nutrition.html", alt:"healthy food in the shape of a heart"},
    {type:"Start Today", photo:"images/personal-trainer.jpg", link:"contact.html", alt:"personal trainer with a clipboard"}
    ]);
    res.render('index', {title:"Forward Fitness Club", FitPlans:plans});
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});