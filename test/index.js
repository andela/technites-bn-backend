import chai from 'chai';

const { expect } = chai;
chai.should();

const testingTest = () => true;

describe('Tests', () => {
  it('Should pass with mock initial tests', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(testingTest()).to.be.true;
  });
});
