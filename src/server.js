const http = require("http");
const sequelize = require("./database/db");

require("dotenv").config();

const app = require('./app');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

function startServer() {

    server.listen(PORT, () => {
        console.log(`Listening on Port ${PORT}...`);

        //conect database
        sequelize.sync({ force: false }).then(() => {
            console.log("Connect database!")
        }).catch(err => {
            console.log(err)
        })
    });
}

startServer();