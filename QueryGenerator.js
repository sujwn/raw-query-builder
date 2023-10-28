class QueryGenerator {
    constructor(query) {
        if (!query) throw new Error('Invalid input: Query is missing.');
        if (!query.select) {
            throw new Error('Invalid input: SELECT statement is missing.');
        } else {
            if (!isArrayOfString(query.select)) throw new Error('Invalid SELECT statement value.');
        }

        if (!query.from) {
            throw new Error('Invalid input: FROM statement is missing.');
        } else {
            const isFrom = isFromStatement(query.from);
            if (!isFrom) throw new Error('Invalid FROM statement value.');
            query.from = isFrom;
        }

        if (query.join) {
            if (!isJoinStatement(query.join)) throw new Error('Invalid JOIN statement value.');
        }

        if (query.where) {
            if (!isWhereStatement(query.where)) throw new Error('Invalid WHERE statement value.')
        }

        if (query.sort) {
            if (!isSortStatement(query.sort)) throw new Error('Invalid ORDER BY statement value.');
        }

        if (query.group) {
            if (!isArrayOfString(query.group)) throw new Error('Invalid GROUP BY statement value.');
        }

        if (query.limit) {
            if (!isNumber(query.limit)) throw new Error('Invalid LIMIT statement value.');
        }

        if (query.offset) {
            if (!isNumber(query.offset)) throw new Error('Invalid OFFSET statement value.');
        }

        if (query.cursor) {
            const cursor = isCursor(query.cursor);
            if (cursor) throw new Error('Invalid CURSOR statement value.');
            query.cursor = cursor;
        }

        this.query = query;
    }

    generateMany() {
        const query = this.query;
        const q = {};

        if (query.cursor) {
            switch (query.cursor.direction) {
                case 'DESC':
                case 'desc':
                    query.where.push(`${query.cursor.column} < '${query.cursor.value}'`)
                    break;
                case 'ASC':
                case 'asc':
                default:
                    query.where.push(`${query.cursor.column} > '${query.cursor.value}'`)
                    break;

            }
            query.sort = [[`${query.cursor.column}`, `${query.cursor.direction}`]];
        }
        q.select = query.select && query.select.length > 0 ? `SELECT ${query.select.join(', ')}` : `SELECT ${query.from.as}.*`;
        q.from = `FROM ${query.from.source} AS ${query.from.as}`;
        q.join = query.join && query.join.length > 0 ? query.join.map(function (joinObj) {
            return joinType(joinObj.type) + ' ' + joinObj.source + ' AS ' + joinObj.as + ' ON ' + joinObj.on;
        }).join(' ') : undefined;
        q.where = `WHERE true`;
        if (query.where && query.where.length > 0) {
            q.where += ' ' + query.where.map(function (condition) {
                const operator = Object.keys(condition)[0];
                const expression = condition[operator];
    
                return `${operator.toUpperCase()} ${expression}`;
            }).join(' ');
        }
        q.group = query.group && query.group.length > 0 ? `GROUP BY ${query.group.join(`, `)}` : undefined;
        q.sort = query.sort && query.sort.length > 0 ? `ORDER BY ${query.sort.map(s => s.join(' ')).join(', ')}` : undefined;
        q.limit = query.limit ? `LIMIT ${query.limit}` : undefined;
        q.offset = query.offset ? `OFFSET ${query.offset}` : undefined;

        return `${Object.values(q).join(' ')}`;
    }

    generateFirst() {
        const query = this.query;
        const q = {};
        
        q.select = query.select && query.select.length > 0 ? `SELECT ${query.select.join(', ')}` : `SELECT ${query.from.as}.*`;
        q.from = `FROM ${query.from.source} AS ${query.from.as}`;
        q.join = query.join && query.join.length > 0 ? query.join.map(function (joinObj) {
            return joinType(joinObj.type) + ' ' + joinObj.source + ' AS ' + joinObj.as + ' ON ' + joinObj.on;
        }).join(' ') : undefined;
        q.where = `WHERE true`;
        if (query.where && query.where.length > 0) {
            q.where += ' ' + query.where.map(function (condition) {
                const operator = Object.keys(condition)[0];
                const expression = condition[operator];
    
                return `${operator.toUpperCase()} ${expression}`;
            }).join(' ');
        }
        q.group = query.group && query.group.length > 0 ? `GROUP BY ${query.group.join(`, `)}` : undefined;
        q.sort = query.sort && query.sort.length > 0 ? `ORDER BY ${query.sort.map(s => s.join(' ')).join(', ')}` : undefined;
        q.limit = 'LIMIT 1';

        return `${Object.values(q).join(' ')}`;
    }
}

const joinType = function (value) {
    switch (value) {
        case "INNER_JOIN": return "INNER JOIN";
        case "LEFT_JOIN": return "LEFT JOIN";
        case "RIGHT_JOIN": return "RIGHT JOIN";
        case "FULL_JOIN": return "FULL JOIN";
        default: return "JOIN";
    }
}

const isArrayOfString = function (param) {
    if (Array.isArray(param)) {
        return param.every(item => typeof item === 'string');
    }
    return false;
}

const isArrayOfArrayOfString = function (param) {
    if (Array.isArray(param)) {
        return param.every(subArray => Array.isArray(subArray) && subArray.every(item => typeof item === 'string'))
    }
    return false;
}

const isFromStatement = function (param) {
    if (!param.source) return false;
    if (!param.as) param.as = param.source;

    return param;
}

const isJoinStatement = function (param) {
    if (Array.isArray(param)) {
        return param.every(item => typeof item === 'object' && 'source' in item && 'as' in item && 'on' in item);
    }
    return false;
}

const isWhereStatement = function (param) {
    if (Array.isArray(param)) {
        return param.every(item => typeof item === 'object' && ('and' in item || 'or' in item));
    }
    return false;
}

const isSortStatement = function (param) {
    if (Array.isArray(param)) {
        return param.every(subArray => Array.isArray(subArray) && subArray.length === 2 && subArray.every(item => typeof item === 'string' && isSortDirection(subArray[1])));
    }
    return false;
}

const isSortDirection = function (value) {
    const dir = ['asc', 'ASC', 'desc', 'DESC'];

    return dir.includes(value);
}

const isNumber = function (param) {
    return typeof (param) === 'number';
}

const parseCursor = function (param) {
    if (typeof (param) === 'number') return parseInt(param);
    else if (typeof (param) === 'string') return param;
    else false;
}

const isCursor = function (cursor) {
    if (!cursor.column) {
        return false;
    }
    if (cursor.value) {
        cursor.value = parseCursor(cursor.value);
        if (!cursor.value) return false;
    } else {
        return false;
    }

    if (cursor.direction && !isSortDirection(cursor.direction)) {
        return false;
    } else {
        cursor.direction = 'asc';
    }

    return cursor;
}

module.exports = QueryGenerator;