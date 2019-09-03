import chai from 'chai';
import index from '../src/index';

const { expect } = chai;
chai.should();

describe('App', () => {
  it('Should Exist', () => {
    expect(index).to.be.a('function');
  });
});
