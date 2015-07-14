
var crypto = require('crypto');
var debug = require('debug')('cache-bust');
var fs = require('fs');
var path = require('path');
var util = require('util');


/**
 * Expose `bust`.
 */

module.exports = exports = bust;


/**
 * Expose `alias`.
 */

exports.alias = alias;


/**
 * Expose `remove`.
 */

exports.remove = remove;


/**
 * Cache bust a given `file`.
 *
 * @param {String} file
 * @param {Object} options (optional)
 *   @property {Boolean} remove
 */

function bust (file, options) {
  options || (options = {});
  if (options.remove !== false) remove(file);
  return link(file);
}


/**
 * Return the cache-busted filename for a given `file`.
 *
 * @param {String} file
 * @return {String}
 */

function alias (file) {
  var contents = fs.readFileSync(file);
  var ext = path.extname(file);
  var full = path.resolve(path.dirname(file), path.basename(file, ext));
  var hash = crypto.createHash('md5')
    .update(contents)
    .digest('hex');

  return util.format('%s-%s%s', full, hash, ext);
}


/**
 * Create a link to a cache-busted version of a `file`.
 *
 * @param {String} file
 * @return {String}
 */

function link (file) {
  var aliased = alias(file);
  debug('creating file: ' + aliased);
  if (fs.existsSync(aliased)) fs.unlinkSync(aliased);
  fs.linkSync(file, aliased);
  return aliased;
}


/**
 * Remove any existing cache-busted links for a `file`.
 *
 * @param {String} file
 */

function remove (file) {
  var ext = path.extname(file);
  var base = path.basename(file, ext);
  var dir = path.dirname(file);
  var files = fs.readdirSync(dir);
  var matcher = new RegExp(base + '-.*' + ext);

  files.forEach(function (file) {
    if (matcher.test(file)) {
      debug('removing file: ' + file);
      fs.unlinkSync(path.resolve(dir, file));
    }
  });
}
