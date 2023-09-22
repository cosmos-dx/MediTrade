const mongoose = require('mongoose');


const membersSchema = new mongoose.Schema({
  username: String,
  name: String,
  lastname: String,
  phone: String,
  password: String,
  shopName: String,
  drugLicenseNo: String,
  GSTnumber: String,
  state: String,
  district: String,
  locality: String,
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
  verified: Boolean,
});


const Member = mongoose.model('membersnew', membersSchema);

module.exports = Member; 
