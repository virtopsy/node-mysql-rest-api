import mysql from "mysql";

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
            return callback(err, null);
        } else {
            if(connection) {
                connection.query(sql, function (error, results, fields) {
                connection.release();
                if (error) {
                    return callback(error, null);
                } 
                return callback(null, results);
                });
            }
        }
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