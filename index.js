const express = require('express');
const expressHandlebars = require('express-handlebars');
const port = process.env.PORT || 5000;
const app = express()

app.use(express.static( 'public'));

//express-handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout'
}));

// view engine setup
app.set('view engine', 'hbs');
//app.set('views', './views/partials')

//routes
app.get('/createTables',(req,res)=>{
    let models = require('./models');
    models.sequelize.sync().then (()=>{
        res.send('A new table has been created')
    })
});
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/:page', (req, res) => {
    res.render(req.params.page);
})

//start web server
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
