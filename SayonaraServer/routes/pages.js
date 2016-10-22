//Sayonara configuration
var sayonaraConfig = require('../sayonaraConfig');

//Create our router
var express = require('express');
var router = express.Router();

//Helper functions
var routeHelpers = require('./routeHelpers');

// User models
var mongoose = require('mongoose');
var Page = mongoose.model('Page');
var EntryType = mongoose.model('EntryType');


//Create a new Page
router.post('/create', function(req, res) {

	//Check for required fields
	if (!req.body || !req.body.title) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Create a new page
		var newPage = new Page({
			title: req.body.title
		});

		//Check for any optional fields
		if (req.body.date) newPage.date = req.body.date;
		if (req.body.content) newPage.content = req.body.content;
		if (req.body.entryTypes) newPage.entryTypes = req.body.entryTypes;
		if (req.body.categories) newPage.categories = req.body.categories;

		newPage.save(function(err) {
			if (err) {
				res.status(500).send('Error saving the page.');
				return;
			}
			res.status(200).send('Success!');
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

//Get all Pages
router.get('/all', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find all pages
		Page.find({}, function(err, pages) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			var pagesMap = {};

			pages.forEach(function(page) {
				pagesMap[page._id] = page;
			});

			res.send(pagesMap);
		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Get a page (All the way down to entries)
router.get('/id/:id', function(req, res) {
	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Find all pages
		Page.find({
			_id: req.params.id
		}, function(err, pages) {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!pages) res.status(404).send('Id not found');

			//Get the entry types for the pages
			EntryType.find({
				'_id': {
					$in: pages.entryTypes
				}
			}, function(err, entryTypes) {
				if (err) {
					res.status(500).json(err);
					return;
				}
				if (!entryTypes) res.status(200).json(pages);

				//Set the entry types to the page
				pages.entryTypes = entryTypes;

				//Get the entries of the EntryType
				Entry.find({
					'_id': {
						$in: pages.entryTypes.entries
					}
				}, function(err, entries) {
					if (err) {
						res.status(500).json(err);
						return;
					}
					if (!entries) res.status(200).json(pages);

					//Replace the entry types entries with the actual entry
					for (var i = 0; i < pages.entryTypes.entries.length; i++) {
						var fullEntry = entires[pages.entryTypes.entries[i]];
						pages.entryTypes.entries[i] = fullEntry;
					}

					//Return the pages
					res.status(200).json(pages);
				});
			})

		});
	}, function(error) {
		res.status(error.status).send(error.message);
	});
});

//Update a page
router.put('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Find the page
		Page.findOne({
			_id: req.param.id
		}, function(err, page) {
			//Check for any optional fields
			if (req.body.date) page.date = req.body.date;
			if (req.body.content) page.content = req.body.content;
			if (req.body.entryTypes) page.entryTypes = req.body.entryTypes;
			if (req.body.categories) page.categories = req.body.categories;

			page.save(function(err) {
				if (err) {
					res.status(500).send('Error saving the page.');
					return;
				}
				res.status(200).json(page);
			})
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

//Delete a page
//Update a page
router.delete('/id/:id', function(req, res) {

	//Check for required fields
	if (!req.body) res.status(400).send('Missing parameters');

	//Validate our JWT and permissions
	var permissions = [routeHelpers.definedPermissions.pages];
	routeHelpers.validateUser(req, permissions).then(function(result) {

		//Perform the action
		//Find the page
		Page.findOne({
			_id: req.param.id
		}, function(err, page) {

			page.remove(function(err) {
				if (err) {
					res.status(500).send('Error deleting the page.');
					return;
				}
				res.status(200).send('Deleted!');
			})
		})
	}, function(error) {
		res.status(error.status).send(error.message);
	});

});

module.exports = router;
