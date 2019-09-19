import { expect } from 'chai';
import getRoleName from '../src/utils/GetRoleUtil';

describe('Testing returns from role_values', () => {
  it('should return with value 1', () => {
    const result = getRoleName(1);
    result.indexOf('Requester').should.equal(0);
  });
  it('should return value for 2', () => {
    const result = getRoleName(2);
    result.indexOf('Manager').should.equal(0);
  });
  it('should return value for 3', () => {
    const result = getRoleName(3);
    expect(result).to.have.length(2);
  });
  it('should return value for 4', () => {
    const result = getRoleName(4);
    expect(result).to.have.length(1);
  });
  it('should return value for 5', () => {
    const result = getRoleName(5);
    expect(result).to.have.length(2);
  });
  it('should return value for 6', () => {
    const result = getRoleName(6);
    expect(result).to.have.length(2);
  });
  it('should return value for 7', () => {
    const result = getRoleName(7);
    expect(result).to.have.length(1);
  });
  it('should return value for null', () => {
    const result = getRoleName(null);
    expect(result).to.equal(null);
  });
});
