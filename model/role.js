const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        validate: {
            validator: async (code) => {
                const existingDoc = await mongoose.model("role").findOne({
                    code: { $eq: code },
                    _id: { $ne: this._id },
                    "deletedAt": { $exists: false }
                });
                if (existingDoc) return existingDoc._id === this._id;
                return true;
            },
            message: props => "This role already exists."
        },
        unique: true,
        required: true,
    },
    deletedAt: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publisher'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publisher'
    }
}, {
    timestamps: true
});

schema.virtual('permission', {
    ref: 'roleauth',
    localField: '_id',
    foreignField: 'roleId'
})

schema.plugin(mongoosePaginate);
const Role = mongoose.model("role", schema, "role");

module.exports = Role;