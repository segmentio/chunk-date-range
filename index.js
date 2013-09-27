var map;

try {
  map = require('map-component');
} catch (err) {
  map = require('map');
}


module.exports = chunk;


/**
 * Return an array of new start and end dates split into the number of chunks
 *
 * @param {Date}   start
 * @param {Date}   end
 * @param {Number} chunks  number of chunks to split into
 *
 * @return {Array}
 *
 * [
 *   {
 *     start: Date,
 *     end: Date
 *   }
 * ]
 */

function chunk (start, end, chunks) {
  start = new Date(start);
  end = new Date(end);

  var diff = end - start
    , interval = diff / chunks;

  var dates = map(range(chunks), function (i) {
    var base = start.getTime() + (i * interval);

    return {
      start: new Date(Math.floor(base)),
      end: new Date(Math.floor(base + interval))
    };
  });

  // make sure we still end at the right time with rounding errors
  dates[dates.length - 1].end = end;
  return dates;
}


/**
 * Return an array of size len from 0-len
 */

function range (len) {
  var arr = [];
  for (var i = 0; i < len; i++) arr.push(i);
  return arr;
}