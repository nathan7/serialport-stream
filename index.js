'use strict';
var inherits = require('util').inherits
  , Stream = require('stream')
  , DuplexStream = Stream.Duplex
  , fs = require('fs')
  , binding = require('bindings')('binding.node')

module.exports = exports = Serial
inherits(Serial, DuplexStream)
function Serial(port, baud) { var self = this
  DuplexStream.call(this)

  port = port || '/dev/ttyS0'
  baud = (baud | 0) || 115200
  if (!binding.validBaud(baud)) throw new Error('invalid baud rate ' + baud)

  this._fd = null
  fs.open(port, 'r+', function(err, fd) {
    if (err) return self.emit('error', err)
    self._fd = fd

    binding.initPort(fd, baud)

    self._readStream = fs.createReadStream(port, { fd: fd })
    self._readStream.on('error', function(err) { self.emit('error', err) })
    self._writeStream = fs.createWriteStream(port, { fd: fd })
    self._writeStream.on('error', function(err) { self.emit('error', err) })

    self.emit('open')
  })
}

function whenOpen(self, cb) {
  if (self._fd === null)
    self.once('open', cb)
  else
    cb.call(self)
}

Serial.prototype._read = function(size) {
  whenOpen(this, function() { var self = this
    this._readStream.on('readable', function() {
      self.push(this.read(size))
    })
  })
}

Serial.prototype._write = function(chunk, encoding, cb) {
  whenOpen(this, function() {
    this._writeStream.write(chunk, encoding, cb)
  })
}

Serial.prototype.close = function(cb) { var self = this
  var fd = this._fd
  this._fd = this._writeStream = this._readStream = null
  this.writable = false
  fs.close(fd, function(err) {
    if (err) self.emit('error', err)
  })
}
