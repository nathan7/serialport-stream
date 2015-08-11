#!/usr/bin/env node
'use strict'
var fs = require('fs')
var out
function log (str) { out.write(str + '\n') }

var prototype = 'speed_t find_baud(unsigned int baud)'

out = fs.createWriteStream('find_baud.h')
log([
  '#include <termios.h>',
  prototype + ';'
].join('\n'))

out = fs.createWriteStream('find_baud.cc')
log([
  '#include "find_baud.h"',
  prototype + ' {'
].join('\n'))

;[50, 75, 110, 134, 150, 200, 300, 600, 1200, 1800, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400]
  .forEach(function (baud) {
    var posix = baud <= 38400 // POSIX standardised <=38400 baud rates
    if (!posix) log('#ifdef B' + baud)
    log('  if (baud == ' + baud + ') return B' + baud + ';')
    if (!posix) log('#endif')
  })

log([
  '  return 0;',
  '}'
].join('\n'))
