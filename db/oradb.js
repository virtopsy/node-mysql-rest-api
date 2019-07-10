const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

async function init() {
    try {
        // Create a connection pool which will later be accessed via the
        // pool cache as the 'default' pool.
        await oracledb.createPool({
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString
            // edition: 'ORA$BASE', // used for Edition Based Redefintion
            // events: false, // whether to handle Oracle Database FAN and RLB events or support CQN
            // externalAuth: false, // whether connections should be established using External Authentication
            // homogeneous: true, // all connections in the pool have the same credentials
            // poolAlias: 'default', // set an alias to allow access to the pool via a name.
            // poolIncrement: 1, // only grow the pool by one connection at a time
            // poolMax: 4, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
            // poolMin: 0, // start with no connections; let the pool shrink completely
            // poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
            // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
            // queueTimeout: 60000, // terminate getConnection() calls in the queue longer than 60000 milliseconds
            // sessionCallback: myFunction, // function invoked for brand new connections or by a connection tag mismatch
            // stmtCacheSize: 30 // number of statements that are cached in the statement cache of each connection
        });
        console.log('Connection pool started');

        // Now the pool is running, it can be used
        // await dostuff();

    } catch (err) {
        console.error('init() error: ' + err.message);
    } finally {
        // await closePoolAndExit();
        console.log('Connection pool started');
    }
}

async function querySql(sql, binds, options, callback) {
    let connection;
    try {
console.log('oradb.querysql sql -> '+ sql);
console.log('oradb.querysql binds ->' + binds);
        // Get a connection from the default pool
        connection = await oracledb.getConnection();
        let result = await connection.execute(sql, binds, options);
console.log('oradb.querysql result->' + JSON.stringify(result));
        return callback(null, result);
    } catch (err) {
        console.error(err);
        return callback(err, null);
    } finally {
        if (connection) {
            try {
                // Put the connection back in the pool
                await connection.close();
            } catch (err) {
                console.error(err);
                return callback(err, null);
            }
        }
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        // Get the pool from the pool cache and close it when no
        // connections are in use, or force it closed after 10 seconds
        // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file
        await oracledb.getPool().close(10);
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);

init();

module.exports = {
    querySql: querySql
}

