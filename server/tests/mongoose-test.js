const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Department = mongoose.model('Department', {
  DepartmentId: {
    type: String
  },
  DepartmentName: {
    type: String
  }
});


const newDepartment1 = new Department({
   DepartmentId: 'D1',
   DepartmentName: 'Department 1'
 });

newDepartment1.save().then((doc) => {
   console.log('Saved todo', doc);
 }, (e) => {
   console.log('Unable to save todo')
 });

 const newDepartment3 = new Department({
    DepartmentId: 'D3',
    DepartmentName: 'Department 3'
  });

 newDepartment3.save().then((doc) => {
    console.log('Saved todo', doc);
  }, (e) => {
    console.log('Unable to save todo')
  });

 const newDepartment2 = new Department({
    DepartmentId: 'D2',
    DepartmentName: 'Department 2'
  });

 newDepartment2.save().then((doc) => {
    console.log('Saved todo', doc);
  }, (e) => {
    console.log('Unable to save todo')
  });
