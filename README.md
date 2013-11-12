# serialport-stream

  Serial ports as streams.

## Installation

    npm install serialport-stream

## API
### new Serial(port = '/dev/ttyS0', baud = 115200)

  Returns a new serial [duplex stream](http://nodejs.org/api/stream.html#stream_class_stream_duplex).

#### serial.close()

  Close the port.

#### event 'open'

  Emitted when the port is opened.
  Unlike with node-serialport, you don't need to wait for this event to start reading or writing. Streams all the way.

## Compatibility

  This is currently implemented with a POSIX-only native binding.
  If you'd want to implement [Windows compat](https://github.com/nathan7/serialport-stream/issues/1), that'd rock.

