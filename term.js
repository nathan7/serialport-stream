#!/usr/bin/env node
var Serial = require('./')
process.stdin.setRawMode(true)
process.stdin.pipe(new Serial(process.argv[2], process.argv[3] | 0)).pipe(process.stdout)
