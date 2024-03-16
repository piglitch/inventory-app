const express = require("express");
const router = express.Router();

// Require controller modules.
const artPiece_controller = require("../controllers/artsPieceController");
const artist_controller = require("../controllers/artistController")
const genre_controller = require("../controllers/genreController");
const seller_controller = require("../controllers/sellerController");


// GET catalog home page.
router.get("/", artPiece_controller.index)
// Art piece routes 
router.get("/artpieces", artPiece_controller.artPiece_list)
router.get("/artpiece/create", artPiece_controller.artpiece_create_get)
router.post("/artpiece/create", artPiece_controller.artpiece_create_post)
router.get("/artpiece/:id/delete", artPiece_controller.artpiece_delete_get)
router.post("/artpiece/:id/delete", artPiece_controller.artpiece_delete_post)
router.get("/artpiece/:id", artPiece_controller.artPiece_detail)
// Artist Routes
router.get("/artist/create", artist_controller.artist_create_get)
router.post("/artist/create", artist_controller.artist_create_post)
router.get("/artist/:id/delete", artist_controller.artist_delete_get)
router.post("/artist/:id/delete", artist_controller.artist_delete_post)
router.get("/artist/:id", artist_controller.artist_detail)
router.get("/artists", artist_controller.artist_list)
// Genre routes
router.get("/genres", genre_controller.genre_list)
router.get("/genre/create", genre_controller.genre_create_get)
router.post("/genre/create", genre_controller.genre_create_post)
router.get("/genre/:id/delete", genre_controller.genre_delete_get)
router.post("/genre/:id/delete", genre_controller.genre_delete_post)
router.get("/genre/:id", genre_controller.genre_detail)
// Seller Routes
router.get("/sellers", seller_controller.seller_list)
router.get("/seller/create", seller_controller.seller_create_get)
router.post("/seller/create", seller_controller.seller_create_post)
router.get("/seller/:id/delete", seller_controller.seller_delete_get)
router.post("/seller/:id/delete", seller_controller.seller_delete_post)
router.get("/seller/:id", seller_controller.seller_detail)

module.exports = router;
