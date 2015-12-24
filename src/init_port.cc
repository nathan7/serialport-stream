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
  Nan::ThrowError(strerror(errno));
  return true;
}

NAN_METHOD(InitPort) {
  if (info.Length() < 2) {
    Nan::ThrowError("Wrong number of arguments");
    return;
  }

  if (!info[0]->IsNumber() || !info[1]->IsNumber()) {
    Nan::ThrowError("Wrong argument types");
    return;
  }

  int fd = info[0]->NumberValue();
  unsigned int baud = info[1]->NumberValue();

  speed_t speed = find_baud(baud);
  if (speed == 0) {
    Nan::ThrowError("Unknown baud rate");
    return;
  }

  struct termios termios;

  if (fail(tcgetattr(fd, &termios)))
    return;

  if (fail(cfsetspeed(&termios, speed)))
    return;

  cfmakeraw(&termios);

  if (fail(tcsetattr(fd, TCSADRAIN, &termios)))
    return;
}

NAN_METHOD(ValidBaud) {
  if (info.Length() < 1) {
    Nan::ThrowError("Wrong number of arguments");
    return;
  }

  if (!info[0]->IsNumber()) {
    Nan::ThrowError("Wrong argument types");
    return;
  }

  unsigned int baud = info[0]->NumberValue();

  info.GetReturnValue().Set(find_baud(baud) != 0);
}

NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("initPort").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(InitPort)).ToLocalChecked());
  Nan::Set(target, Nan::New("validBaud").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(ValidBaud)).ToLocalChecked());
}

NODE_MODULE(binding, Init)
