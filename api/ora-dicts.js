import express from "express";
const oracledb = require('oracledb');
import oradb from "../db/oradb";

// import DivType from "../domain/div-type";

const router = express.Router();

router.get("/", (req, res, next) => {
    let pageSize = req.query.pageSize || 100;
    let pageNunber = req.query.pageNumber || 0;
    let sortOrder = req.query.orderby ||'1 asc';
    let filter =   req.query.filter || '';
    let sql = `SELECT * FROM division_type 
               WHERE 1 = 1
               ${filter}
               order by ${sortOrder}
               OFFSET :offset ROWS FETCH NEXT :maxnumrows ROWS ONLY`;
    let binds = [ pageSize * (pageNunber )
                 ,pageSize ];
    let options = { outFormat: oracledb.OBJECT };
    oradb.querysql( sql, binds, options, (err, data)=> {
        if(!err) {
            res.status(200).json({
                data: data.rows

            });
        } else {
            res.status(200).json({
                err: err
            });
        }
    }
    );
});


module.exports = router;