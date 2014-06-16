var assert = require('assert')
var chunk = require('./');
var Dates = require('date-math');

describe('chunk-date-range', function () {

  describe('by number', function(){
    it('should split the dates into equal size chunks', function (){
      var start = new Date('5/1/2013')
      var end = new Date('5/11/2013')
      var splits = 10;
      var chunks = chunk(start, end, splits);
      assert.equal(chunks.length, splits);
      verify(chunks, start, end);
    });
  });

  describe('by duration', function(){
    it('should split the dates into the specified time range', function(){
      var start = new Date('2013-05-01T05:00:00Z');
      var end = new Date('2013-05-11T21:00:00Z');
      var chunks = chunk(start, end, 'day');
      verify(chunks, start, end);
      assert.equal(chunks.length, 11);
      assert.equal(+chunks[0].end, +Dates.day.ceil(start));
      assert.equal(+chunks[10].start, +Dates.day.floor(end));
    });

    it('should not add extra entries for round start and end dates', function(){
      var start = new Date('2013-05-01T00:00:00Z');
      var end = new Date('2013-05-11T00:00:00Z');
      var chunks = chunk(start, end, 'day');
      verify(chunks, start, end);
      assert.equal(chunks.length, 10);
    });

    it('should split the dates which overlap on the same day', function(){
      var start = new Date('2013-05-01T03:00:00Z');
      var end = new Date('2013-05-01T21:00:00Z');
      var chunks = chunk(start, end, 'day');
      verify(chunks, start, end);
      assert.equal(chunks.length, 1);
    });
  });

  function verify(chunks, start, end){
    assert.equal(+chunks[0].start, +start);
    assert.equal(+chunks[chunks.length-1].end, +end);
    chunks.forEach(function (chunk, i) {
      var next = chunks[i+1];
      if (!next) return;
      assert.equal(+chunk.end, +next.start);
    });
  }
});