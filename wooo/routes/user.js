
/*
 * GET users listing.
 */


exports.getNewConnection = function()
{
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'Pacobengy10',
        database : 'whoo'
    });
    return connection;
};

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.findById = function (id, fn) {
    var connection = this.getNewConnection();
    connection.connect();
    var query = "SELECT * FROM users WHERE id=" + connection.escape(id);
    connection.query(query, function selectPlayers(err, result, fields) {

        if (err) {
            console.log("Error: " + err.message);
            throw err;
        }
        console.log("Number of rows: " + result.length);
        console.log(result);

        for (var i = 0, len = result.length; i < len; i++) {
            var user = result[i];
            if (user.id === id) {
                connection.end();
                return fn(null, user);
            }
        }
        connection.end();
        fn(new Error('User ' + id + ' does not exist'));

    });
   // fn(new Error('User ' + id + ' does not exist'));
    /*var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }*/
}

exports.findByUsername = function (username, fn) {

    var connection = this.getNewConnection();

    connection.connect();

    /*connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows[0].solution);
    });*/

    connection.query(
        'SELECT * FROM users WHERE username =' + connection.escape(username),
        function selectPlayers(err, results, fields) {
            if (err) {
                connection.end();
                console.log("Error: " + err.message);
                throw err;
            }
            console.log("Number of rows: " + results.length);
            console.log(results);

            for (var i = 0, len = results.length; i < len; i++) {
                var user = results[i];
                if (user.username === username) {
                    connection.end();
                    return fn(null, user);
                }
            }

            connection.end();
            return fn(null, null);


        });

    /*    for (var i = 0, len = users.length; i < len; i++) {
     var user = users[i];
     if (user.username === username) {
     return fn(null, user);
     }
     }
     return fn(null, null);*/
}
