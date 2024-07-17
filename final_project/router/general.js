const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const valid = isValid(username);
        console.log(valid);
        if (!valid) {
            users.push({ username, password });
            return res.status(200).json({
                message: 'User successfully registered. Now you can login.',
            });
        } else {
            return res
                .status(404)
                .json({ message: 'User already registered.' });
        }
    }
    return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        const booksWithISBN = books[isbn];
        if (booksWithISBN) {
            return res.status(200).send(booksWithISBN);
        } else {
            return res.status(404).json({ message: 'Book not found' });
        }
    }
    return res.status(404).json({ message: 'Invalid ISBN provided' });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    if (author) {
        const booksWithAuthor = Object.fromEntries(
            Object.entries(books).filter(
                ([key, value]) => value.author === author
            )
        );
        if (booksWithAuthor) {
            return res.status(200).send(booksWithAuthor);
        } else {
            return res.status(404).json({ message: 'Book not found' });
        }
    }
    return res.status(404).json({ message: 'Invalid author provided' });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    if (title) {
        const booksWithTitle = Object.fromEntries(
            Object.entries(books).filter(
                ([key, value]) => value.title === title
            )
        );
        if (booksWithTitle) {
            return res.status(200).send(booksWithTitle);
        } else {
            return res.status(404).json({ message: 'Book not found' });
        }
    }
    return res.status(404).json({ message: 'Invalid author provided' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const booksWithISBN = books[isbn];
    if (booksWithISBN) {
        return res.status(200).send(booksWithISBN.reviews);
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.general = public_users;
