const express = require('express');
const SearchController = require('./SearchController');
const {createMiddleware} = require('./../../core/rest');

const router = express.Router({});

router.get('/search', createMiddleware(SearchController));

module.exports = router;
