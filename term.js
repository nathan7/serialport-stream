#!/usr/bin/env node
var port = process.argv[2]
  , baud = process.argv[3]

if (process.argv.length < (2 + 1) || process.argv.length > (2 + 2) || (baud && !baud.match(/^\d+$/))) {
  console.log('usage: term <port> [baudrate]')
  process.exit(1)
}

var Serial = require('./')
  , fs = require('fs')

process.stdin.setRawMode(true)
process.stdin.pipe(new Serial(process.argv[2], process.argv[3] | 0)).pipe(process.stdout)
