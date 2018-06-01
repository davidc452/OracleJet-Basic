var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Department} = require('./models/department');
//


var app = express();
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:8000'}));
//http://localhost:8000/
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", 'http://localhost:8000');
//   res.header("Access-Control-Allow-Origin", 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


app.post('/departments', (req, res) => {
    console.log("Post/ Adding new Department" + req.body);
    const newDepartment = new Department(req.body);
    newDepartment.save(err => {
      if (err) return res.status(500).send(err);
          return res.status(200).send(newDepartment);
    });
});


//Put only updates DepartmentName
app.put('/departments/:id', (req, res, next) => {
  console.log("Put DepartmentId " + id);
  var id = req.params.id;
  var newDepartmentName = req.body.DepartmentName;
  var query  = Department.where({ DepartmentId: req.params.id});
  console.log("Put DepartmentId " + id);
  query.findOneAndUpdate(function (err, department) {
  if (!department) {
         console.log("error with department = " + req.params.id);
        return res.status(400).send(err);
  }
  department.DepartmentName = newDepartmentName;
  console.log("Found department and Updated!= " + department.DepartmentId);
  department.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
  });
});

app.get('/departments', (req, res, next) => {
  Department.find().then((departments) => {
    res.send({departments});
    console.log("get/departments");
  }, (e) => {
    res.status(400).send(e);
  })
});

app.delete('/departments/:id', (req, res) => {
  console.log("delete/department = " + req.params.id);
  var id = req.params.id;
  var query  = Department.where({ DepartmentId: req.params.id});

  // ..working.
   query.findOneAndDelete(function (err, department) {
    if (!department) {
         console.log("error with department = " + req.params.id);
        return res.status(400).send(err);
    }
    if (department) {
      console.log("Found department and Removed!= " + department.DepartmentId);
      res.status(200).send(department);
    }
  });

  // ..this works.
  //  query.count(function (err, count) {
  //   if (err) return res.status(400).send(err);
  //       console.log("Found department = " + req.params.id);
  //    res.status(200).send();
  // });

  // query.findOne().then((dept) => {
  //    console.log("Found department = " + req.params.id);
  // }).catch((e) => {
  //   console.log(" Did Not Find department = " + req.params.id);
  // });


  //
  // {
  //  if (dept) {
  //    console.log("Found department = " + req.params.id);
  //     res.send(dept);
  //  }
  //  if (err) {
  //    console.log("Error department = " + req.params.id);
  //    res.status(400).send();
  //  }
  // });





  // Department.findOneAndDelete(query, function (err, dept) {
  //  if (dept) {
  //    console.log("Found department = " + req.params.id);
  //     res.send(dept);
  //  }
  //  if (err) {
  //    console.log("Error department = " + req.params.id);
  //    res.status(400).send();
  //  }
  // });

//   .then((dept) => {
//       console.log("Found and Deleted department = " + req.params.id);
//       // doc may be null if no document matched
//       res.send(dept);
// }).catch((err) => {
//     res.status(400).send();
//   });
 });

app.listen(3000, () => {
  console.log('Started on port 3000 v2');
});

module.exports = {app};
