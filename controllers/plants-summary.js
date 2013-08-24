var plants = require('../models/plants');

exports.page = function(req, res) {
	var cookies = require('./cookies')(req, res);
	var params = req.query;
	/* Read params from request, then cookies, then defaults */
	var	sort = params.sort || req.cookies.sort || 'name',
		page = parseInt(params.page || 1),
		pagesize = parseInt(params.pagesize || req.cookies.pagesize || 10);
	/* Store params to cookies */
	res.cookie('sort', sort);
	res.cookie('pagesize', pagesize);
	/* Title of page */
	var title = 'Plants database';
	/* Generate page from query */
	plants.summary(sort, page, pagesize,
		function (err, data) {
			pageparams = {
				'title'		: title + ' - Summary',
				'sort'		: sort,
				'page'		: page,
				'pagesize'	: pagesize,
				'pagecount'	: data.pagecount,
				'names'		: data.names,
				'fields'	: data.fields
			};
			if (err) {
				pageparams.title = title + ' - Error';
				pageparams.error = err;
			}
			else
				pageparams.data = data.result;
			res.render('plants-summary', pageparams);
		});
};

exports.ajax = function(req, res) {
	var params = req.query;
	var command = params.command;
	var callback =
		function (err) {
			res.setHeader('Content-Type', 'text/html');
			if (err)
				res.write('Error: ' + err.toString());
			else
				res.write('INVALIDATE'/* or DONE */);
			res.end();
		};
	if (command = 'example') {
		// plants.example(callback);
	}
	else
		res.end('Invalid command or missing parameter: ' + command);
};
