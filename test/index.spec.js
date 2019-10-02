import adminTests from './Admin.spec';
import managerTests from './Manager.spec';
import OAuthTests from './OAuth.spec';
import userTests from './User.spec';
import usersRequestTests from './UsersRequest.spec';
import utilsUnitTests from './UtilsUnitTest.spec';
import hostTests from './Host.spec';
import accomodationTests from './Accommodation.spec';
import feedbackTests from './Feedback.spec';
import commonTests from './Common.spec';
import commentTests from './Comment.spec';
import ratingTests from './Rating.spec';

describe('Test Runner', () => {
  describe('AdminTests', adminTests);
  describe('ManagerTests', managerTests);
  describe('OAuthTests', OAuthTests);
  describe('UserTests', userTests);
  describe('UsersRequestTests', usersRequestTests);
  describe('UtilsUnitTests', utilsUnitTests);
  describe('HostTests', hostTests);
  describe('AccomodationTests', accomodationTests);
  describe('feedbackTests', feedbackTests);
  describe('commonTests', commonTests);
  describe('commentTests', commentTests);
  describe('ratingTests', ratingTests);
});
