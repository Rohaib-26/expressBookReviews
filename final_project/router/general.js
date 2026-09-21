const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ==================== USER REGISTRATION ====================

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});


// ==================== GET ALL BOOKS ====================

public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});


// ==================== GET BOOK BY ISBN ====================

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json({
    [isbn]: book
  });
});


// ==================== GET BOOKS BY AUTHOR ====================

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = {};

  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  if (Object.keys(result).length === 0) {
    return res.status(404).json({
      message: "No books found for this author"
    });
  }

  return res.status(200).json(result);
});


// ==================== GET BOOKS BY TITLE ====================

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = {};

  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  if (Object.keys(result).length === 0) {
    return res.status(404).json({
      message: "No books found with this title"
    });
  }

  return res.status(200).json(result);
});


// ==================== GET BOOK REVIEW ====================

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json(books[isbn].reviews);
});


// ============================================================
// Q11 - AXIOS + ASYNC/AWAIT IMPLEMENTATION
// ============================================================

const BASE_URL = "http://localhost:5000";


// Retrieve all books using Axios and async/await
async function getAllBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving all books:", error.message);
    throw error;
  }
}


// Retrieve book by ISBN using Axios and async/await
async function getBooksByISBN(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving book by ISBN:", error.message);
    throw error;
  }
}


// Retrieve books by author using Axios and async/await
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(author)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving books by author:", error.message);
    throw error;
  }
}


// Retrieve books by title using Axios and async/await
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      `${BASE_URL}/title/${encodeURIComponent(title)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving books by title:", error.message);
    throw error;
  }
}


// Export routes and Axios functions
module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
