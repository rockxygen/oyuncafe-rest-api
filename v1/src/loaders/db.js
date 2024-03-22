const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'oyuncafe',
    port: '8889'
});

const dbConnect = async () => {
    await connection.connect((err) => {
        if (err) {
            console.error('Error database connecting: ' + err.stack);
            return;
        }
        
        console.log('Database connected as ID :', connection.threadId);
    });
}

module.exports = {
    dbConnect,
    connection
};