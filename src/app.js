const express = require("express");
const cors = require('cors');

const app = express();

require('./database/asociations');

app.use(cors({
    origin: '*',
}));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ extended: true, limit: '50mb' }));

//Routes
app.use('/user', require('./routes/User.router'));
app.use('/product', require('./routes/Product.Router'));
app.use('/phase', require('./routes/Phase.Router'));
app.use('/barcode', require('./routes/Barcode.Router'));
app.use('/record', require('./routes/Register.Router'))
app.get('/', function(req, res) {
    res.send('Codes App running.');
});

module.exports = app;