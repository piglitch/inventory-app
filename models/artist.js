const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const ArtistSchema = new Schema({
  name: { type: String, required: true, maxLength: 200 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }, 
});

ArtistSchema.virtual("url").get(function () {
  return `/catalog/artist/${this._id}`;
});

ArtistSchema.virtual("date_of_birth_formatted").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
});

ArtistSchema.virtual("date_of_death_formatted").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
});

ArtistSchema.virtual("date_of_birth_yyyy_mm_dd").get(function(){
  return DateTime.fromJSDate(this.date_of_birth).toISODate()
});

ArtistSchema.virtual("date_of_death_yyyy_mm_dd").get(function(){
  return DateTime.fromJSDate(this.date_of_death).toISODate()
});

module.exports = mongoose.model("Artist", ArtistSchema);