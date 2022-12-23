var mongoose = require('mongoose');
var Schema = mongoose.Schema;
datalinkSchema = new Schema( {
	//id:Number,
	nameup:String,
	tag: String,
	link: String,
}),
datalink= mongoose.model('datalink', datalinkSchema);
module.exports = datalink;