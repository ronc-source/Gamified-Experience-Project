//Setting up a WebSocket Server
const wServer = require('ws');
const wSocket = new wServer.Server({port: 3001});
const { spawn } = require('child_process');

//Main (User Connection Event)
wSocket.on('connection', ws => {
    console.log("User Joined");

    ws.on('message', data => {
        receivedData = `${data}`.split(",");

        //console.log("RECEIVED DATA: ", receivedData);
        
        if(receivedData[0] == "request:emotion"){
            //Python Script Component (tutorial)

            receivedImageData = receivedData[1] + "," + receivedData[2];

            const childPython = spawn('python', ['FaceDetect.py']);

            //pass image data to python process
            childPython.stdin.write(JSON.stringify(receivedImageData.trim()) + '\n');

            //print any data from the output of the python file
            childPython.stdout.on('data', (data) => {
                console.log(`${data}`);
                ws.send(`${data}`);

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




/*
const express = require('express');
app = express();
serv = require('http').Server(app)


const PORT = 3001;

serv.listen(PORT, () => {
    console.log('Listening on Port: ' + PORT)
})

#######
#Main
#######

//server startup
var io = require('socket.io')(serv,{
    cors: {
        //React Address
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});



// user connection event
io.sockets.on('connection', function(socket){
    console.log("User joined");


    socket.on('getEmotion', function(){
        //Python Script Component (tutorial)
        const { spawn } = require('child_process');

        const childPython = spawn('python', ['FaceDetect.py']);

        //print any data from the output of the python file
        childPython.stdout.on('data', (data) => {
            console.log(`${data}`);
            socket.emit('displayEmotion', `${data}`);

        });


        //Print out any error from the python file
        childPython.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });


        //print out what happens on close
        childPython.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        })

    });

});

*/