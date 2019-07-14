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

    static delByIdSQL(req) {
        let binds = [];
        const primKeyName = req.query.prKey;
        const objName = FilterParser.getSourceObj(req.query.objName);
        let sql = 'DELETE FROM '+ objName +' WHERE ' + primKeyName + ' = :' + primKeyName;
        binds = binds.concat(req.params.id);
        return {"sql": sql, "binds": binds};
    }

    static getUpdSQLString(req) {
        let dataObj = req.body.dataObj;
        dataObj.name = FilterParser.getSourceObj(dataObj.name);
        const values = req.body.data;
// console.log(' req.query.insValues->' + JSON.stringify(values));
        let fields = '';
        let where = '';
        let binds = [];
        if (dataObj.primaryKey.length === 0 || !dataObj.primaryKey) {
            throw 'update operation without PK';
        }
        // fields for update
        for (var key in values) {
            if (!dataObj.primaryKey.includes(key)) {
                fields += ',' + key + '=:' + key + ' ';
                binds = binds.concat(values[[key]]);
            }
        }
        // primary key
        for (let i = 0; i < dataObj.primaryKey.length; i++) {
            where += 'and ' + dataObj.primaryKey[i] + ' = :' + dataObj.primaryKey[i] + ' '
            binds = binds.concat(values[dataObj.primaryKey[i]]);
        }

        let sql = 'Update ' + dataObj.name + ' set ' + fields.substring(1) + ' where 1=1 ' + where;
        return {"sql": sql, "binds": binds};
    }

    static getInsSQLString(req) {
        let dataObj = req.body.dataObj;
        dataObj.name = FilterParser.getSourceObj(dataObj.name);
        const values = req.body.data;
        let fields = '';
        let binds = [];
        // fields for insert
        for (var key in values) {
            if (!dataObj.primaryKey.includes(key) || !dataObj.primaryKey) {
                fields += ',' + key + ' ';
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

    static getAllSqlAsPut(req) {
// console.log('table-dml.getAllSqlAsPut body->' + JSON.stringify(req.body));
        const pageSize = req.body.pageSize || 100;
        const pageNunber = req.body.pageNumber || 0;
        // sorting
        let sortCond = '';
        if (req.body.sortOrder) {
            const sortOrder = (req.body.sortOrder || '').split(',');
            for (let i = 0; i < sortOrder.length; i++) {
                sortCond += ', ' + sortOrder[i].substring(1) + ' ' + ((sortOrder[i].charAt(0) === '-') ? 'asc' : 'desc' )
            }
            sortCond = ' order by ' + sortCond.substring(1);
        }
        const fieldsPar = req.body.fields.split(',');
        const objName = FilterParser.getSourceObj(req.body.objName);
        let binds = [];
        let fields = '';
        // lowercase fields
        for (let i = 0; i < fieldsPar.length; i++) {
            fields += ',' + fieldsPar[i] + ' "' + fieldsPar[i] + '" ';
        }
        let sql = 'SELECT ' + fields.substring(1) + ' FROM ' + objName + '  WHERE 1 = 1 ';
        if (!req.body.filter || !(req.body.filter.length === 0)) {
// console.log(' table-dml.getAllSqlAsPut req.body.filter->' + JSON.stringify(req.body.filter));
            let filter = FilterParser.getFilterObjAsBody(req.body.filter);
// console.log(' table-dml.getAllSqlAsPut filter->' + filter.cond);
            if (filter){
                sql += filter.cond;
                binds = binds.concat(filter.arg);
            }
        }
        // order by ${sortOrder}
        sql += sortCond + ' OFFSET :offset ROWS FETCH NEXT :maxnumrows ROWS ONLY';
        binds = binds.concat([pageSize * (pageNunber )
            , pageSize]);
        return {"sql": sql, "binds": binds};
    }

    static getAllSql(req) {
        const pageSize = req.query.pageSize || 100;
        const pageNunber = req.query.pageNumber || 0;
        // sorting
        let sortCond = '';
        if (req.query.sortOrder.length > 0 ) {
            const sortOrder = (req.query.sortOrder || '').split(',');
            for (let i = 0; i < sortOrder.length; i++) {
                sortCond += ', ' + sortOrder[i].substring(1) + ' ' + ((sortOrder[i].charAt(0) === '-') ? 'asc' : 'desc' )
            }
            sortCond = ' order by ' + sortCond.substring(1);
        }
        const fieldsPar = req.query.fields.split(',');
        const objName = FilterParser.getSourceObj(req.query.objName);
        let binds = [];
        let fields = '';
        // lowercase fields
        for (let i = 0; i < fieldsPar.length; i++) {
            fields += ',' + fieldsPar[i] + ' "' + fieldsPar[i] + '" ';
        }
        let sql = 'SELECT ' + fields.substring(1) + ' FROM ' + objName + '  WHERE 1 = 1 ';
console.log('table-dml.getAllSQL filter->' + req.query.filter);
        let filter = FilterParser.getFilterObjAsPar(req.query.filter || '');
        if (filter) {
            sql += filter.cond;
            binds = binds.concat(filter.arg);
        }
        // order by ${sortOrder}
        sql += sortCond + ' OFFSET :offset ROWS FETCH NEXT :maxnumrows ROWS ONLY';
        binds = binds.concat([pageSize * (pageNunber )
            , pageSize]);
        return {"sql": sql, "binds": binds};
    }

    static getCellsConf (req) {
        let binds = [req.query.objName];
        // binds = binds.concat(dataObjName);
        let sql = `select  lower(tc.COLUMN_NAME)    as "name"
       ,null              as "desc"
       ,lower(tc.DATA_TYPE)      as "datatype"
       ,tc.DATA_LENGTH    as "dataLength"   
       ,tc.DATA_PRECISION as "dataPrecision"
       ,tc.DATA_SCALE     as "dataScale"    
       ,tc.DATA_DEFAULT   as "dataDefault"  
  from all_tab_cols tc
        where tc.TABLE_NAME = upper(:dataObjName)`
        return {sql: sql, binds: binds};
    }

    static getObjDesc(req) {
        let binds = [req.query.objName];
        let sql = ` SELECT lower(cols.table_name) as "name"
      ,lower(cols.column_name) as "primaryKey"
      ,(select lower(o.OBJECT_NAME)
          from obj o
         where o.OBJECT_TYPE = 'SEQUENCE'
           and o.OBJECT_NAME = upper(cols.table_name ||'_SEQ')) as  "seqName"
  FROM all_constraints cons
      ,all_cons_columns cols
 WHERE cols.table_name = upper(:dataObjName)
   AND cons.constraint_type = 'P'
   AND cons.constraint_name = cols.constraint_name
   AND cons.owner = cols.owner
 ORDER BY cols.table_name, cols.position`
        return {sql: sql, binds: binds};
    }

}

export default TableDML;