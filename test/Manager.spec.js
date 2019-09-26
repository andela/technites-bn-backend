import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import AuthHelper from '../src/utils/AuthHelper';

chai.use(chaiHttp);
chai.should();

const { jwtSign } = AuthHelper;

describe('managers endpoints', () => {
  const managerToken = jwtSign({ email: 'technitesdev@gmail.com' }, '4m');

  it('should retrieve request from his/her direct report', (done) => {
    chai
      .request(app)
      .get('/api/v1/requests/manager')
      .set('Authorization', `Bearer ${managerToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('requests from user\'s you manage');
        res.body.should.have.property('data').be.a('array');
        done();
      });
  });

  it('should be able to retrieve pending requests', (done) => {
    chai
      .request(app)
      .get('/api/v1/requests/manager?sort=pending')
      .set('Authorization', `Bearer ${managerToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('requests from user\'s you manage');
        expect(res.body.data[0].status).to.be.eql('Pending');
        done();
      });
  });
});
