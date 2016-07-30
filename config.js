// This file is used to defined global settings and utilities.
var portToUse=4000;
var _ = require('lodash');

var globalExports = {
	
	appLocalPort:portToUse,
	appLocalUrl:'http://localhost:'+portToUse,
	appLocalMongoUrl:'mongodb://localhost/grat'

};

module.exports = _.extend(_,globalExports); //exports all lodash functinality and globalExports