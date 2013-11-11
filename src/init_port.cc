#include <node.h>

#include <string.h>
#include <termios.h>
#include "find_baud.h"

using namespace v8;

bool fail(int ret) {
  if (ret == 0)
    return false;
  ThrowException(Exception::Error(String::New(strerror(ret))));
  return true;
}

Handle<Value> InitPort(const Arguments& args) {
  HandleScope scope;

  if (args.Length() < 2) {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined());
  }

  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    ThrowException(Exception::TypeError(String::New("Wrong argument types")));
    return scope.Close(Undefined());
  }

  int fd = args[0]->NumberValue();
  unsigned int baud = args[1]->NumberValue();

  speed_t speed = find_baud(baud);
  if (speed == 0) {
    ThrowException(Exception::Error(String::New("Unknown baud rate")));
    return scope.Close(Undefined());
  }

  struct termios termios;

  if (fail(tcgetattr(fd, &termios)))
    return scope.Close(Undefined());

  if (fail(cfsetspeed(&termios, speed)))
    return scope.Close(Undefined());

  if (fail(cfmakeraw(&termios)))
    return scope.Close(Undefined());

  if (fail(tcsetattr(fd, TCSADRAIN, &termios)))
    return scope.Close(Undefined());

  return scope.Close(Undefined());
}

Handle<Value> ValidBaud(const Arguments& args) {
  HandleScope scope;

  if (args.Length() < 1) {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined());
  }

  if (!args[0]->IsNumber()) {
    ThrowException(Exception::TypeError(String::New("Wrong argument types")));
    return scope.Close(Undefined());
  }

  unsigned int baud = args[0]->NumberValue();

  return scope.Close(Boolean::New(find_baud(baud) != 0));
}

void Init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("initPort"),
      FunctionTemplate::New(InitPort)->GetFunction());
  exports->Set(String::NewSymbol("validBaud"),
      FunctionTemplate::New(ValidBaud)->GetFunction());
}

NODE_MODULE(binding, Init)
