const { getFilterQuery } = require("./commonService")

const fetchAllDocs = async ({ model, query, options }) => {
    query = await getFilterQuery({ query });
    query.deletedAt = { $exists: false };
    return new Promise((resolve, reject) => {
        model.paginate(query, options, (err, data) => {
            if (err) reject(err);
            else resolve(data)
        });
    });
};

module.exports = {
    fetchAllDocs
}