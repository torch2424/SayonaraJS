//Sayonara Config
var sayonaraConfig = require('../sayonaraConfig');

//Password Hashing
var password = require('password-hash-and-salt');

//Mongoose schemas for users
var mongoose = require('mongoose');
var SayonaraSetup = mongoose.model('SayonaraSetup');
var User = mongoose.model('User');
var Permissions = mongoose.model('Permissions');
var Entry = mongoose.model('Entry');
var EntryType = mongoose.model('EntryType');
var Page = mongoose.model('Page');

var path = require('path');

//Try to find if the DB has been intialized
module.exports = function(app, callback) {

	SayonaraSetup.findOne({}, function(err, setup) {
		if (err) {
			console.log('Error when trying to set up Sayonara');
			return;
		}

		if (!setup || !setup.setupRun) {
			console.log('Setup Not found in DB. Starting Setup Page.');
			//Make the index of the app the setup file
			app.get(/^(?!\/setup).*/, function(req, res) {
				res.sendFile(path.resolve('./setup/setupClient.html'));
			});

			//Accept requests to the /setup directory
			app.get('/setup/sayonaraLogo.gif',
				function(req, res) {
					res.sendFile(path.resolve('./setup/sayonaraLogo.gif'));
				});

			//Also, accept post request to setup the db
			app.post('/setupsayonara', function(req, res) {

				//Check that all required fields are here
				if (!req.body || !req.body.email || !req.body.password) res.status(400).send('Missing information!');

				//Create the user
				//Hash the password
				password(req.body.password).hash(function(error, hash) {
					if (error) {
						res.status(500).json(err);
					}

					//Create a new set of permissions
					var newPermissions = new Permissions({});

					newPermissions.save(function(err) {
						if (err) {
							res.status(500).json(err);
						}
						//Create new mongoose user
						var user = new User({
							email: req.body.email,
							hash: JSON.stringify(hash),
							permissions: newPermissions.id
						});

						// Saving the User to the database
						user.save(function(err) {
							if (err) {
								res.status(500).send('Uh Oh, Something went wrong.');
							}

							//Create some Dummy Data for the user

							//Create an entry type
							var newEntryType = new EntryType({
								title: 'New Sayonara Entry Type'
							});


							//Create an Entry
							var newEntry = new Entry({
								title: 'Hello, Sayonara!',
								entryType: newEntryType.id
							});

							//Add the entry to the entry type
							newEntryType.entries.push(newEntry);

							//Save the new entryType
							newEntryType.save(function(err) {
								if (err) {
									res.status(500).send('Error saving the entry type.');
								}

								//Save the Entry
								newEntry.save(function(err) {
									if (err) {
										res.status(500).json(err);
									}

									//Create a page
									var newPage = new Page({
										title: 'Hello World'
									});

									newPage.entryTypes.push(newEntryType.id);

									//Save the page
									newPage.save(function(err) {
										if (err) {
											res.status(500).send('Error saving the page.');
										}

										//Finally, save our Sayonara setup
										var setupComplete = new SayonaraSetup({
											setupRun: true
										});
										setupComplete.save(function(err) {
											if (err) {
												res.status(500).send('Error saving setup Status.');
											}
											//Finally return to the user
											res.status(200).json({
												message: 'Please restart your Node server, welcome to Sayonara!'
											});
										});
									});
								});
							});
						});
					});
				});
			});
		} else {
			//Make the index of the app the client
			var clientRoot = sayonaraConfig.clientRoot;
			if (setup.client) clientRoot = setup.client;

			//Relative paths for the admin app
			//Regex for match everything except /admin* and /api*
			app.get(/^(?!\/admin|\/api).*/, function(req, res) {
				var pathString = clientRoot + req.url;
				res.sendFile(path.resolve(pathString));
			});
		}


		//Finally run our callback
		callback(app);
	})
}
