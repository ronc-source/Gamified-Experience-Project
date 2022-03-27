const express = require('express');
app = express();
serv = require('http').Server(app)

//app.use('/fer/', require('./routes/hello.js'))
//app.get('/', (req, res) => {
//    res.send('hello')
//});

const PORT = 3001;

serv.listen(PORT, () => {
    console.log('Listening on Port: ' + PORT)
})

/*#######
Main
#######*/

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

