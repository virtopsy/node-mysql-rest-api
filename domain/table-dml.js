import SqlPar from "../api/sql-par";
import FilterParser from '../api/filter-parser.js'

class TableDML {

    // constructor(code, name) {
    //     this.id=0;
    //     this.code=code;
    //     this.name=name;
    // }

    static getByIdSQL(id) {
        let result = new SqlPar(`SELECT * FROM division_type WHERE ID = ? ;`,
            [`${id}`]);
        return result;
    }

    static deleteByIdSQL(id) {
        let result = new SqlPar(`DELETE FROM division_type WHERE ID = ? ;`,
            [`${id}`]);
        return result;
    }

    static getUpdSQLString(req) {
        let dataObj =  req.body.dataObj;
        dataObj.name = FilterParser.getSourceObj(dataObj.name);
        const values = req.body.data;
// console.log(' req.query.insValues->' + JSON.stringify(values));
        let fields = '';
        let where = '';
        let binds = [];
        if ( dataObj.primaryKey.length === 0 || !dataObj.primaryKey ){
            throw 'update operation without PK';
        }
        // fields for update
        for (var key in values) {
            if ( !dataObj.primaryKey.includes(key) ){
                fields += ',' + key + '=:'+ key +' ';
                binds = binds.concat(values[[key]]);
            }
        }
        // primary key
        for (let i = 0; i < dataObj.primaryKey.length; i++) {
            where += 'and ' + dataObj.primaryKey[i] + ' = :' + dataObj.primaryKey[i] + ' '
            binds = binds.concat(values[dataObj.primaryKey[i]]);
        }

        let sql = 'Update ' + dataObj.name + ' set '+ fields.substring(1) +' where 1=1 ' + where;
        return {"sql": sql, "binds": binds};
    }

    static getInsSQLString(req) {
        let dataObj =  req.body.dataObj;
        dataObj.name = FilterParser.getSourceObj(dataObj.name);
        const values = req.body.data;
        let fields = '';
        let binds = [];
        // fields for insert
        for (var key in values) {
            if ( !dataObj.primaryKey.includes(key) || !dataObj.primaryKey ){
                fields += ',' + key +' ';
                binds = binds.concat(values[[key]]);
            }
        }
        // primary key
        if (dataObj.primaryKey) {
            for (let i = 0; i < dataObj.primaryKey.length; i++) {
                fields += ',' + dataObj.primaryKey[i] + ' ';
                binds = binds.concat(values[dataObj.primaryKey[i]]);
            }
        }

        let sql = 'Insert into ' + dataObj.name + ' ( ' + fields.substring(1) + ') values( ' + fields.replace(/,/g, ',:').substring(1) + ') ';
        return {"sql": sql, "binds": binds};
    }

    static getAllSQL(req) {
        const pageSize = req.query.pageSize || 100;
        const pageNunber = req.query.pageNumber || 0;
        let sortOrder = req.query.orderby || '1 asc';
        const fieldsPar =  req.query.fields.split(',');
        const objName = FilterParser.getSourceObj(req.query.objName);
        let binds = [];
        let fields='';
        // lowercase fields
        for (let i = 0; i < fieldsPar.length; i++) {
            fields += ',' + fieldsPar[i] +' "'+fieldsPar[i]+'" ';
        }
        let sql = 'SELECT '+ fields.substring(1) +' FROM ' + objName + '  WHERE 1 = 1 ';
        let filter = FilterParser.getFilterObj(req.query.filter || '');
        if (filter) {
            sql += filter.cond;
            binds = binds.concat(filter.arg);
        }
        // order by ${sortOrder}
        sql += ` OFFSET :offset ROWS FETCH NEXT :maxnumrows ROWS ONLY`;
        binds = binds.concat([pageSize * (pageNunber )
            , pageSize]);
        return {"sql": sql, "binds": binds};
    }
}

export default TableDML;