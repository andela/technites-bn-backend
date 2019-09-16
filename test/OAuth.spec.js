/* eslint-disable no-unused-vars */
import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import request from 'supertest';
import nock from 'nock';
import sinon from 'sinon';
import { googleProfile, facebookProfile, userResponse } from './__mocks__/MockData.json';
import OAuthCallback from '../src/utils/OAuthCallback';
import OAuthController from '../src/controllers/OAuthController';
import app from '../src';

chai.use(chaiHttp);
chai.use(sinonChai);
const should = chai.should();
const { loginCallback } = OAuthController;

describe('SOCIAL LOGIN', () => {
  it('OAuthCallback should return User object', async (done) => {
    const accessToken = 'xx-xx-xx';
    const refreshToken = 'xx-xx-xx';
    const cb = sinon.spy();
    OAuthCallback(accessToken, refreshToken, googleProfile, cb);
    // eslint-disable-next-line no-unused-expressions
    expect(cb.calledOnce).to.be.true;
    assert(cb.withArgs(null, {
      firstname: 'Fred',
      lastname: 'Mucyo',
      email: 'mucyomiller@gmail.com',
      is_verified: true
    }).calledOnce);
    done();
  });

  describe('LOGIN WITH GOOGLE', () => {
    before(async () => {
      nock('https://www.google.com/')
        .filteringPath(() => '/api/v1/auth/google')
        .get('/api/v1/auth/google')
        .reply(302, googleProfile);
    });

    it('It should go to google consent screen', async () => {
      const res = await request(app).get('/api/v1/auth/google');
      expect(res.status).to.be.eql(302);
      expect(res.redirect).to.be.eql(true);
    });

    it('It should call google callback endpoint', async () => {
      const res = await request(app).get('/api/v1/auth/google/callback');
      expect(res.status).to.be.eql(302);
      expect(res.redirect).to.be.eql(true);
    });
  });

  describe('LOGIN WITH FACEBOOK', () => {
    before(async () => {
      nock('https://www.facebook.com/')
        .filteringPath(() => '/api/v1/auth/facebook')
        .get('/api/v1/auth/facebook')
        .reply(302, googleProfile);
    });

    it('It should go to facebook consent screen', async () => {
      const res = await request(app).get('/api/v1/auth/facebook');
      expect(res.status).to.be.eql(302);
      expect(res.redirect).to.be.eql(true);
    });

    it('It should call facebook callback endpoint', async () => {
      const res = await request(app).get('/api/v1/auth/fb/callback');
      expect(res.status).to.be.eql(302);
      expect(res.redirect).to.be.eql(true);
    });
  });
});
