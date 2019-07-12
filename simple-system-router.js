import express from "express";
import {getCellsConf, getObjDesc, dmlDelete, dmlPut, dmlPost, dmlGet, dmlGetAsPut} from "./api/ora-dml-conf";

const ssRouter = express.Router();

ssRouter
    .delete("/dml/:id", dmlDelete)

ssRouter
    .get("/dml/obj-desc", getObjDesc)
    .get("/dml/conf",     getCellsConf)
    .get("/dml",          dmlGet)

ssRouter
    .put("/dml/get", dmlGetAsPut)
    .put("/dml", dmlPut)

ssRouter
    .post("/dml", dmlPost)

module.exports = ssRouter;