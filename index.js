const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');
const session = require('express-session');
const redis = require('connect-redis').default;
const { createClient } = require('redis');
const { default: RedisStore } = require('connect-redis');
const redisClient = createClient({
    /*local host redis 
    url: 'rediss://red-ch4kn1e4dad97s4bb7dg:w9k24vpUPN8aPerUP7RjWDJDiAtCtez5@singapore-redis.render.com:6379'*/
    //web service host redis url
    url: 'redis://red-ch4kn1e4dad97s4bb7dg:6379'
});
redisClient.connect().catch(console.error);

//Cau hinh public static folder
app.use(express.static('public'));

//express-handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        createStarList,
        createPagination
    }
}));

// view engine setup
app.set('view engine', 'hbs');
//app.set('views', './views/partials')

//cau hinh doc du lieu post tu body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cau hinh su dung session
app.use(session({
    secret: 'S3cret',
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000 //20 minutes
    }
}));

//middleware khoi tao gio hang
app.use((req, res, next) => {
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity = req.session.cart.quantity;

    next();
});
// routes 
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productsRouter'));
app.use('/users', require('./routes/usersRouter'));

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
