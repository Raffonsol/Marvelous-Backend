const request = require('supertest');
const chai = require('chai');
const controller = require('./controller');
const app = require('./index');
const mockTasks = require('./mockTasks');
const expect = chai.expect;

describe('The server', function() {
  // Called once before any of the tests in this block begin.
  before(function(done) {
    app.listen(function(err) {
      if (err) { return done(err); }
      done();
    });
  });

  it('should pass healthcheck', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200, function(err, res) {
        if (err) { return done(err); }
        expect(res.text).to.equal('api running');

        done();
      });
  });
});

describe('The controller', function() {
  
  it('should sort tasks alphabetically', function(done) {
    const tasks = controller.formatTasks('To Do', mockTasks.todo);
    expect(tasks[0].name).to.equal('aFirst');
    expect(tasks[tasks.length - 1].name).to.equal('dFourth');
    done();
  });

  it('should only show the 10 most recent Done tasks', function(done) {
    const tasks = controller.formatTasks('Done', mockTasks.done);
    expect(tasks.length).to.equal(10);
    const taskNames = tasks.map(task => task.name);
    // first task to be done in mock data is done8
    expect(taskNames).not.to.include('done8');
    done();
  });
});