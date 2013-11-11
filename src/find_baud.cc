#include "find_baud.h"
speed_t find_baud(unsigned int baud) {
  if (baud == 50) return B50;
  if (baud == 75) return B75;
  if (baud == 110) return B110;
  if (baud == 134) return B134;
  if (baud == 150) return B150;
  if (baud == 200) return B200;
  if (baud == 300) return B300;
  if (baud == 600) return B600;
  if (baud == 1200) return B1200;
  if (baud == 1800) return B1800;
  if (baud == 2400) return B2400;
  if (baud == 4800) return B4800;
  if (baud == 9600) return B9600;
  if (baud == 19200) return B19200;
  if (baud == 38400) return B38400;
#ifdef B57600
  if (baud == 57600) return B57600;
#endif
#ifdef B115200
  if (baud == 115200) return B115200;
#endif
#ifdef B230400
  if (baud == 230400) return B230400;
#endif
  return 0;
}
