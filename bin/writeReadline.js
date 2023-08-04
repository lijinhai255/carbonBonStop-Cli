#!/usr/bin/env node

function onkeypress(s) {
  output.write(s);
  line += s;
  switch (s) {
    case "\r":
      input.pause();
      callback(line);
      line = "";
      break;
  }
}
function stepRead(callback) {
  const input = process.stdin;
  const output = process.stdout;
  function onkeypress(s) {
    output.write(s);
    line += s;
    switch (s) {
      case "\r":
        input.pause();
        callback(line);
        line = "";
        break;
    }
  }
  input.setEncoding("utf8");
  input.setRawMode(true);
  input.on("keypress", onkeypress);
  input.on("data", function (data) {
    output.write(data);
  });
  input.on("end", function () {
    process.exit(0);
  });
}

function stepWrite(data, callback) {
  const output = process.stdout;
  output.write(data);
  callback(data);
}

function stepProcess(data, callback) {
  let line = "";
  function onkeypress(s) {
    output.write(s);
    line += s;
    switch (s) {
      case "\r":
        input.pause();
        callback(line);
        line = "";
        break;
    }
  }
  emitKeypressEvents(input);
  input.on("keypress", onkeypress);
  input.resume();
}

function emitKeypressEvents(stream) {
  function onData(chunk) {
    g.next(chunk.toString());
  }
  const g = emitKeys(stream);
  g.next();
  stream.on("data", onData);
}
function* emitKeys(stream) {
  while (true) {
    let ch = yield;
    stream.emit("keypress", ch);
  }
}

stepRead(function (s) {
  console.log("anwers");
});
