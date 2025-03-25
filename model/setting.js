const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const schema = new mongoose.Schema({
    name: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    deletedAt: { type: Date }
}, {
    timestamps: {
        createdAt: 'createdAt', updatedAt: 'updatedAt'
    }
})

schema.pre(['findOneAndUpdate', 'findByIdAndUpdate', 'findOne', 'find', 'updateOne'], async function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
});

schema.plugin(mongoosePaginate);

const Setting = mongoose.model('setting', schema, 'setting');
module.exports = Setting;