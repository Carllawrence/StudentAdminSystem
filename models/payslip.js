var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
 
/**
 * Todo Schema
 */
var PayslipSchema = new Schema({
  ncp: Number,
 dco: Date,
 dva: Date,
 uti: String,
 pie: String,
 eve: Number,
 ope: Number,
 lib: String,
 debit: String,
 credit: String,
createdAt:Date,
updatedAt:Date
 
});
 
// keep track of when todos are updated and created
PayslipSchema.pre('save', function(next, done){
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});
 
mongoose.model('Payslip', PayslipSchema);