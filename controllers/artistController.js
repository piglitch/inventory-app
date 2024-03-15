const expressAsyncHandler = require("express-async-handler");
const Artist = require("../models/artist");
const ArtPiece = require("../models/artPiece");
const { body, validationResult } = require("express-validator")

// This is to display all the Artists in the database.
exports.artist_list = expressAsyncHandler(async (req, res, next) => {
  const allArtists = await Artist.find().sort({ name: 1 }).exec();
  res.render("artist_list", {
    title: "Artists",
    artist_list: allArtists,
  })
});

// This is to display the details of a specific Artist.
exports.artist_detail = expressAsyncHandler(async (req, res, next) => {
  const [artist, allArtPiecesByArtist]  = await Promise.all([
    Artist.findById(req.params.id).exec(),
    ArtPiece.find({ artist: req.params.id }, 'name description').exec(),
  ]);
  if (artist === null) {
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }
  res.render("artist_detail", {
    title: "Artist details",
    artist: artist,
    artPieces: allArtPiecesByArtist,
  });
});

// Display Artist create form on GET
exports.artist_create_get = (req, res, next) => {
  res.render("artist_form", { title: "Create artist"});
} 

// Handle Artist create on POST
exports.artist_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify a name for the art piece"),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")  
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const artist = new Artist({
      name: req.body.name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    if (!errors.isEmpty()) {
      res.render("artist_form", {
        title: "Create artist",
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      await artist.save();
      res.redirect(artist.url);
    }
  })  
]

// 