'use strict';
var ffi = require('ffi')
  , ref = require('ref')
  , Struct = require('ref-struct')
  , Dict = require('dict')
  , fd_t = ref.types.int
  , cc_t = ref.types.uchar
  , speed_t = ref.types.uint
  , tcflag_t = ref.types.uint
  , Termios = new Struct(
    { c_iflag: tcflag_t
    , c_oflag: tcflag_t
    , c_cflag: tcflag_t
    , c_lflag: tcflag_t
    , c_line: cc_t
    , c_cc: ref.refType(ref.types.void)
    , c_ispeed: speed_t
    , c_ospeed: speed_t
    })
  , TermiosPtr = ref.refType(Termios)
  , term = ffi.Library('libc'
    , { tcgetattr: [ref.types.int, [fd_t, TermiosPtr]]
      , tcsetattr: [ref.types.int, [fd_t, ref.types.int, TermiosPtr]]
      , cfsetspeed: [ref.types.int, [TermiosPtr, speed_t]]
      , cfsetispeed: [ref.types.int, [TermiosPtr, speed_t]]
      , cfsetospeed: [ref.types.int, [TermiosPtr, speed_t]]
      , cfgetispeed: [speed_t, [TermiosPtr]]
      })

for (var key in term) exports[key] = term[key]
exports.Termios = Termios
exports.speeds = new Dict(
  { 50: 1
  , 75: 2
  , 110: 3
  , 134: 4
  , 150: 5
  , 200: 6
  , 300: 7
  , 600: 8
  , 1200: 9
  , 1800: 10
  , 2400: 11
  , 4800: 12
  , 9600: 13
  , 19200: 14
  , 38400: 15
  , 57600: 4097
  , 115200: 4098
  , 230400: 4099
  , 460800: 4100
  , 500000: 4101
  , 576000: 4102
  , 921600: 4103
  , 1000000: 4104
  , 1152000: 4105
  , 1500000: 4106
  , 2000000: 4107
  , 2500000: 4108
  , 3000000: 4109
  , 3500000: 4110
  , 4000000: 4111
  })
