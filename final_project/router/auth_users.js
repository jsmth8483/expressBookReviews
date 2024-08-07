const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.find((user) => user.username === username) ? true : false;
};

const authenticatedUser = (username, password) => {
    return users.find(
        (user) => user.username === username && user.password === password
    )
        ? true
        : false;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: 'Error logging in' });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            'access',
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send('User successfully logged in');
    } else {
        return res
            .status(208)
            .json({ message: 'Invalid login. Check username and password' });
    }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const reviewDescription = req.query.description;
    const loggedInUser = req.session.authorization.username;
    if (reviewDescription) {
        const book = books[isbn];
        if (book) {
            book.reviews[loggedInUser] = reviewDescription;
            return res.status(200).send(`Book review added on IBSN ${isbn}`);
        }
    } else {
        return res.status(404).send('Error adding review');
    }

    return res.status(300).send('Being implemented');
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const loggedInUser = req.session.authorization.username;
    if (isbn) {
        delete books[isbn].reviews[loggedInUser];
        res.status(200).send(`Review on book with ISBN ${isbn} deleted`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
