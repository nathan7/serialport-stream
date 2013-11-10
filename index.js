'use strict';
var inherits = require('util').inherits
  , Stream = require('stream')
  , DuplexStream = Stream.Duplex
  , fs = require('fs')
  , internals = require('./internals')
  , Termios = internals.Termios
  , tcgetattr = internals.tcgetattr
  , tcsetattr = internals.tcsetattr
  , cfsetspeed = internals.cfsetspeed
  , speeds = internals.speeds

module.exports = exports = Serial
inherits(Serial, DuplexStream)
function Serial(port, baud) { var self = this
  DuplexStream.call(this)

  baud = (baud | 0) || 115200
  if (!speeds.has(baud.toString())) throw new Error('invalid baud rate ' + baud)

  this._fd = null
  fs.open(port, 'r+', function(err, fd) {
    if (err) return self.emit('error', err)
    self._fd = fd

    var termios = new Termios()
    if (tcgetattr(fd, termios.ref()) !== 0)
      return self.emit('error', new Error('failed to get port attributes'))
    if (cfsetspeed(termios.ref(), speeds.get(baud.toString())) !== 0)
      return self.emit('error', new Error('failed to set port speed'))
    if (tcsetattr(fd, 0, termios.ref()) !== 0)
      return self.emit('error', new Error('failed to set port attributes'))

    self._readStream = fs.createReadStream(port, { fd: fd })
    self._readStream.on('error', function(err) { self.emit('error', err) })
    self._writeStream = fs.createWriteStream(port, { fd: fd })
    self._writeStream.on('error', function(err) { self.emit('error', err) })

    self.emit('open')
  })
}

function whenOpen(self, cb) {
  if (self._fd === null)
    self.on('open', cb)
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
