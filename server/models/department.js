var mongoose = require('mongoose');

var Department = mongoose.model('Department', {
  DepartmentId: {
    type: String,
    required: true,
    minlength: 1
  },
  DepartmentName: {
    type: String
  }
});

module.exports = {Department};
