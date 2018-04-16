
var Dates = require('date-math');

var DAYS = {
  'week': 7,
  'month': 31,
  // TODO do we care about leap years? This is a rough estimate to break the chunks
  'year': 365 
};
/**
 * Module exports
 *
 * @param {Date} start
 * @param {Date} end
 * @param {Number|String} chunks  amount of chunks to split into, or duration
 * @return {Array} array
 *
 *   {
 *     start: Date,
 *     end: Date
 *   } ...
 */

module.exports = function(start, end, chunks){
  start = new Date(start);
  end = new Date(end);
  return typeof chunks === 'number'
    ? number(start, end, chunks)
    : duration(start, end, chunks);
}

/**
 * Return an array of new start and end dates split into the number of chunks
 *
 * @param {Date}   start
 * @param {Date}   end
 * @param {Number} chunks  number of chunks to split into
 */

function number(start, end, size){
  var diff = end - start;
  var interval = diff / size;
  var dates = range(size).map(function(i){
    var base = +start + (i * interval);
    var floor = new Date(Math.floor(base));
    var ceil = new Date(Math.floor(base + interval));
    return entry(floor, ceil);
  });
  // make sure we still end at the right time with rounding errors
  dates[dates.length - 1].end = end;
  return dates;
}
/**
 * @param  {Date} closerToNow (usually now)
 * @param  {Date} past
 */
function daysBetween(closerToNow, past) {
  return Math.round(Math.abs(closerToNow - past)/8.64e7);
}

/**
 * Chunk the dates based upon `duration`
 *
 * @param {Date} start
 * @param {Date} end
 * @param {String} duration  'day', 'week', 'year', etc.
 */

function duration(start, end, duration){
  var days = DAYS[duration];
  if(days) {
    var slices = Math.ceil((daysBetween(end, start))/ days);
    return  number(start, end, slices);
  }
  var math = Dates[duration];
  if (!math) throw new Error('unsupported duration ' + duration);

  var roundStart = math.ceil(start);
  var roundEnd = math.floor(end);
  var diff = roundEnd < roundStart
    ? 0
    : math.diff(roundStart, roundEnd);
  if (!diff) return [entry(start, end)]; // they are on the same interval

  var arr = [];
  if (+start !== +roundStart) arr.push(entry(start, roundStart));
  for (var i = roundStart; i < roundEnd; i = math.shift(i, 1)) {
    arr.push(entry(i, math.shift(i, 1)));
  }
  if (+roundEnd !== +end) arr.push(entry(roundEnd, end));
  return arr;
}

/**
 * Create a new entry in our array
 *
 * @param {Date} start
 * @param {Date} end
 * @return {Object}
 */

function entry(start, end){
  return { start: start, end: end };
}

/**
 * Return an array of size len from 0-len
 *
 * @param {Number} len
 * @return {Array} arr
 */

function range(len){
  var arr = [];
  for (var i = 0; i < len; i++) arr.push(i);
  return arr;
}

// EXPOSE BUT PROTECT
module.exports.DAYS = Object.assign({}, DAYS);
