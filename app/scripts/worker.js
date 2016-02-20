'use strict';

var noOp = function() {};
function doExpensiveOperation() {
  var i;
  for (i = 0; i < Math.pow(2, 23); i++) {
    i * i;
  }
}

function log(msg) {
  console.debug('Worker: ', msg);
}

var currentHandler = noOp;

var handlers = {
  toWorker: function(params) {
    log('init toWorker with ', params);
    var answerFN = noOp;
    if (params.answer) {
      answerFN = function() {
        self.postMessage(42);
      }
    }

    return function (e) {
      log('received msg');
      doExpensiveOperation();
    };
  }
}

onmessage = function(e) {
  if (e.data && e.data[0] === 'init') {
    var params = e.data[1];
    log('Starting worker with the following params: ', params);
    currentHandler = handlers[params.type](params);
  } else {
    currentHandler(e);
  }
}
