const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { createBHash, generateUserId } = require("../services/bcryptService");

const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    mob: String,
    iso2: String,
    prImg: { type: mongoose.Schema.Types.ObjectId, ref: "files" },
    email: {
      type: String,
      validate: {
        validator: async function (email) {
          const user = await mongoose.model("user").findOne({
            email: { $eq: email },
            _id: { $ne: this._id },
            deletedAt: { $exists: false },
          });
          return !user;
        },
        message: "User with this email already exists.",
      },
      index: true,
    },
    countryCode: String,
    address: String,
    country: String,
    city: String,
    state: String,
    cLoc: [{
      country: String,
      state: String,
      city: String,
      updatedAt: Date
    }],
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "NOT_SPECIFIED"],
    },
    timeZone: String,
    dob: Date,
    authToken: String,
    password: String,
    roleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "role" }], //admin, user, publisher
    authOtp: String,
    loginOtp: String,
    // emailUpdateOtpTimer: {
    //   count: { type: String, default: "0" },
    //   updatedAt: { type: Date, default: Date.now },
    // },
    isVerify: { type: Boolean, default: false },
    loginToken: String,
    otpExpireOn: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
    },
    fcmTokens: [
      {
        deviceId: String,
        token: String,
      },
    ],
    // location: {
    //   type: {
    //     type: String,
    //     enum: ['Point'], // 'Point' for GeoJSON
    //     required: true,
    //   },
    //   coordinates: {
    //     type: [Number], // [longitude, latitude]
    //     required: true,
    //   },
    // },
    deletedAt: Date,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

schema.pre("save", async function (next) {
  if (this.password) {
    this.password = await createBHash(this.password);
  }
  if (!this.userId) {
    this.userId = await generateUserId();
  }
  // if (this.cCity) {
  //   this.cCity = this.cCity?.trim()?.replace(/\s+/g, '_').toUpperCase()
  // }
  // if (this.cState) {
  //   this.cState = this.cState?.trim()?.replace(/\s+/g, '_').toUpperCase()
  // }
  // if (this.cCountry) {
  //   this.cCountry = this.cCountry?.trim()?.replace(/\s+/g, '_').toUpperCase()
  // }
  next();
});

schema.pre(
  ["findOneAndUpdate", "findByIdAndUpdate", "findOne", "find", "updateOne"],
  function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
  }
);

schema.post("findOneAndUpdate", async function (doc) {
  if (doc && doc.firstName && doc.lastName) {
    const fullName = `${doc.firstName} ${doc.lastName}`;
    await mongoose
      .model("User")
      .updateMany(
        { cusId: doc._id, deletedAt: { $exists: false } },
        { $set: { username: fullName } }
      );
  }
});

schema.post(["findOneAndUpdate","updateOne","findByIdAndUpdate"], async function (result) {
  const relevantUserFields = new Set(["gender", "dob", "cLoc", "likeCat", "disLikeCat"]);
  let doc;
  const operation = this.op;

  // Get the updated document
  if (operation === 'findOneAndUpdate') {
    doc = result;
  } else if (operation === 'updateOne' && result.modifiedCount > 0) {
    doc = await this.model.findOne(this.getQuery());
  }

  if (!doc) return;

  // Check if any relevant fields were modified
  const update = this.getUpdate();
  const modifiedFields = new Set([
    ...Object.keys(update.$set || {}),
    ...Object.keys(update.$unset || {})
  ]);

  const hasRelevantChanges = Array.from(modifiedFields).some(field =>
    relevantUserFields.has(field)
  );

  if (hasRelevantChanges) {
    const { generateUserFeedForAds } = require("../services/adWisePrioScoreGenerationService");
    const { generateUserFeedForCoupons } = require("../services/couponWisePrioScoreGenerationService");
    
    // Regenerate feeds for this user specifically
    await Promise.all([
      generateUserFeedForAds({ userIdArr: [doc._id] }),
      generateUserFeedForCoupons({ userIdArr: [doc._id] })
    ]);
  }
});

// schema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
//   const update = this.getUpdate();

//   if (update.cCity) {
//     update.cCity = update.cCity?.trim()?.replace(/\s+/g, '_').toUpperCase();
//   }
//   if (update.cState) {
//     update.cState = update.cState?.trim()?.replace(/\s+/g, '_').toUpperCase();
//   }
//   if (update.cCountry) {
//     update.cCountry = update.cCountry?.trim()?.replace(/\s+/g, '_').toUpperCase();
//   }

//   this.setUpdate(update); // Make sure to apply the changes back to the update object
//   next();
// });

schema.index({ location: "2dsphere" });

schema.plugin(mongoosePaginate);

const User = mongoose.model("user", schema, "user");
module.exports = User;
