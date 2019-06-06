import mysql from "mysql2";

const pool = mysql.createPool({
            connectionLimit : 10,
            host     : 'localhost',
            port: '55555',
            user     : 'foo',
            password : 'bar',
            database : 'simpleapp',
            debug    : false 
            });                    

function executeQuery(sql, callback) {
    pool.getConnection((err,connection) => {
        if(err) {
            console.log('error get connection');
            return callback(err, null);
        }
            console.log('connection was get');
        console.log('sql.sql ->' + sql.sql);
        console.log('sql.par ->' + sql.par);
            // connection.query(sql, function (error, results, fields) {
            connection.execute(sql.sql, sql.par, function (error, results, fields) {
                if (error) {
                    connection.rollback(function() {
                        throw error;
                        // console.log('connection.query -> ' + error);
                    });
                }
                connection.commit(function(err) {
                    if (err) {
                         rollback(function() {
                             throw err;
                         });
                    }
                    console.log('Transaction Completed Successfully.');
                    connection.release();
                });
                return callback(null, results);
            });
    });
}

function query(sql, callback) {    
    executeQuery(sql,function(err, data) {
        if(err) {
            return callback(err);
        }
        callback(null, data);
    });
}

module.exports = {
    query: query
}