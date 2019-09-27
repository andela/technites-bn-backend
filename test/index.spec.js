import adminTests from './Admin.spec';
import managerTests from './Manager.spec';
import OAuthTests from './OAuth.spec';
import userTests from './User.spec';
import usersRequestTests from './UsersRequest.spec';
import utilsUnitTests from './UtilsUnitTest.spec';
import accomodationTests from './Accommodation.spec';
import commonTests from './Common.spec';

describe('Test Runner', () => {
  describe('AdminTests', adminTests);
  describe('ManagerTests', managerTests);
  describe('OAuthTests', OAuthTests);
  describe('UserTests', userTests);
  describe('UsersRequestTests', usersRequestTests);
  describe('UtilsUnitTests', utilsUnitTests);
  describe('AccomodationTests', accomodationTests);
  describe('commonTests', commonTests);
});
