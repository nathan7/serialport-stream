#!/usr/bin/env node
var port = process.argv[2]
var baud = process.argv[3]

if (process.argv.length < (2 + 1) || process.argv.length > (2 + 2) || (baud && !baud.match(/^\d+$/))) {
  console.log('usage: term <port> [baudrate]')
  process.exit(1)
}

var Serial = require('./')

process.stdin.setRawMode(true)
process.stdin.pipe(new Serial(port, baud | 0)).pipe(process.stdout)
