var assert = require('assert');
var chunk = require('./');
var Dates = require('date-math');
var expect = require('chai').expect;
var each = require('lodash').each;
var fromDays = chunk.fromDays;
var daysBetween = chunk.daysBetween;

describe('chunk-date-range', function() {
  describe('by number', function() {
    it('should split the dates into equal size chunks', function() {
      var start = new Date('5/1/2013');
      var end = new Date('5/11/2013');
      var splits = 10;
      var chunks = chunk({ start, end, chunks: splits });
      expect(chunks.length).to.equal(splits);
      verify(chunks, start, end);
    });
  });

  describe('by duration', function() {
    describe('day', () => {
      it('should split the dates into the specified time range', function() {
        var start = new Date('2013-05-01T05:00:00Z');
        var end = new Date('2013-05-11T21:00:00Z');
        var chunks = chunk({ start, end, chunks: 'day' });
        verify(chunks, start, end);
        expect(chunks.length).to.equal(11);
        expect(+chunks[0].end).to.equal(+Dates.day.ceil(start));
        expect(+chunks[10].start).to.equal(+Dates.day.floor(end));
      });

      it('should not add extra entries for round start and end dates', function() {
        var start = new Date('2013-05-01T00:00:00Z');
        var end = new Date('2013-05-11T00:00:00Z');
        var chunks = chunk({ start, end, chunks: 'day' });
        verify(chunks, start, end);
        expect(chunks.length).to.equal(10);
      });

      it('should split the dates which overlap on the same day', function() {
        var start = new Date('2013-05-01T03:00:00Z');
        var end = new Date('2013-05-01T21:00:00Z');
        var chunks = chunk({ start, end, chunks: 'day' });
        verify(chunks, start, end);
        expect(chunks.length).to.equal(1);
      });
    });

    each(chunk.DAYS, (days, duration) => {
      describe(duration, () => {
        [1, 2, 3, 4, 5].forEach(expectedChunk => {
          it(`${expectedChunk *
            days} days is ${expectedChunk} ${duration} chunks`, () => {
            var start = fromDays(expectedChunk * days);
            var chunks = chunk({ start, end: new Date(), chunks: duration });
            // console.log(chunks);
            expect(chunks.length).to.equal(expectedChunk);
          });
        });
      });
    });

    it('32 days is 2 month chunks', () => {
      var start = fromDays(32);
      var chunks = chunk({ start, end: new Date(), chunks: 'month' });
      expect(chunks.length).to.equal(2);
    });

    describe('offset', () => {
      it('month - 2 chunks offset days', () => {
        var start = new Date(2018, 2, 1); // March (31 days)
        var end = new Date(2018, 3, 2); // April

        // const between = daysBetween(end, start);

        // console.log({ between });

        var chunks = chunk({
          start,
          end,
          chunks: 'month',
          offset: {
            duration: 'day',
            by: 1
          }
        });
        // console.log({ chunks });
        expect(chunks.length).to.equal(2);
        const [first, second] = chunks;

        expect(first.end.getFullYear()).to.equal(2018);
        expect(first.end.getMonth()).to.equal(2);
        expect(first.end.getDate()).to.equal(17);

        expect(second.start.getFullYear()).to.equal(2018);
        expect(second.start.getMonth()).to.equal(2);
        expect(second.start.getDate()).to.equal(18);
      });

      it('month - 3 chunks offset days', () => {
        var start = new Date(2018, 2, 1); // March (31 days)
        var end = new Date(2018, 4, 4); // April

        // const between = daysBetween(end, start);

        // console.log({ between });

        var chunks = chunk({
          start,
          end,
          chunks: 'month',
          offset: {
            duration: 'day',
            by: 1
          }
        });
        // console.log({ chunks });
        expect(chunks.length).to.equal(3);
        const [first, second, third] = chunks;

        expect(first.start.getFullYear()).to.equal(2018);
        expect(first.start.getMonth()).to.equal(2);
        expect(first.start.getDate()).to.equal(1);

        expect(first.end.getFullYear()).to.equal(2018);
        expect(first.end.getMonth()).to.equal(2);
        expect(first.end.getDate()).to.equal(22);

        expect(second.start.getFullYear()).to.equal(2018);
        expect(second.start.getMonth()).to.equal(2);
        expect(second.start.getDate()).to.equal(23);

        expect(second.end.getFullYear()).to.equal(2018);
        expect(second.end.getMonth()).to.equal(3);
        expect(second.end.getDate()).to.equal(12);

        expect(third.start.getFullYear()).to.equal(2018);
        expect(third.start.getMonth()).to.equal(3);
        expect(third.start.getDate()).to.equal(13);
        
        expect(third.end.getFullYear()).to.equal(2018);
        expect(third.end.getMonth()).to.equal(4);
        expect(third.end.getDate()).to.equal(4);
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
});
