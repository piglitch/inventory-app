const expressAsyncHandler = require("express-async-handler");
const Seller = require("../models/seller");
const { validationResult, body } = require("express-validator");
const Artist = require("../models/artist");
const { title } = require("process");
const { debug } = require("console");

// Display all the sellers in the inventory
exports.seller_list = expressAsyncHandler(async (req, res, next) => {
  const allSellers = await Seller.find().sort({ name: 1 }).exec();
  if (allSellers === null) {
    const err = new Error("Seller not found");
    err.status = 404;
    return next(err);
  }
  res.render("seller_list", {
    title: "Sellers list",
    seller_list: allSellers,
  });
});

// Display the details of individual seller
exports.seller_detail = expressAsyncHandler(async (req, res, next) => {
  const [seller, artistsBySeller] = await Promise.all([ 
    Seller.findById(req.params.id).populate('artists').exec(),
    Artist.find({seller: req.params.id}).exec(), 
  ]); 
 res.render("seller_detail", {
    title: "Seller detail",
    seller: seller,
    artists: artistsBySeller, 
  });
});

// Display seller create form on GET
exports.seller_create_get = expressAsyncHandler(async(req, res, next) => {
  const allArtists = await Artist.find().sort({ name: 1 }).exec();
  res.render("seller_form", { 
    title: "Create Seller", 
    artists: allArtists,
  });
});

// Handle seller create on POST
exports.seller_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.artists)) {
      req.body.artists = typeof req.body.artists === 'undefined' ? [] : [req.body.artists];
    }
    next();
  },
  body("name", "Seller name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("address", "Seller address must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("artists.*").escape(),

  expressAsyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const seller = new Seller({ 
      name: req.body.name, 
      address:  req.body.address,
      artists: req.body.artists,
    });
    if (!errors.isEmpty()) {
      const allArtists = await Artist.find().sort({ name: 1 }).exec();
      res.render("seller_form", {
        title: 'Create Seller',
        seller: seller,
        artists: allArtists,
        errors: errors.array(),
      });
    } else{
      await seller.save();
      res.redirect(seller.url);
    }
  })
];
// Display delete seller on GET
exports.seller_delete_get = expressAsyncHandler(async(req, res, next) => {
  const [seller, artists] = await Promise.all([
    Seller.findById(req.params.id).exec(),
    Artist.find({ seller: req.params.id }),
  ]);
  if (seller === null) {
    res.redirect("/catalog/sellers");
  }
  res.render("seller_delete", {
    title: "Delete seller",
    seller: seller,
  });
});

// Delete seller on POST
exports.seller_delete_post = expressAsyncHandler(async(req, res, next) => {
  const [seller, artists] = await Promise.all([
    Seller.findById(req.params.id).exec(),
    Artist.find({ seller: req.params.id }),
  ]);
  await Seller.findByIdAndDelete(req.body.sellerid);
  res.redirect("/catalog/sellers");
}); 

// Update seller on GET
exports.seller_update_get = expressAsyncHandler(async(req, res, next) => {
  const [seller, allArtistsBySeller] = await Promise.all([
    Seller.findById(req.params.id).populate('artists').exec(),
    Artist.find().sort().exec(),
  ]);
  if (seller === null) {
    const err = new Error('No artists were found');
    err.status = 404;
    return next(err); 
  }
  res.render("seller_form", {
    title: 'Update seller',
    seller: seller,
    artists: allArtistsBySeller,
  });
});

// Handle seller update on POST
exports.seller_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.artists)) {
      req.body.artists = typeof req.body.artists === 'undefined' ? [] : [req.body.artists];
    }
    next();
  },
  body("name", "name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("address", "address must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("artists.*").escape(),

  expressAsyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const seller = new Seller({
      name: req.body.name,
      address: req.body.address,
      artists: req.body.artists,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      const [seller, allArtistsBySeller] = await Promise.all([
        Seller.findById(req.params.id).populate('artists').exec(),
        Artist.find({ seller: req.params.id }).exec(),
      ]);
      res.render("seller_form", {
        title: 'Update seller',
        seller: seller,
        artists: allArtistsBySeller,
      });
    } else {
      const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, seller, {});
      res.redirect(updatedSeller.url);
    }
  })  
]

