const expressAsyncHandler = require("express-async-handler");
const ArtPiece = require("../models/artPiece");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const Seller = require("../models/seller");

// display all that is there in the inventory. 
// artits, art pieces, sellers, genres.
exports.index = expressAsyncHandler(async (req, res, next) => {
  const [
    numArtPieces,
    numArtists,
    numGenres,
    numSellers,
  ] = await Promise.all([
    ArtPiece.countDocuments({}).exec(),
    Artist.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
    Seller.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "We sell art here",
    artPiece_count: numArtPieces,
    artist_count: numArtists,
    genres_count: numGenres,
    sellers_count: numSellers,
  })
});

// display the list of art pieces
exports.artPiece_list = expressAsyncHandler(async (rew, res, next) => {
  const allArtPieces = await ArtPiece.find({}, "name artist")
    .sort({ name: 1 })
    .populate('artist')
    .exec();
  res.render("artPiece_list", {
    title: "Art piece list",
    artPiece_list: allArtPieces,
  });
});

// display the details of individual art pieces
exports.artPiece_detail = expressAsyncHandler(async (req, res, next) => {
  try {
    // Find the art piece
    const artPiece = await ArtPiece.findById(req.params.id)
      .populate('artist')
      .populate('genre')
      .exec();

    if (!artPiece) {
      // Handle case where art piece is not found
      return res.status(404).send('Art piece not found');
    }
    // Find the seller based on the artist associated with the art piece
    const seller = await Seller.findOne({ artists: artPiece.artist }).exec();

    res.render("artPiece_detail", {
      title: "Art piece detail",
      artPiece_detail: artPiece,
      seller: seller,
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Create artPiec on GET
exports.artpiece_create_get = expressAsyncHandler(async(req, res, next) => {
  const [artPiece, ] = await ArtPiece.find
  res.render('artpiece_form', {
    title: "Create a new art piece",
  })
})


