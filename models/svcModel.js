const mongoose = require('mongoose');

const svcSchema = new mongoose.Schema({
  svcAmount: {
    type: Number,
    required: true
  },
  svcDate: {
    type: Date,
    required: true
  },
  occYesterday: {
    type: Number,
    required: true
  },
  occToday: {
    type: Number,
    required: true
  }
});

const Svc = mongoose.model('Svc', svcSchema);
module.exports = Svc;
