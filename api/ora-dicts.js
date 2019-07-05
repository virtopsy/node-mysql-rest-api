import express from "express";

const oracledb = require('oracledb');
import oradb from "../db/oradb";
import TableDML from "../domain/table-dml";

// import DivType from "../domain/div-type";
const router = express.Router();

router.get("/", (req, res, next) => {
    try {
        const sqlData = TableDML.getAllSQL(req);
        const options = {outFormat: oracledb.OBJECT};
        oradb.querysql(sqlData.sql, sqlData.binds, options, (err, data) => {
                if (!err) {
                    res.status(200).json({
                        success: true,
                        data: data.rows

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
});

router.put("/", (req, res, next) => {
    try {
        const sqlData = TableDML.getInsSQLString(req);
        const options = {
            autoCommit: true,
            outFormat: oracledb.OBJECT
        };
        oradb.querysql(sqlData.sql, sqlData.binds, options, (err, data) => {
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
});

router.post("/", (req, res, next) => {
    try {
        const sqlData = TableDML.getUpdSQLString(req);
        const options = {
            autoCommit: true,
            outFormat: oracledb.OBJECT
        };
        oradb.querysql(sqlData.sql, sqlData.binds, options, (err, data) => {
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
});

module.exports = router;