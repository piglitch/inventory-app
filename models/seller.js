const mongoose = require("mongoose");
const artist = require("./artist");
const artsPiece = require("./artPiece");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  name: { type: String, ref: "ArtPiece", required: true },
  address: { type: String, required: true },
  artists: [{ type: Schema.Types.ObjectId, ref: "Artist", required: true }],
});

sellerSchema.virtual("url").get(function(){
  return `/catalog/seller/${this._id}`;
});

module.exports = mongoose.model("Seller", sellerSchema);