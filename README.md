
# Raw Query Strings Builder

An npm module to allows you to generate a raw query strings.


## Installation

Install raw-query-strings with npm

* Using npm
```bash
  npm install raw-query-strings
```
* Using yarn
```bash
  yarn add raw-query-strings
```
## Features

- Get One
```javascript
rawQuery.generateOne(query)
```
- Get Many
```javascript
rawQuery.generateMany(query)
```

## Usage/Examples

* Examples
```javascript
{
    select: ["*", "COUNT(p.*) AS post_count"],
    from: { source: 'user', as: 'u' },
    join: [
        {
            left_join: 'post', as: 'p', on: 'p.user_id = u.id'
        }
    ],
    where: [
        { and: 'id > 10' },
        { or: 'id <= 100'},
        { and: 'status is true' }
    ],
    group: ["u.id"],
    sort: [
        ["u.name", "asc"],
        ["u.createdAt", "asc"]
    ],
    limit: 50,
    offset: 0
}

```
* Query Class
```
select : String[]
from: From
join: Join[]
where: Where[]
group: String[]
sort: Array[][]
limit: Integer
offset: Integer
cursor: Cursor

From { source: String, as: String }
Join { [JoinTypes]: String, as: String, on: String }
Where { and: String } // for or statement { or: String }
Cursor { column: String, value: String/Integer, direction: [asc, desc] }

JoinTypes [ join, left_join, right_join, inner_join, full_join ]
```

```javascript
const rawQuery = require('raw-query-strings');

const query = {
    select: ['*'],
    from: { source: 'user', as: 'u' }
};

const getRawQuery = rawQuery.generateOne(query);
console.log(getRawQuery); // SELECT * FROM user AS u LIMIT 1
```
