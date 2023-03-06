const express = require('express');
const expressHandlebars = require('express-handlebars');
const port = process.env.PORT || 5000;
const app = express()

app.use(express.static('public'));

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

// routes 
app.use('/', require('./routes/indexRouter'));

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'File not Found!' });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error' });
});

//start web server
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
