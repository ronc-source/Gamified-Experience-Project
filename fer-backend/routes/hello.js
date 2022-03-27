const express = require('express');
router = express.Router();



//Python Script Component (tutorial)
const { spawn } = require('child_process');

const childPython = spawn('python', ['FaceDetect.py']);

//print any data from the output of the python file
childPython.stdout.on('data', (data) => {
    console.log(`${data}`);

    router.get('/', function(req, res) {
        res.json({
            "hello":[`${data}`]
        })
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



// for the hello.js controller (tutorial)
module.exports = router