#include <node.h>
#include <nan.h>

#include <string.h>
#include <termios.h>
#include "find_baud.h"

using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;

bool fail(int ret) {
  if (ret == 0)
    return false;
  NanThrowError(strerror(errno));
  return true;
}

NAN_METHOD(InitPort) {
  NanScope();

  if (args.Length() < 2) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }

  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    NanThrowTypeError("Wrong argument types");
    NanReturnUndefined();
  }

  int fd = args[0]->NumberValue();
  unsigned int baud = args[1]->NumberValue();

  speed_t speed = find_baud(baud);
  if (speed == 0) {
    NanThrowError("Unknown baud rate");
    NanReturnUndefined();
  }

  struct termios termios;

  if (fail(tcgetattr(fd, &termios)))
    NanReturnUndefined();

  if (fail(cfsetspeed(&termios, speed)))
    NanReturnUndefined();

  cfmakeraw(&termios);

  if (fail(tcsetattr(fd, TCSADRAIN, &termios)))
    NanReturnUndefined();

  NanReturnUndefined();
}

NAN_METHOD(ValidBaud) {
  NanScope();

  if (args.Length() < 1) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }

  if (!args[0]->IsNumber()) {
    NanThrowTypeError("Wrong argument types");
    NanReturnUndefined();
  }

  unsigned int baud = args[0]->NumberValue();

  NanReturnValue(find_baud(baud) != 0);
}

void Init(Handle<Object> exports) {
  exports->Set(NanNew<String>("initPort"),
    NanNew<FunctionTemplate>(InitPort)->GetFunction());
  exports->Set(NanNew<String>("validBaud"),
    NanNew<FunctionTemplate>(ValidBaud)->GetFunction());
}

NODE_MODULE(binding, Init)
