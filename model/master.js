const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const schema = new mongoose.Schema({
  name: String,
  code: {
    type: String, validate: {
      validator: async function (code) {
        const master = await mongoose.model("master").findOne({
          "code": { $exists: true, $eq: code },
          "_id": { $ne: this.id },
          "deletedAt": { $exists: false }
        });
        if (master) return this.id === master._id;
        return true;
      }, message: props => `This Master code already exists.`
    }
  },
  parentCode: String,
  isActive: {
    type: Boolean,
    default: true
  },
  deletedAt: Date
},
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.pre('save', function (next) {
  if (this.isModified('isActive') && !this.isActive) {
    this.isActive = true;
  }
  next();
});
schema.pre(['findOneAndUpdate', 'findByIdAndUpdate', 'findOne', 'find', 'updateOne'], async function (next) {
  this.getQuery().deletedAt = { $exists: false };
  next();
});

schema.plugin(mongoosePaginate);

const Master = mongoose.model("master", schema, "master");
module.exports = Master;