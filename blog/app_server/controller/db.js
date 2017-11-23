var sqlite3 = require('sqlite3')

var sqdb = new sqlite3.Database('public/databases/shunyi.db', function (err) {
    console.log(err);
});

module.exports = sqdb