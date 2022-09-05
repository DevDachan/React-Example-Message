var http = require('http');
var https = require('https');
var db = require('../lib/db.js');
var template = require('../lib/template.js');
var url = require('url');
var qs = require('querystring');
var express = require('express');
var router = express.Router();
var path = require('path');
var shortid = require('shortid');
var bcrypt = require('bcrypt');

module.exports = function(passport){

  router.post('/user_check',
    passport.authenticate('local', {
      successRedirect: 'http://localhost:4000/',
      failureRedirect: 'http://localhost:4000/',
      failureFlash: true,
      successFlash: true
    }));


    router.get('/logout', function (request, response) {
      request.logout();
      request.session.save(function () {
        response.redirect('/');
      });
    });

  return router;
}
