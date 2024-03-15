#! /usr/bin/env node

console.log(
  'This script populates some test artists, sellers, art pieces, and genres to your database. Specify database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require("mongoose");
const Artist = require("./models/artist");
const Seller = require("./models/seller");
const ArtPiece = require("./models/artPiece");
const Genre = require("./models/genre");

const artists = [];
const sellers = [];
const artPieces = [];
const genres = [];

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createArtists();
  await createSellers();
  await createArtPieces();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate("Abstract"),
    genreCreate("Realism"),
    genreCreate("Impressionism"),
    // Add more genres as needed
  ]);
}

async function createArtists() {
  console.log("Adding artists");
  await Promise.all([
    artistCreate("Vincent van Gogh", "Starry Night"),
    artistCreate("Leonardo da Vinci", "Mona Lisa"),
    // Add more artists as needed
  ]);
}

async function createSellers() {
  console.log("Adding sellers");
  await Promise.all([
    sellerCreate("Gallery XYZ", "New York", artists[0]), // Assuming the first artist for the first seller
    sellerCreate("Art Corner", "Paris", artists[1]), // Assuming the second artist for the second seller
    // Add more sellers as needed
  ]);
}

async function createArtPieces() {
  console.log("Adding art pieces");
  await Promise.all([
    artPieceCreate(
      "Starry Night",
      artists[0], // Assuming the first artist for the first art piece
      sellers[0], // Assuming the first seller for the first art piece
      "A masterpiece by Vincent van Gogh.",
      [genres[2]] // Assuming the third genre for the first art piece
    ),
    artPieceCreate(
      "Mona Lisa",
      artists[1], // Assuming the second artist for the second art piece
      sellers[1], // Assuming the second seller for the second art piece
      "A famous portrait by Leonardo da Vinci.",
      [genres[1]] // Assuming the second genre for the second art piece
    ),
    // Add more art pieces as needed
  ]);
}

async function genreCreate(name) {
  const genre = new Genre({ name });
  await genre.save();
  genres.push(genre);
  console.log(`Added genre: ${name}`);
}

async function artistCreate(name, art_pieces, date_of_birth, date_of_death) {
  const artist = new Artist({ name, art_pieces, date_of_birth, date_of_death });
  await artist.save();
  artists.push(artist);
  console.log(`Added artist: ${name}`);
}

async function sellerCreate(name, address, artists) {
  const seller = new Seller({ name, address, artists });
  await seller.save();
  sellers.push(seller);
  console.log(`Added seller: ${name}`);
}

async function artPieceCreate(name, artist, seller, description, genre) {
  const artPiece = new ArtPiece({
    name,
    artist,
    seller,
    description,
    genre,
  });
  await artPiece.save();
  artPieces.push(artPiece);
  console.log(`Added art piece: ${name}`);
}
