const {workerData, parentPort} = require('worker_threads');
console.log(workerData);
receivedImageData = workerData[0];
childPython = workerData[1];


//pass image data to python process
childPython.stdin.write(JSON.stringify(receivedImageData) + '\n');

//print any data from the output of the python file
childPython.stdout.on('data', (data) => {
    console.log(`${data}`);

    const modelEmotion = `${data}`;
    //Send data back to main thread
    parentPort.postMessage( modelEmotion.trim());

});

//Print out any error from the python file
childPython.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});


//print out what happens on close
childPython.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
})

