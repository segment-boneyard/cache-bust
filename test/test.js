
var assert = require('assert');
var bust = require('..');
var fs = require('fs');
var path = require('path');

describe('cache-bust', function () {

  before(function () {
    fs.mkdirSync(resolve());
  });

  after(function () {
    fs.rmdirSync(resolve());
  });

  afterEach(function () {
    dir().forEach(function(filename) {
      fs.unlinkSync(resolve(filename));
    });
  });

  it('should create a cache-busted link with the md5 sum', function () {
    var file = create('file.js', 'test');
    var alias = bust(file);
    assert(/file-[0-9a-f]{32}\.js/.test(alias));
    assert(fs.existsSync(alias));
    assert(read(alias) == 'test');
  });

  it('should remove existing cache busted files', function () {
    var file = create('file.js', 'test');
    bust(file);
    assert(dir().length == 2);
    bust(file);
    assert(dir().length == 2);
  });

  it('shouldnt remove existing files when remove option is false', function () {
    var one = create('file.js', 'one');
    bust(one);
    var two = create('file.js', 'two');
    bust(two);
    assert(dir().length == 3);
  });

});


/**
 * Resolve a testing `filename`.
 *
 * @param {String} filename (optional)
 */

function resolve (filename) {
  return filename
    ? path.resolve(__dirname, 'fixtures', filename)
    : path.resolve(__dirname, 'fixtures');
}


/**
 * Create a testing file with `filename` and `contents`.
 *
 * @param {String} filename
 * @param {String} contents
 * @return {String}
 */

function create (filename, contents) {
  var file = resolve(filename);
  fs.writeFileSync(file, contents);
  return file;
}


/**
 * Read a testing file.
 *
 * @param {String} filename
 * @return {String}
 */

function read (filename) {
  return fs.readFileSync(resolve(filename), 'utf8');
}


/**
 * Read a testing directory.
 *
 * @return {Array}
 */

function dir () {
  return fs.readdirSync(resolve());
}