import mysql from "mysql2";

const pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    port: '55555',
    user     : 'foo',
    password : 'bar',
    database : 'simpleapp',
    debug    : false,
    multipleStatements: true
});


function executeQuery(sql, callback) {
    pool.getConnection((err,connection) => {
        if(err) {
            console.log('error get connection');
            return callback(err, null);
        }
        // console.log('connection was get');
        console.log('sql.sql (database.js)->' + sql.sql);
        console.log('sql.par (database.js)->' + sql.par);
        // connection.execute (sql.sql, sql.par, function (error, results, fields) {
        connection.query (sql.sql, sql.par, function (error, results, fields) {
            if (error) {
                console.log('query error (database.js)-> ' + error);
                connection.rollback(function() {
                    // throw error;
                });
                return callback(error,null);
            }
            connection.commit(function(err) {
                if (err) {
                    console.log('error on commit (database.js) -> ' + err);
                    rollback(function() {
                        // throw err;
                    });
                }
                console.log('(database.js) Transaction Completed Successfully.');
                connection.release();
            });
            // console.log('no error');
            return callback(null, results);
        });
    });
}

function query(sql, callback) {
    executeQuery(sql,function(err, data) {
        if(err) {
            return callback(err, null);
        }
        callback(null, data);
    });
}

module.exports = {
    query: query
}