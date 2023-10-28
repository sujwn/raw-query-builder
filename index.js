const QueryGenerator = require("./QueryGenerator");
exports.generateOne = function (query) {
    const q = new QueryGenerator(query);

    console.log("QueryGenerator", JSON.stringify(q));
    return q.generateFirst();
}

exports.generateMany = function (query) {
    const q = new QueryGenerator(query);

    console.log("QueryGenerator", JSON.stringify(q));
    return q.generateMany();
}

exports.info = function () {
    console.log("Raw Query Builder version 1.0 by SSONG");
}

const a = this.generateOne({
    select: ["*"], from: { source: "user" },
    join: [
        { left_join: "posts", as: "p", on: "p.user_id = u.id" },
        { right_join: "address", as: "a", on: "a.user_id = u.id" },
        { join: "address", as: "a", on: "a.user_id = u.id" }
    ]
});