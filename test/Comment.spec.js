
/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);
chai.should();

let managerToken;
let requesterToken;
let requesterId;
let managerId;
let superAdminToken;
let superAdminId;
let requestId;
let travelAdminToken;
let travelAdminId;
let commentId;
let commentTwoId;

const dummyRequest = {
  request_type: 'OneWay',
  location_id: 1,
  departure_date: '2020-09-25',
  destinations: [{
    destination_id: 2, accomodation_id: 1, check_in: '2020-09-25', check_out: '2020-09-26'
  },
  {
    destination_id: 3, accomodation_id: 1, check_in: '2020-09-27', check_out: '2020-09-28'
  }],
  reason: 'Sick leave'
};

const commentOne = {
  comment: 'I am the first one'
};
const commentTwo = {
  comment: 'I am the second one'
};

describe('Change user roles', () => {
  it('should log in a manager', (done) => {
    const userData = {
      email: 'manager@admin.com',
      password: process.env.SUPER_ADMIN_PASS
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(200);
        managerToken = res.body.data.token;
        managerId = res.body.data.id;
        done();
      });
  });

  it('should log in a requester', (done) => {
    const userData = {
      email: 'requester@request.com',
      password: process.env.SUPER_ADMIN_PASS
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(200);
        requesterToken = res.body.data.token;
        requesterId = res.body.data.id;
        done();
      });
  });

  it('should log in a superadmin', (done) => {
    const userData = {
      email: 'technitesdev1@gmail.com',
      password: process.env.SUPER_ADMIN_PASS
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(200);
        superAdminToken = res.body.data.token;
        superAdminId = res.body.data.id;
        done();
      });
  });

  it('should log in a travel admin', (done) => {
    const userData = {
      email: 'travel@admin.com',
      password: process.env.SUPER_ADMIN_PASS
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(200);
        travelAdminToken = res.body.data.token;
        travelAdminId = res.body.data.id;
        done();
      });
  });

  it('it should create a one way trip request', (done) => {
    dummyRequest.request_type = 'OneWay';
    chai
      .request(app)
      .post('/api/v1/requests')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send(dummyRequest)
      .end((err, res) => {
        res.should.have.status(201);
        requestId = res.body.data.id;
        done();
      });
  });

  it('it should not create a comment without auth', (done) => {
    chai
      .request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .send(commentOne)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('it should create a comment from user when authenticated', (done) => {
    chai
      .request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .send(commentOne)
      .end((err, res) => {
        res.should.have.status(200);
        commentId = res.body.data.id;
        done();
      });
  });

  it('it should create a comment from user when authenticated', (done) => {
    chai
      .request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .send(commentTwo)
      .end((err, res) => {
        res.should.have.status(200);
        commentTwoId = res.body.data.id;
        done();
      });
  });

  it('it should create/edit a not comment from user when there is validation error', (done) => {
    chai
      .request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({
        comment: '',
      })
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
  });

  it('it should create a comment from manager on requesters request', (done) => {
    chai
      .request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send(commentOne)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should create a comment from superAdmin on requesters request', (done) => {
    chai
      .request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send(commentOne)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should not create a comment from travel admin on requesters request', (done) => {
    chai
      .request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .send(commentOne)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('it should not create a comment for a request that does not exist', (done) => {
    chai
      .request(app)
      .post('/api/v1/requests/1000/comments')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send(commentOne)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('it should return error on invalid params', (done) => {
    chai
      .request(app)
      .post('/api/v1/requests/100f0/comments')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send(commentOne)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('it should be able to edit comment if owner', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/requests/${requestId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .send(commentTwo)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should not be able to edit comment if  not owner', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/requests/${requestId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .send(commentTwo)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('it should not be able to edit comment it does not exist', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/requests/${requestId}/comments/1000`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .send(commentTwo)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('it should not be able to edit comment it does not exist', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/requests/${requestId}/comments/1000ere`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .send(commentTwo)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('it should be able to get comments of a your own request', (done) => {
    chai
      .request(app)
      .get(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should be able to get comments of any requests as a manager', (done) => {
    chai
      .request(app)
      .get(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${managerToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should be able to get comments of any requests as a superadmin', (done) => {
    chai
      .request(app)
      .get(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should be able to get comments of any requests if not manager owner or superadmin', (done) => {
    chai
      .request(app)
      .get(`/api/v1/requests/${requestId}/comments`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('it should not be able to delete comment if  not owner', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/requests/${requestId}/comments/${commentTwoId}`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('it should not be able to delete comment if  request does not exist', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/requests/40000/comments/${commentTwoId}`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('it should not be able to delete comment if does not exist', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/requests/${requestId}/comments/40000`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('it should be able to delete your own comment', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/requests/${requestId}/comments/${commentTwoId}`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should not be able to delete a comment that does not exist', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/requests/${requestId}/comments/${commentTwoId}`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
