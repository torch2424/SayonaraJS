//Mongoose schemas for Entry Types
//Ensure to keep Entry types "fields" aligned with Content fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entryTypeSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	entries: [mongoose.Schema.Types.ObjectId],
	hasContent: {
		type: Boolean,
		default: true
	},
	hasEmbedCodes: {
		type: Boolean,
		default: false
	},
	hasUploadUrls: {
		type: Boolean,
		default: false
	}
});

//Models
module.exports = mongoose.model('EntryType', entryTypeSchema);