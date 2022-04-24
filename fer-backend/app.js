//Setting up a WebSocket Server
const wServer = require('ws');
const wSocket = new wServer.Server({port: 3001});
const { Worker, workerData, parentPort} = require('worker_threads');
const { spawn } = require('child_process');
const { range } = require('express/lib/request');
const childPython = spawn('python', ['FaceDetect.py']);

//Setting up SQL Server Connection to Postgres DB
const {Pool} = require("pg");
const { isNull } = require('util');

const postgresDB = new Pool({
    user: "postgres",
    host: "localhost",
    database: "uOttawa_FER",
    password: "Newtrial2017",
    port: 5432
});


const websocketList = []
//Main (User Connection Event)
wSocket.on('connection', ws => {
    
    //Set a custom ID to the websocket Connection
    const clientWebSocketID = Math.floor(1 + (10000000 * Math.random()));
    websocketList.push([clientWebSocketID, ws]);
    console.log("Client " + clientWebSocketID + " has joined.");

    ws.on('message', data => {
        receivedData = `${data}`.split(",");

        //Message is to request face detection for emotion
        if(receivedData[0] == "request:emotion"){
            //Python Script Component 

            receivedImageData = receivedData[1] + "," + receivedData[2];
            receivedImageData = receivedImageData.trim();

            async function emotionService(){
                let result = await runEmotionScript();
            }

            emotionService();
        }

        //Message is to send data to SQL Table
        if(`${data}`.slice(0,11) == "request:SQL"){
            var SQLDATA = `${data}`.split("request:SQL")[1].split(",");
            SQLDATA = SQLDATA.slice(1,SQLDATA.length);
            
            for(let i = 0; i < SQLDATA.length; i++)
            {
                if(SQLDATA[i] == '')
                {
                    SQLDATA[i] = null;
                }
            }
            console.log(SQLDATA);
            
            const insertText = `
                INSERT INTO "Emotion History" ("First Name", "Last Name", "Game Played", "Angry Emotion %", "Angry Encounter Timestamp", "Disgust Emotion %", "Disgust Encounter Timestamp",
                "Fear Emotion %",
                "Fear Encounter Timestamp", "Happy Emotion %", "Happy Encounter Timestamp", "Neutral Emotion %", "Neutral Encounter Timestamp",
                "Sad Emotion %", "Sad Encounter Timestamp", "Surprise Emotion %", "Surprise Encounter Timestamp", "Session Start", "Session End", "userid")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            `;
            postgresDB.query(insertText, SQLDATA);
        }


        //Handle Getting SQL Data
        if(receivedData[0] == "request:HISTORY"){
            const selectText = `SELECT * FROM "Emotion History" WHERE userID = $1`;

            async function getHistory(){
                var queryID = receivedData[1];
                if(queryID === "" || queryID === null || isNaN(Number(queryID))){
                    queryID = 0; //default so it doesnt crash
                }
                let result = await postgresDB.query(selectText, [queryID]);
                return result;
            }

            let historyQuery = getHistory();
            
            historyQuery.then((result) => {
                websocketList.forEach(ws => {
                    ws[1].send(JSON.stringify(result.rows));
                });
            });

            //console.log(historyQuery);
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


