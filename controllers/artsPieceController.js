const expressAsyncHandler = require("express-async-handler");
const multer = require("multer"); // Import multer
const ArtPiece = require("../models/artPiece");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const Seller = require("../models/seller");
const { body, validationResult } = require("express-validator");

// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// display all that is there in the inventory. 
// artists, art pieces, sellers, genres.
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
    title: "Dashboard",
    artPiece_count: numArtPieces,
    artist_count: numArtists,
    genres_count: numGenres,
    sellers_count: numSellers,
  })
});

// display the list of art pieces
exports.artPiece_list = expressAsyncHandler(async (req, res, next) => {
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

// Create artPiece on GET
exports.artpiece_create_get = expressAsyncHandler(async(req, res, next) => {
  const [allArtists, allGenres] = await Promise.all([
    Artist.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec()
  ])
  res.render('artpiece_form', {
    title: "Create a new art piece",
    artists: allArtists,
    genres: allGenres
  })
})

// Create artpiece on POST
exports.artpiece_create_post = [
  upload.single('image'), // Handle image upload
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },
  body("name", "Name must have at least 3 letters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("artist", "Artist's name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description can not be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),        

  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const artPiece = new ArtPiece({
      name: req.body.name,
      artist: req.body.artist,
      description: req.body.description,
      genre: req.body.genre,
      image: {
        data: req.file.buffer, // Store image data
        contentType: req.file.mimetype // Store image content type
      }
    });
    if (!errors.isEmpty()) {
      const [allArtists, allGenres] = await Promise.all([
        Artist.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);
      for(const genre of allGenres){
        if(artPiece.genre.includes(genre._id)){
          genre.checked = "true";
        }
      }
      res.render("artpiece_form", {
        title: "Create a new art piece",
        artists: allArtists,
        genres: allGenres,
        artPiece: artPiece,
        errors: errors.array(),
      })
    } else {
      await artPiece.save();
      res.redirect(artPiece.url);
    }
  })
]

// Display art piece delete on GET
exports.artpiece_delete_get = expressAsyncHandler(async(req, res, next) => {
  const artPiece = await ArtPiece.findById(req.params.id).exec();
  if (artPiece === null) {
    res.redirect("/catalog/artpieces");
  }
  res.render("artpiece_delete", {
    title: "Delete artpiece",
    artPiece: artPiece,
  });
});

// Delete art piece on POST
exports.artpiece_delete_post = expressAsyncHandler(async(req, res, next) => {
  const artPiece = await ArtPiece.findById(req.params.id).exec();
  await ArtPiece.findByIdAndDelete(req.body.artPieceid);
  res.redirect("/catalog/artpieces");
})

// Display update art piece on GET
exports.artpiece_update_get = expressAsyncHandler(async(req, res, next) => {
  const [artPiece, allArtists, allGenres] = await Promise.all([
    ArtPiece.findById(req.params.id).populate('artist').exec(),
    Artist.find().sort({ name: 1}).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);    
  if (artPiece === null) {
    const err = new Error("Art piece not found");
    err.status = 404;
    return next(err);
  }
  allGenres.forEach((genre) => {
    if(artPiece.genre.includes(genre._id)) {
      genre.checked = "true";
    }
  });
  res.render("artpiece_form", {
    title: "Update art piece",
    artPiece: artPiece,
    artists: allArtists,
    genres: allGenres,
  });
});

// Update art piece on POST
// Update art piece on POST
exports.artpiece_update_post = [
  upload.single('image'), // Handle image upload
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof req.body.genre == 'undefined' ? [] : [req.body.genre];
    }
    next();
  },
  body('name', "Name cannot be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('artist', "Artist name cannot be empty!")  
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', "Art description cannot be empty") 
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),
  
  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const artPieceFields = {
      name: req.body.name,
      artist: req.body.artist,
      description: req.body.description,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
    };
    if (req.body.file) { // If image was uploaded, add it to artPieceFields
      artPieceFields.image = {
        data: req.file.buffer, // Store image data
        contentType: req.file.mimetype // Store image content type
      };
    }
    const artPiece = new ArtPiece({
      ...artPieceFields,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      const [artPiece, allArtists, allGenres] = await Promise.all([
        ArtPiece.findById(req.params.id).populate('artist').exec(),
        Artist.find().sort({ name: 1}).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);    
      for (const genre of allGenres){
        if (artPiece.genre.indexOf(genre._id) > -1) {
          genre.checked = "true";
        }
      }
      res.render("artpiece_form", {
        title: "Update art piece",
        artists: allArtists,
        genres: allGenres,
        artPiece: artPiece,
        errors: errors.array(),
      })
    } else {
      const updatedArtpiece = await ArtPiece.findByIdAndUpdate(req.params.id, artPiece, {});
      res.redirect(updatedArtpiece.url);
    }
  })
]
