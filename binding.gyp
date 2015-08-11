{
  "targets": [{
    "target_name": "binding",
    "sources": ["src/init_port.cc", "src/find_baud.cc"],
    "include_dirs": [
      "<!(node -e \"require('nan')\")",
    ],
  }],
}
