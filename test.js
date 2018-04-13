var assert = require('assert');
var chunk = require('./');
var Dates = require('date-math');
var expect = require('chai').expect;
var each = require('lodash').each;

describe('chunk-date-range', function() {
  describe('by number', function() {
    it('should split the dates into equal size chunks', function() {
      var start = new Date('5/1/2013');
      var end = new Date('5/11/2013');
      var splits = 10;
      var chunks = chunk(start, end, splits);
      expect(chunks.length).to.equal(splits);
      verify(chunks, start, end);
    });
  });

  describe('by duration', function() {
    describe('day', () => {
      it('should split the dates into the specified time range', function() {
        var start = new Date('2013-05-01T05:00:00Z');
        var end = new Date('2013-05-11T21:00:00Z');
        var chunks = chunk(start, end, 'day');
        verify(chunks, start, end);
        expect(chunks.length).to.equal(11);
        expect(+chunks[0].end).to.equal(+Dates.day.ceil(start));
        expect(+chunks[10].start).to.equal(+Dates.day.floor(end));
      });

      it('should not add extra entries for round start and end dates', function() {
        var start = new Date('2013-05-01T00:00:00Z');
        var end = new Date('2013-05-11T00:00:00Z');
        var chunks = chunk(start, end, 'day');
        verify(chunks, start, end);
        expect(chunks.length).to.equal(10);
      });

      it('should split the dates which overlap on the same day', function() {
        var start = new Date('2013-05-01T03:00:00Z');
        var end = new Date('2013-05-01T21:00:00Z');
        var chunks = chunk(start, end, 'day');
        verify(chunks, start, end);
        expect(chunks.length).to.equal(1);
      });
    });

    each(chunk.DAYS, (days, duration) => {
      describe(duration, () => {
        [1, 2, 3, 4, 5].forEach(expectedChunk => {
          it(`${expectedChunk * days} days is ${expectedChunk} ${duration} chunks`, () => {
            var start = fromDays(expectedChunk * days);
            // console.log({ start });
            var chunks = chunk(start, new Date(), duration);
            expect(chunks.length).to.equal(expectedChunk);
          });
        });
      });
    });
  });

  function verify(chunks, start, end) {
    expect(+chunks[0].start).to.equal(+start);
    expect(+chunks[chunks.length - 1].end).to.equal(+end);
    chunks.forEach(function(chunk, i) {
      var next = chunks[i + 1];
      if (!next) return;
      expect(+chunk.end).to.equal(+next.start);
    });
  }

  function getDay(time, isString) {
    return time.getDate() + 1;
  }

  function fromDays(days) {
    return new Date(new Date().setDate(getDay(new Date()) - days));
  }
});
