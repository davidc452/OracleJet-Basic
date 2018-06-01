const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Department} = require('./../models/department');

//const {Todo} = require('./../models/todo');

const dept = [{
  _id: new ObjectID(),
  DepartmentId: 'T1',
  DepartmentName: 'Test Department'
}, {
  _id: new ObjectID(),
  DepartmentId: 'T2',
  DepartmentName: 'Test Department'
}];

beforeEach((done) => {
  Department.remove({}).then(() => {
    return Department.insertMany(dept);
  }).then(() => done());
});

describe('Testing post/departments', () => {
  it('should create a new Department', (done) => {
    var DepartmentId = 'D55';

    request(app)
      .post('/departments')
      .send({DepartmentId})
      .expect(200)
      .expect((res) => {
        expect(res.body.DepartmentId).toBe(DepartmentId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Department.find({DepartmentId}).then((dept) => {
          expect(dept.length).toBe(1);
          expect(dept[0].DepartmentId).toBe(DepartmentId);
          done();
        }).catch((e) => done(e));
      });
  });
});
