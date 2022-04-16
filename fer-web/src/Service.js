//Service page component for the website - Uses bootstrap styling

import {useEffect, useState} from 'react'

const wSocket = new WebSocket("ws://localhost:3001");

function Service() {

    const [emotion, setEmotion] = useState(['']);
    const [webcamShowing, setwebcamShowing] = useState(['']);

    
    function testFunction(){
        startWebcam();
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
                    const drawingInterval = setInterval(drawOnCanvas, 1000);
                }


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
            setEmotion(capturedEmotion.data[0].toUpperCase() + capturedEmotion.data.slice(1));
        }

    });



    function drawOnCanvas(){
        let video = document.querySelector("#liveWebcam");
        let imageCanvas = document.querySelector("#imageCanvas");

        //Code to hide Canvas:
        imageCanvas.style.display = "none";

        imageCanvas.getContext('2d').drawImage(video, 0, 0, imageCanvas.width, imageCanvas.height);
            
        let extractedImageURL = imageCanvas.toDataURL('image/jpeg');
        //console.log(extractedImageURL)
        wSocket.send(["request:emotion", extractedImageURL]);

    }

    return (
        <div>
            <div className = "container-fluid bg-light">
                <h1>Service Page Component</h1>
                <div className = "btn-toolbar btn-toolbar-toggle gap-2 justify-content-center">
                    <button onClick = {() => testFunction() } className = "btn btn-success btn-lg">Start Session</button>
                    <button onClick = {() => setwebcamShowing('in-active')} className = "btn btn-danger btn-lg">Stop</button>
                </div>

                
                <div >
                    <table>
                        <tbody>
                            <tr>
                                <td className = "border border-dark border-4">
                                    <video id = "liveWebcam" autoPlay width = "640" height = "480"></video>
                                    <p className = "text-center fw-bold">Current Emotion: { emotion }</p>
                                </td>
                                <td className = "padding-left">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
            <canvas id = "imageCanvas" width = "640" height = "480"></canvas>
        </div>
    );
}

export default Service;