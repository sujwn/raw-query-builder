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