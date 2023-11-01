
# Raw Query Strings Builder

An npm module to allows you to generate a raw query strings.

## Latest Changes Log
- __1.0.5-1__: Remove Cursor clause option

## Installation

Install raw-query-strings with __npm__ :

```bash
  npm install raw-query-strings
```
## Features

- Get One : 
```javascript
rawQuery.generateOne(Query)
```
- Get Many : 
```javascript
rawQuery.generateMany(Query)
```

## Usage/Examples
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

From { source: String, as: String }
Join { [JoinTypes]: String, as: String, on: String }
Where { and: String } // for OR statement { or: String }

JoinTypes [ join, left_join, right_join, inner_join, full_join ]
```
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
* Examples
```javascript
const rawQuery = require('raw-query-strings');

const query = {
    select: ['*'],
    from: { source: 'user', as: 'u' }
};

const getRawQuery = rawQuery.generateOne(query);
console.log(getRawQuery); // SELECT * FROM user AS u LIMIT 1
```
