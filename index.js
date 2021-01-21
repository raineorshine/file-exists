const fs = require('fs')
const path = require('path')

function fileExists (filepath, options, done) {
  if (typeof options === 'function') {
    done = options
    options = {}
  }
  const _options = options || {};

  if (!done) {
    return new Promise((resolve, reject) => {
      fs.stat(fullPath(filepath, _options), (err, stats) => {
        if (err) {
          return err.code === 'ENOENT'
            ? resolve(_options.not)
            : reject(err)
        }
        resolve(stats.isFile())
      })
    })
  }

  fs.stat(fullPath(filepath, _options), (err, stats) => {
    if (err) {
      return err.code === 'ENOENT'
        ? done(null, _options.not)
        : done(err)
    }

    const exists = stats.isFile()
    done(null, _options.not ? !exists : exists)
  })
}

fileExists.sync = function fileExistsSync (filepath, options) {
  const _filepath = filepath || '';
  const _options = options || {};
  try {
    const exists = fs.statSync(fullPath(_filepath, _options)).isFile()
    return _options.not ? !exists : exists
  }
  catch (e) {
    // Check exception. If ENOENT - no such file or directory ok, file doesn't exist.
    // Otherwise something else went wrong, we don't have rights to access the file, ...
    if (e.code != 'ENOENT') {
      throw e
    }

    return _options.not
  }
}

function fullPath (filepath, options) {
  const _options = options || {};
  const root = _options.root;
  return (root) ? path.join(root, filepath) : filepath
}

module.exports = fileExists
