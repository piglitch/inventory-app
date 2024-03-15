const expressAsyncHandler = require("express-async-handler");
const Genre = require("../models/genre");
const ArtPiece = require("../models/artPiece");
const { validationResult, body } = require("express-validator");

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
]
