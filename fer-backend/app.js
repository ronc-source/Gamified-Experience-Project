//Setting up a WebSocket Server
const wServer = require('ws');
const wSocket = new wServer.Server({port: 3001});
const { Worker, workerData, parentPort} = require('worker_threads');
const { spawn } = require('child_process');
const { range } = require('express/lib/request');
const childPython = spawn('python', ['FaceDetect.py']);

const websocketList = []
//Main (User Connection Event)
wSocket.on('connection', ws => {
    
    //Set a custom ID to the websocket Connection
    const clientWebSocketID = Math.floor(1 + (10000000 * Math.random()));
    websocketList.push([clientWebSocketID, ws]);
    console.log("Client " + clientWebSocketID + " has joined.");

    ws.on('message', data => {
        receivedData = `${data}`.split(",");

        //console.log("RECEIVED DATA: ", receivedData);
        
        if(receivedData[0] == "request:emotion"){
            //Python Script Component 

            receivedImageData = receivedData[1] + "," + receivedData[2];
            receivedImageData = receivedImageData.trim();

            async function emotionService(){
                let result = await runEmotionScript();
            }

            emotionService();


        }
    });

    //On Client Disconnect, remove them from the master list of connections
    ws.addEventListener('close', () => {

        for(let i = 0; i < websocketList.length; i++)
        {
            if(websocketList[i][0] == clientWebSocketID)
            {
                websocketList.splice(i, 1);
            }
        }
        
        console.log("Client: " + clientWebSocketID + " disonnected.");
    });


    function runEmotionScript(){
        return new Promise((resolve, reject) => {
            //pass image data to python process
            childPython.stdin.write(JSON.stringify(receivedImageData) + '\n');

            //print any data from the output of the python file
            childPython.stdout.once('data', (data) => {
                //console.log(`${data}`);

                const modelEmotion = `${data}`;
                //Send data back to main thread

                //ws.send(modelEmotion);
                websocketList.forEach(ws => {
                    ws[1].send(modelEmotion);
                });
                resolve();

            });
        });
    }

    

});


