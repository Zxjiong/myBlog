var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var badWordSchema = new Schema({
  "badword":Array
});
module.exports = mongoose.model('badWord',badWordSchema);
