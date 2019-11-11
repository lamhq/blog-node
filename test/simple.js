const { expect } = require('chai');
const { formatDate } = require('../src/common/helpers');

describe('formatDate("2013-02-08")', () => {
  it('should return 2013-02-08', () => {
    expect(formatDate('2013-02-08')).to.equal('08/02/2013');
  });
});
