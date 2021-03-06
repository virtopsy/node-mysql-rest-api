import express from "express";
import db from "../db/database";
import DivType from "../domain/div-type";

const router = express.Router();

router.get("/", (req, res, next) => {
    db.query(DivType.getAllSQL(req.query.pageSize, req.query.pageNo), (err, data)=> {
        if(!err) {
            res.status(200).json({
                data: data[0], response_info: data[1]

            });
        } else {
            res.status(200).json({
                err: err
            });
        }
    });
});

router.post("/add", (req, res, next) => {
    console.log("req.body.prd_price "+req.body.name);
    //read product information from request
    let divtype = new DivType(req.body.code, req.body.name);
    db.query(divtype.getAddSQL(), (err, data)=> {
        res.status(200).json({
            data: data[0]
        });
    });
});

router.get("/:productId", (req, res, next) => {
    let pid = req.params.productId;
    db.query(DivType.getByIdSQL(pid), (err, data)=> {
        if(!err) {
            if(data && data.length > 0) {

                res.status(200).json({
                    data: data[0]
                });
            } else {
                res.status(200).json({
                    message:"DivType Not found."
                });
            }
        }
    });
});

router.post("/delete", (req, res, next) => {

    var pid = req.body.productId;

    db.query(DivType.deleteByIdSQL(pid), (err, data)=> {
        if(!err) {
            if(data && data.affectedRows > 0) {
                res.status(200).json({
                    message:`DivType deleted with id = ${pid}.`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message:"DivType Not found."
                });
            }
        }
    });
});

module.exports = router;