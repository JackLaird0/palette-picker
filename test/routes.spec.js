const environment = process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage when hitting the root endpoint', done => {
    chai.request(server)  
      .get('/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return a 404 status code for an endpoint that doesnt exist', done => {
    chai.request(server)
      .get('/user')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', () => {

  beforeEach( done => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  describe('GET /api/v1/projects', () => {
    it('should return an array of project objects', done => {
      chai.request(server) 
        .get('/api/v1/projects')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('sample');
          done();
        });
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return an array of palette objects', done => {
      chai.request(server)
        .get('/api/v1/palettes')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('sample palette');
          response.body[0].should.have.property('color-one')
          response.body[0]['color-one'].should.equal('#FFFFFF')
          response.body[0].should.have.property('color-two')
          response.body[0]['color-two'].should.equal('#000000')
          response.body[0].should.have.property('color-three')
          response.body[0]['color-three'].should.equal('#000FFF')
          response.body[0].should.have.property('color-four')
          response.body[0]['color-four'].should.equal('#FFF000')
          response.body[0].should.have.property('color-five')
          response.body[0]['color-five'].should.equal('#AB750C')
          response.body[0].should.have.property('project_id')
          response.body[0].project_id.should.equal(1)
          done();
        });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', done => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
         project: { name: 'sample 2' }
      })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(2);
          done();
        });
    });

    it('should return an error if the body is incorrect', done => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          project: {}
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { name: <String> }. You\'re missing a "name" property.')
          done();
        })
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should create a new palette', done => {
      chai.request(server)
        .post('/api/v1/palettes')
        .send({
          palette: {
            name: 'another sample',
            'color-one': '#123456',
            'color-two': '#ABCDEF',
            'color-three': '#123ABC',
            'color-four': '#123ABC',
            'color-five': '#DF0F00',
            project_id: 1
          }
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(2);
          done();
        });
    });

    it('it should return an error id the body is incorrect', done => {
      chai.request(server)
        .post('/api/v1/palettes')
        .send({
          palette: {}
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { name: <String>, color-one: <String>, color-two <String>, color-three: <String>, color-four: <String>, color-five: <String>, project_id: <Number> }. You\'re missing a "name" property.')
          done();
        });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should return the id of the palette that was deleted', done => {
      chai.request(server)
        .delete('/api/v1/palettes/1')
        .end((err, response) => {
          response.should.have.status(202);
          response.body.should.have.property('id');
          response.body.id.should.equal('1');
          done();
        })
    });
  });
});