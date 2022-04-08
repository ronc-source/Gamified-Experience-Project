//Service page component for the website - Uses bootstrap styling

import {useEffect, useState} from 'react'

const wSocket = new WebSocket("ws://localhost:3001");

function Service() {

    const [emotion, setEmotion] = useState(['']);
    const [webcamShowing, setwebcamShowing] = useState(['']);

    
    function testFunction(){
        startWebcam();
        //wSocket.send("request:emotion");
    };


    function verifyMessage(receivedData){

        const emotionClassifications = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'];
        let validMessage = false
    
        for(let i = 0; i < emotionClassifications.length; i++){
            if(emotionClassifications[i] === receivedData.trim()){
                validMessage = true;
            }
        }
    
        return validMessage;

    };


    
    //Video Player for Live Webcam Feed (Inspired from https://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm)
    function startWebcam(){
        let video = document.querySelector("#liveWebcam");

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true}).then( (streamData) => {
                video.srcObject = streamData;

                if(streamData.active){
                    setwebcamShowing('active');
                }

                
                //Image of stream
                //let capturedImage = new ImageCapture(streamData.getVideoTracks()[0]).grabFrame()

                //wSocket.send(["request:emotion", capturedImage]);

            }).catch( (error) => {
                console.log("Error Loading Webcam: ", error);
            })

        } else {
            alert("getUserMedia API Not Supported for this Browser.");
        }
    
    };
    

    wSocket.addEventListener("message", (capturedEmotion) =>{

        //Makes sure that the message is for updating emotions before we do any updates
        if(verifyMessage(capturedEmotion.data)){

            //Update variable using react hook
            setEmotion(capturedEmotion.data);
        }

    });

    /* Uncomment after test (Automated canvas Drawing)
    useEffect(() => {

        var drawingInterval;

        if(webcamShowing === 'active'){
            drawingInterval = setInterval(drawOnCanvas, 1000);
        } else if (webcamShowing === 'in-active'){
            //needs fix on stopping
            clearInterval(drawingInterval);
        }

    });
    */


    function drawOnCanvas(){
        let video = document.querySelector("#liveWebcam");
        let imageCanvas = document.querySelector("#imageCanvas");
        //Code to hide Canvas:
        //imageCanvas.style.display = "none";

        imageCanvas.getContext('2d').drawImage(video, 0, 0, imageCanvas.width, imageCanvas.height);
            
        let extractedImageURL = imageCanvas.toDataURL('image/jpeg');
        //console.log(extractedImageURL)
        wSocket.send(["request:emotion", extractedImageURL]);

    }

    return (
        <div>
            <h1>Service Page Component</h1>
            <button onClick = {() => testFunction()}>Test</button>
            <pre></pre>
            <button onClick = {() => setwebcamShowing('in-active')}>Stop</button>
            <pre></pre>
            <button onClick = {() => drawOnCanvas()}>GET EMOTION</button>
            <p>{ emotion }</p>
            <video id = "liveWebcam" autoPlay></video>
            <canvas id = "imageCanvas" width = "640" height = "480"></canvas>
        </div>
    );
}

export default Service;