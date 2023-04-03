const Barcode = require('./models/Barcode');
const Phase = require('./models/Phase');
const Product = require('./models/Product');
const User = require('./models/User');
const Records = require('./models/Records');

//Foreign Key
//User
User.hasMany(Records);
Records.belongsTo(User);

//Product
Product.hasMany(Records);
Records.belongsTo(Product);

//Phase
Phase.hasMany(Records);
Records.belongsTo(Phase);

//Barcode
Barcode.hasOne(Records);
Records.belongsTo(Barcode);

