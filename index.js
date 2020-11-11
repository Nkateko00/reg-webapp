let express = require('express');//to create web apps
var exphbs = require('express-handlebars');//to render templates
const bodyParser = require('body-parser');//require body parser for htm functionality
const flash = require('express-flash');
const session = require('express-session');
const Reg = require("./registration");
const Routes = require('./routes')


const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://teko:teko123@localhost:5432/registration';
const pool = new Pool({
    connectionString
});

let app = express();
//instantiate 
const reg = Reg(pool)
const routes = Routes(reg)

//setup handlebars ,Body-parser and public
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({
    secret: ' express flash',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use(express.static('public'));//enable use css
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', routes.home) 
app.post('/reg_numbers', routes.addReg) 
app.get('/reg_numbers', routes.filterAll) 
app.get('/clear',routes.clear)


const PORT = process.env.PORT || 2009;

app.listen(PORT, function () {
    console.log('App starting on port :' + PORT);
});
