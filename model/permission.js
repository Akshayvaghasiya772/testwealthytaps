const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const schema = new mongoose.Schema({
    uri: {
        type: String,
        required: true
    },
    method: String,
    module: {
        type: String,
        required: true
    },
    description: {                             //"added in descriptor"
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

schema.plugin(mongoosePaginate);
const Permission = mongoose.model("permission", schema, "permission");
module.exports = Permission;