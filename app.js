// Call dependencies
var http    = require('http');
var express = require('express');
var env     = process.env.NODE_ENV || 'development';
var config  = require(__dirname + '/app/config/app')[env];
var app     = express();

// Run bootstrap
require(config.path.app + '/libraries/express')(http, express, config, app);
