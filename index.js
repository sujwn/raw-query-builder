const QueryGenerator = require("./QueryGenerator");
exports.generateOne = function (query) {
    const q = new QueryGenerator(query);

    console.log(q);
    return q.generateFirst();
}

exports.generateMany = function (query) {
    const q = new QueryGenerator(query);

    console.log(q);
    return q.generateMany();
}

exports.info = function() {
    console.log("Raw Query Builder version 1.0 by SSONG");
}

const x = this.generateMany({
    select: ['*'],
    from: {
        source: 'user'
    },
    where: [
        { and: 'id > 10' },
        { or: 'id <= 100'},
        { and: 'status is true' }
    ]
})
console.log(x)