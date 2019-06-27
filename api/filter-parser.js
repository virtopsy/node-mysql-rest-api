const queryStringParser = require('./query_string_parser.js');

function getFilterObj(filter) {
    if (!filter) { return null; };
    let parsedFilter = queryStringParser.fromQuery(filter);
    if (!parsedFilter.op) {return null; } ;
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
    if (!condObj) {
        return null;
    }
    ;
    return condObj;
}

function getFilterJSON(filter) {
    return JSON.stringify(getFilterObj(filter));
}

function getSourceObj(objNmae) {
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
    console.log(' getSourceObj.result->' + result + 'getSourceObj.->objNmae' + objNmae);
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
        return {'cond': ` and ${filter.cell} is null `, arg: []};
    }
    , 'notEmpty'(filter) {
        return {'cond': ` and ${filter.cell} is not null `, arg: []};
    }
    , 'equal'(filter) {
        console.log('filter.v1->' + filter.v1);
        return {'cond': ` and ${filter.cell} = :a `, arg: [filter.v1]}
    }
    , 'notEqual'(filter) {
        return {'cond': ` and ${filter.cell} != :a `, arg: [filter.v1]}
    }
    , 'lt'(filter) {
        return {'cond': ` and ${filter.cell} < :a `, arg: [filter.v1]}
    }
    , 'gt'(filter) {
        return {'cond': ` and ${filter.cell} > :a `, arg: [filter.v1]}
    }
    , 'lte'(filter) {
        return {'cond': ` and ${filter.cell} <= :a `, arg: [filter.v1]}
    }
    , 'gte'(filter) {
        return {'cond': ` and ${filter.cell} >= :a `, arg: [filter.v1]}
    }
    , 'like'(filter) {
        return {'cond': ` and ${filter.cell} like :a `, arg: [filter.v1]}
    }
    , 'notLike'(filter) {
        return {'cond': ` and ${filter.cell} not like :a `, arg: [filter.v1]}
    }
    , 'between'(filter) {
        return {'cond': ` and ${filter.cell} between :a and :b `, arg: [filter.v1]}
    }
    , 'notBetween'(filter) {
        return {'cond': ` and ${filter.cell} not between :a and :b  `, arg: [filter.v1]}
    }
};

exports.getFilterObj = getFilterObj;
exports.getFilterJSON = getFilterJSON;
exports.getSourceObj = getSourceObj;
