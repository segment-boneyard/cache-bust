# cache-bust

  Create cache-busted versions of a file using the MD5 hash of the file's contents.

## Installation
  
```
$ npm install cache-bust
```

## Example

```js
var bust = require('cache-bust');
var file = path.resolve(__dirname, 'build.js');

bust(file); // creates a "build-43c191bf6d6c3f263a8cd0efd4a058ab.js"
```

## API

### cacheBust(file, [options])

  Create a cache-busted version of `file` in the same directory, removing previously cache-busted copies if they exist.

  Options:

    {
      remove: false
    }

## License

  MIT
