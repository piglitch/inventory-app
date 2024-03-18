const expressAsyncHandler = require("express-async-handler");
const Artist = require("../models/artist");
const ArtPiece = require("../models/artPiece");
const { body, validationResult } = require("express-validator");
const { title } = require("process");
const artPiece = require("../models/artPiece");
const { debug } = require("debug")("artist");

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

// Display artist delete form on GET
exports.artist_delete_get = expressAsyncHandler(async(req, res, next) => {
  const [artist, allArtPiecesByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    ArtPiece.find({ artist: req.params.id }).exec(),
  ]);
  if (artist === null) {
    res.redirect("/catalog/artists");
  } 
  res.render("artist_delete", {
    title: "Delete Artist",
    artist: artist,
    artist_artPieces: allArtPiecesByArtist,
  });
});

// Delete artist on POST
exports.artist_delete_post = expressAsyncHandler(async(req, res, next) => {
  const [artist, allArtPiecesByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    ArtPiece.find({ artist: req.params.id }).exec(),
  ]);
  if (allArtPiecesByArtist.length > 0) {
    res.render("artist_delete", {
      title: "Delete Artist",
      artist: artist,
      artist_artPieces: allArtPiecesByArtist,
    });
    return;
  } else {
    await Artist.findOneAndDelete(req.body.artistid);
    res.redirect("/catalog/artists")
  }
});

// Display update artist on GET
exports.artist_update_get = expressAsyncHandler(async(req, res, next) => {
  const [artist, artpiecesByArtist] = await Promise.all([ 
    Artist.findById(req.params.id).exec(),
    ArtPiece.find({ artist: req.params.id }, 'name description genre').exec(),
  ]); 
  if (artist === null) {
    debug(`id not found on update: ${req.params.id}`);
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }
  res.render("artist_form", {
    title: 'Update Artist',
    artist: artist,
    artpieces: artpiecesByArtist, 
  });
});

// Handle artist update on POST
exports.artist_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.artist)) {
      req.body.artist = typeof req.body.artist === 'undefined' ? [] : [req.body.artist]
    }
    next();
  },

  body("name", "name msut not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  expressAsyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const artist = new Artist({
      name: req.body.name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death, 
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      const [artist, artpiecesByArtist] = await Promise.all([ 
        Artist.findById(req.params.id).exec(),
        ArtPiece.find({ artist: req.params.id }, 'name description genre').exec(),
      ]); 
      res.render('artist_form', {
        title: "Update artist",
        artist: artist,
        artPieces: artpiecesByArtist,
        errors: errors.array(),
      });
    } else {
      const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, artist, {});
      res.redirect(updatedArtist.url);
    }
  })  
]

