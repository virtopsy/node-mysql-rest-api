const oracledb = require('oracledb');
import oradb from "../db/oradb";
import TableDML from "../domain/table-dml";


function dmlGet (req, res, next){
    try {
        const sqlData = TableDML.getAllSql(req);
        const options = {outFormat: oracledb.OBJECT};
        oradb.querySql(sqlData.sql, sqlData.binds, options, (err, data) => {
                if (!err) {
                    res.status(200).json({
                        success: true,
                        data: data

                    });
                } else {
                    console.log('ora-dict.router.get ERROR');
                    res.status(500).json({
                        errormsg: err.message
                    });
                }
            }
        );
    } catch (e) {
        console.log('ora-dict.router.get catch (e)');
        res.status(500).json({
            errormsg: e.message
        })
    }
}

function dmlGetAsPut (req, res, next){
    try {
        const sqlData = TableDML.getAllSqlAsPut(req);
        const options = {outFormat: oracledb.OBJECT};
        oradb.querySql(sqlData.sql, sqlData.binds, options, (err, data) => {
                if (!err) {
                    res.status(200).json({
                        success: true,
                        data: data

                    });
                } else {
                    console.log('ora-dict.router.get ERROR');
                    res.status(500).json({
                        errormsg: err.message
                    });
                }
            }
        );
    } catch (e) {
        console.log('ora-dict.router.get catch (e)');
        res.status(500).json({
            errormsg: e.message
        })
    }
}

function dmlPut (req, res, next) {
    try {
        const sqlData = TableDML.getInsSQLString(req);
        const options = {
            autoCommit: true,
            outFormat: oracledb.OBJECT
        };
        oradb.querySql(sqlData.sql, sqlData.binds, options, (err, data) => {
                if (!err) {
                    res.status(200).json({
                        success: true,
                        data: data
                    });
                } else {
                    console.log('ora-dict.router.put ERROR');
                    res.status(500).json({
                        errormsg: err.message
                    });
                }
            }
        );
    } catch (e) {
        console.log('ora-dict.router.put catch (e)');
        res.status(500).json({
            errormsg: e.message
        })
    }
}

function dmlPost (req, res, next) {
    try {
        const sqlData = TableDML.getUpdSQLString(req);
        const options = {
            autoCommit: true,
            outFormat: oracledb.OBJECT
        };
        oradb.querySql(sqlData.sql, sqlData.binds, options, (err, data) => {
                if (!err) {
                    res.status(200).json({
                        success: true,
                        data: data
                    });
                } else {
                    console.log('ora-dict.router.post ERROR');
                    res.status(500).json({
                        errormsg: err.message
                    });
                }
            }
        );
    } catch (e) {
        console.log('ora-dict.router.post catch (e)');
        res.status(500).json({
            errormsg: e.message
        })
    }
}

function dmlDelete (req, res, next) {
    try {
        const sqlData = TableDML.delByIdSQL(req);
        const options = {
            outFormat: oracledb.OBJECT,
            autoCommit: true
        };
        oradb.querySql(sqlData.sql, sqlData.binds, options, (err, data) => {
                if (!err) {
                    res.status(200).json({
                        success: true,
                        data: data

                    });
                } else {
                    console.log('ora-dict.router.delete ERROR');
                    res.status(500).json({
                        errormsg: err.message
                    });
                }
            }
        );
    } catch (e) {
        console.log('ora-dict.router.delete catch (e)');
        res.status(500).json({
            errormsg: e.message
        })
    }
}

function getCellsConf(req, res, next) {
        try {
            const sqlData = TableDML.getCellsConf(req);
            const options = {outFormat: oracledb.OBJECT};
            oradb.querySql(sqlData.sql, sqlData.binds, options, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            success: true,
                            data: data

                        });
                    } else {
                        console.log('ora-dml-config.getCellsConf.get ERROR');
                        res.status(500).json({
                            errormsg: err.message
                        });
                    }
                }
            );
        } catch (e) {
            console.log('ora-dml-config.getCellsConf.get catch (e)');
            res.status(500).json({
                errormsg: e.message
            })
        }
    }

function getObjDesc(req, res, next) {
    try {
        const sqlData = TableDML.getObjDesc(req);
        const options = {outFormat: oracledb.OBJECT};
        oradb.querySql(sqlData.sql, sqlData.binds, options, (err, data) => {
                if (!err) {
                    res.status(200).json({
                        success: true,
                        data: data

                    });
                } else {
                    console.log('ora-dml-config.getObjDesc.get ERROR');
                    res.status(500).json({
                        errormsg: err.message
                    });
                }
            }
        );
    } catch (e) {
        console.log('ora-dml-config.getObjDesc.get catch (e)');
        res.status(500).json({
            errormsg: e.message
        })
    }
}

exports.getCellsConf = getCellsConf;
exports.getObjDesc = getObjDesc;
exports.dmlDelete = dmlDelete;
exports.dmlPut = dmlPut;
exports.dmlPost = dmlPost;
exports.dmlGet = dmlGet;
exports.dmlGetAsPut =dmlGetAsPut;