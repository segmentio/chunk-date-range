var assert = require('assert')
  , chunk = require('./');

describe('chunk-date-range', function () {

  it('should split the dates into equal size chunks', function () {
    var start = new Date('5/1/2013')
      , end = new Date('5/11/2013')
      , splits = 10;

    var chunks = chunk(start, end, splits);
    assert(chunks.length === splits);
    assert(chunks[0].start.getTime() === start.getTime());
    assert(chunks[splits-1].end.getTime() === end.getTime());

    chunks.forEach(function (chunk, i) {
      var next = chunks[i+1];
      if (!next) return;
      assert(chunk.end.getTime() === next.start.getTime());
    });
  });
});