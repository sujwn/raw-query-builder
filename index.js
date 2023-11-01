const QueryGenerator = require("./QueryGenerator");
exports.generateOne = function (query) {
    const q = new QueryGenerator(query);

    console.log(q);
    return q.generateFirst();
}

exports.generateMany = function (query) {
    const q = new QueryGenerator(query);

    console.log(q.query);
    return q.generateMany();
}

exports.info = function () {
    console.log("Raw Query Builder version 1.0 by SSONG");
}

const q = {
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

this.generateMany(q)