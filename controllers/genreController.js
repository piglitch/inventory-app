const expressAsyncHandler = require("express-async-handler");
const Genre = require("../models/genre");
const ArtPiece = require("../models/artPiece");
const { validationResult, body } = require("express-validator");
const artPiece = require("../models/artPiece");
const { title } = require("process");

// Display all the genres available in the inventory
exports.genre_list = expressAsyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().exec();
  res.render("genre_list", {
    title: 'Genres',
    genre_list: allGenres,
  });
});

// Display details of every genre.
exports.genre_detail = expressAsyncHandler(async (req, res, next) => {
  const [genre, artPiecesByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    ArtPiece.find({ genre: req.params.id }, "name description").exec(),
  ]);
  if (genre === null){
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  } 
  res.render(`genre_detail`, {
    title: "Genre detail",
    genre: genre,
    genre_artpieces: artPiecesByGenre,
  });
});

// Display Genre create form on GET
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle on create Genre on POST
exports.genre_create_post = [
  body("name", "Genre name must contain atleast 3 characters")
  .trim()
  .isLength({ min: 3 })
  .escape(),
  expressAsyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else{
      const genreExists = await Genre.findOne({
        name: req.body.name
      })
      .collation({ locale: 'en', strength: 2 })
      .exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else{
        await genre.save();
        res.redirect(genre.url);
      }
    }
  })
];
// Display book delete on GET
exports.genre_delete_get = expressAsyncHandler(async(req, res, next) => {
  const [genre, artPieces] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    ArtPiece.find({ genre: req.params.id }).exec(),
  ]);
  if (genre === null) {
    res.redirect('/catalog/genres');
  }
  res.render('genre_delete', {
    title: "Delete art genre",
    genre: genre,
    artpiece: artPieces,
  });
})

// Delete genre on POST
exports.genre_delete_post = expressAsyncHandler(async(req, res, next) => {
  const [genre, artPieces] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    ArtPiece.find({ genre: req.params.id }).exec(),
  ]);
  if(artPieces.length > 0){
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: genre,
      artPiece: artPieces, 
    });  
  } else {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
  }
});

// Update genre on GET
exports.genre_update_get = expressAsyncHandler(async(req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();
  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  res.render("genre_form", {
    title: "Update genre",
    genre: genre,
  });
});

// Handle Genre update on POST
exports.genre_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof req.body.genre === 'undefined' ? [] : [req.body.genre]
    }
    next();
  },

  body("name", "name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  expressAsyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Update genre",
        genre: genre,
        errors: errors.array()
      });
    } else {
      const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
      res.redirect(updatedGenre.url);
    }
  }) 
]