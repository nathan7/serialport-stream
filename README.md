# serialport-stream

  Serial ports as streams.

## Installation

    npm install serialport-stream

## API
### new Serial(port = '/dev/ttyS0', baud = 115200)

  Returns a new serial [duplex stream](http://nodejs.org/api/stream.html#stream_class_stream_duplex).

#### serial.close()

  Close the port.

## Compatibility

  This is currently implemented with node-ffi.
  Compatible with anything that happens to have compatible tcgetattr/tcsetattr/csetspeed *and* the same termios struct.
  Help with doing this with a sane native module is welcome.

