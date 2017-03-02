var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
 
/**
 * Todo Schema
 */
var ApplicationSchema = new Schema({
 firstname: String,
   lastname: String,
   email: String,
   userid: String,
   picUrl: String,
    other: String,
    tel: String,
    maritalStatus: Number,
    gender: Number,
    uuid: String,
    payment: String,
    DOB: String,
    POB: String,
    nationality: String,
    decision: Number,
    approver:String,
    comments: String,
    idnum: String,
    issued: String,
    address:{Province:String, District:String, Sector:String, Cellule:String, Village:String},
    status:Number,
    academics: [{name:String, dept:String, grade:Number, aggregate:String, examAuth:String}],
    orgs: [{name:String, description:String, start:String, end:String}],
    refs: [{name:String, occupation:String, tel:Number, email:String}],
    docs: [{name:String, url:String, progress:String}],
    father: {name:String, number:Number, id:Number},
    mother: {name:String, number:Number, id:Number},
    guardian: {name:String, number:Number, id:Number},
    choice: [{choice:String}],
    deptlist: [{choice:String}],
    createdAt:Date,
    updatedAt:Date
 
});
 
// keep track of when todos are updated and created
ApplicationSchema.pre('save', function(next, done){
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});
 
mongoose.model('Application', ApplicationSchema);