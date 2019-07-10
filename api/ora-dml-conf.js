const oracledb = require('oracledb');
import oradb from "../db/oradb";
import TableDML from "../domain/table-dml";

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