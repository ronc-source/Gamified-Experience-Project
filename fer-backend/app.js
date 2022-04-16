//Setting up a WebSocket Server
const wServer = require('ws');
const wSocket = new wServer.Server({port: 3001});
const { Worker, workerData, parentPort} = require('worker_threads');
const { spawn } = require('child_process');
const childPython = spawn('python', ['FaceDetect.py']);

const websocketList = []
//Main (User Connection Event)
wSocket.on('connection', ws => {
    console.log("User Joined");

    websocketList.push(ws);

    ws.on('message', data => {
        receivedData = `${data}`.split(",");

        //console.log("RECEIVED DATA: ", receivedData);
        
        if(receivedData[0] == "request:emotion"){
            //Python Script Component 

            receivedImageData = receivedData[1] + "," + receivedData[2];
            receivedImageData = receivedImageData.trim();

            //pass image data to python process
            childPython.stdin.write(JSON.stringify(receivedImageData) + '\n');

            //print any data from the output of the python file
            childPython.stdout.on('data', (data) => {
                //console.log(`${data}`);

                const modelEmotion = `${data}`;
                //Send data back to main thread

                //ws.send(modelEmotion);
                websocketList.forEach(ws => {
                    ws.send(modelEmotion);
                });

            });

            //Print out any error from the python file
            childPython.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });


            //print out what happens on close
            childPython.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            })


        }
    });

    

});
