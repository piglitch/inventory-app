const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const artPieceSchema = new Schema({
  name: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  description: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  image: { data: Buffer, contentType: String }
})

artPieceSchema.virtual("url").get(function () {
  return `/catalog/artpiece/${this._id}`;
})

module.exports = mongoose.model("ArtPiece", artPieceSchema);