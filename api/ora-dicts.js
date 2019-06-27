import express from "express";

const oracledb = require('oracledb');
import oradb from "../db/oradb";
import FilterParser from './filter-parser.js'

// import DivType from "../domain/div-type";
const router = express.Router();
let binds;
let sql;

router.get("/", (req, res, next) => {
    try {
        let pageSize = req.query.pageSize || 100;
        let pageNunber = req.query.pageNumber || 0;
        let sortOrder = req.query.orderby || '1 asc';
// console.log('req.query>' + JSON.stringify(req.query));
        let objName = FilterParser.getSourceObj(req.query.objName);
        binds = [];
        sql = 'SELECT * FROM ' + objName + '  WHERE 1 = 1 ';
        let filter = FilterParser.getFilterObj(req.query.filter || '');
        if (filter) {
            sql += filter.cond;
            binds = binds.concat(filter.arg);
        }
        // order by ${sortOrder}
        sql += ` OFFSET :offset ROWS FETCH NEXT :maxnumrows ROWS ONLY`;
        binds = binds.concat([pageSize * (pageNunber )
            , pageSize]);
        let options = {outFormat: oracledb.OBJECT};
        oradb.querysql(sql, binds, options, (err, data) => {
                if (!err) {
                    res.status(200).json({
                        success: true,
                        data: data.rows

                    });
                } else {
                    console.log('oradb.querysql ERROR');
                    res.status(500).json({
                        errormsg: err.message
                    });
                }
            }
        );
    } catch (e) {
        console.log('catch (e)');
        res.status(500).json({
            errormsg: e.message
        })
    }

});

module.exports = router;