'use strict';

var workerHandle = null;
var timerHandle = null;

function startWorker(callParams) {
  console.info('worker starts with params: ', callParams);
  workerHandle = new Worker('scripts/worker.js');
  workerHandle.postMessage(['init', callParams]);
}

function stopWorker() {
  workerHandle.terminate();
  clearInterval(timerHandle);

  workerHandle = null;
  timerHandle = null;
}

$(function() {
  $('.js-to-worker-start').on('click', function() {
    console.info('Starting the "to worker test"');

    startWorker({
      type: 'toWorker',
      answer: $(this).hasClass('js-no-answer')
    });

    timerHandle = setInterval(function() {
      console.log('posting msg');
      workerHandle.postMessage('42');
    }, 10);
  });

  $('.js-to-worker-end').on('click', stopWorker);
});
