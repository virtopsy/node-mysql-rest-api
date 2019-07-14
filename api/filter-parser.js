
class FilterBindValues {
    constructor(condition, variable ) {
        this.cond = '';
        this.arg = [];
        if (condition){
            this.cond = condition;
        }
        if (variable) {
                this.arg = this.arg.concat(variable);
        }
    }
}

const queryStringParser = require('./query_string_parser.js');

   function  getFilterObjAsBody(filter) {
// console.log('filter-parser.getFilterObjAsBody filter->' + JSON.stringify(filter));
    if (!filter || filter.length === 0) {return null;};
    let resultCondObj  = new FilterBindValues;
    let condObj = new FilterBindValues;
    for (let i=0; i < filter.length; i++) {
        console.log('filter-parser.getFilterObjAsBody i->' + i)
        let parsedFilter =  filter[i];
        if (parsedFilter.op) {
            condObj = null;
            try {
                condObj = CONDITIONS_FUNCTIONS[parsedFilter.op](parsedFilter);
            } catch (e) {
// console.log('filter-parser.getFilterObjAsBody e.name ->' + e.name  + ' - ' + e.message);
                if (e.name == 'TypeError') {
                    e.message = ('Не реализован метод ' + parsedFilter.op)
                    throw e;
                } else {
                    throw e;
                }
            }
            if (condObj) {
                resultCondObj.cond += condObj.cond;
                resultCondObj.arg = resultCondObj.arg.concat(condObj.arg);
            } ;
        };
    }
console.log('filter-parser.getFilterObjAsBody resultCondObj ->' + resultCondObj.cond);
    return resultCondObj;
}

   function getFilterObjAsPar(filter) {
    if (!filter) {return null;};

    let parsedFilter = queryStringParser.fromQuery(filter);
    if (!parsedFilter.op) {return null;};
    let condObj;
    try {
        condObj = CONDITIONS_FUNCTIONS[parsedFilter.op](parsedFilter);
    } catch (e) {
// console.log('e.name ->' + e.name );
        if (e.name == 'TypeError') {
            e.message = ('Не реализован метод ' + parsedFilter.op)
            throw e;
        } else {
            throw e;
        }
    }
    if (!condObj) { return null;} ;
    return condObj;
}

   function getFilterJSON(filter) {
    return JSON.stringify(getFilterObj(filter));
}

   function getSourceObj(objNmae) {
    return objNmae;

    let result;
    try {
        result = SOURCENAME_FUNCTION[objNmae]();
    } catch (e) {
        if (e.name == 'TypeError') {
            e.message = ('Не определен источник ' + objNmae)
            throw e;
        } else {
            throw e;
        }
    }
    // console.log(' getSourceObj.result->' + result + 'getSourceObj.->objNmae' + objNmae);
    return result;
}

const SOURCENAME_FUNCTION = {
    'divisionType'() {
        return 'division_type';
    }
    , 'division'() {
        return 'division';
    }

};

const CONDITIONS_FUNCTIONS = { // search method base on conditions list value
    // filter.type
    'empty'(filter) {
        return new FilterBindValues(` and ${filter.cell} is null `, []);
    }
    , 'notEmpty'(filter) {
        return new FilterBindValues(` and ${filter.cell} is not null `, []);
    }
    , 'equal'(filter) {
        console.log('filter.v1->' + [filter.v1]);
        return new FilterBindValues(` and ${filter.cell} = :a `, [filter.v1]);
    }
    , 'notEqual'(filter) {
        return new FilterBindValues(` and ${filter.cell} != :a `, [filter.v1]);
    }
    , 'lt'(filter) {
        return new FilterBindValues(` and ${filter.cell} < :a `, [filter.v1]);
    }
    , 'gt'(filter) {
        return new FilterBindValues(` and ${filter.cell} > :a `, [filter.v1]);
    }
    , 'lte'(filter) {
        return new FilterBindValues(` and ${filter.cell} <= :a `, [filter.v1]);
    }
    , 'gte'(filter) {
        return new FilterBindValues(` and ${filter.cell} >= :a `, [filter.v1]);
    }
    , 'like'(filter) {
        return new FilterBindValues(` and ${filter.cell} like :a `, [filter.v1]);
    }
    , 'notLike'(filter) {
        return new FilterBindValues(` and ${filter.cell} not like :a `, [filter.v1]);
    }
    , 'between'(filter) {
        return new FilterBindValues(` and ${filter.cell} between :a and :b `, [filter.v1, filter.v2]);
    }
    , 'notBetween'(filter) {
        return new FilterBindValues(` and ${filter.cell} not between :a and :b `, [filter.v1, filter.v2]);
    }
};

exports.getFilterObjAsPar = getFilterObjAsPar;
exports.getFilterJSON = getFilterJSON;
exports.getSourceObj = getSourceObj;
exports.getFilterObjAsBody = getFilterObjAsBody;
