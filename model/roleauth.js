const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const schema = new mongoose.Schema({
    roleId: {
        type: String,
    },
    permissionId: {
        type: String,
    },
    description: String,
    uri: String
})

schema.plugin(mongoosePaginate);

const Roleauth = mongoose.model("roleauth", schema, "roleauth");
module.exports = Roleauth;