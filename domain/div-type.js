import SqlPar from "../db/sql-par";
class DivType {

    constructor(code, name) {
        this.id=0;
        this.code=code;
        this.name=name;
    }

    getAddSQL() {
        console.log("this.div_type_name -> "+this.name);
        let result = new SqlPar(`INSERT INTO division_type(code, name) VALUES(?,?);`,
                                [`'${this.code}'`,`'${this.name}'`]);
        return result;
    }
    
    static getByIdSQL(id) {
        let result = new SqlPar (`SELECT * FROM division_type WHERE ID = ? ;`,
                                [`${id}`]);
        return result;
    }
    static deleteByIdSQL(id) {
        let result = new SqlPar (`DELETE FROM division_type WHERE ID = ? ;`,
                                 [`${id}`] );
        return result;
    }
    static getAllSQL() {
        let sql = `SELECT * FROM division_type`;
        let result = new SqlPar (`SELECT * FROM division_type;`,
            [] );
        return result;
    }
}

export default DivType;