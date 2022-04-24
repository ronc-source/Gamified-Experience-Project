//Service page component for the website - Uses bootstrap styling

import {useState} from 'react'
import {Bar, Line} from 'react-chartjs-2'
import {Chart as ChartJS} from 'chart.js/auto'

import {wSocket} from './socketClient.js'


var intervalIdentifier;

var firstName = "";
var lastName = "";
var gamePlayed = "";
var userID = "";

var angryEmotion = 0;
var disgustEmotion = 0;
var fearEmotion = 0;
var happyEmotion = 0;
var neutralEmotion = 0;
var sadEmotion = 0;
var surpriseEmotion = 0;
var emotionTotalCount = 0;

var angryTimeStamp = "";
var disgustTimeStamp = "";
var fearTimeStamp = "";
var happyTimeStamp = "";
var neutralTimeStamp = "";
var sadTimeStamp = "";
var surpriseTimeStamp = "";

var sessionStartTimeStamp = "";
var sessionEndTimeStamp = "";



function Service() {
    const [emotion, setEmotion] = useState(['']);


    //Start Session Function
    function startSession(){
        let dataGraphs = document.getElementById("dataGraphs");
        dataGraphs.style.display = "none";
        resetEverything();
        sessionStartTimeStamp = reformatTime(new Date().toISOString().split("T"));
        startWebcam();
    };


    //Stop Session Function
    function stopSession(){
        if(intervalIdentifier !== null)
        {
            clearInterval(intervalIdentifier);

            let video = document.querySelector("#liveWebcam");
            if(video.srcObject.active)
            {
                for(let i = 0; i < video.srcObject.getTracks().length; i++)
                {
                    video.srcObject.getTracks()[i].stop();
                }
            }

            setEmotion("");

            //Send SQL Data to Backend Server
            sessionEndTimeStamp = reformatTime(new Date().toISOString().split("T"));
            var SQLArray = [firstName, lastName, gamePlayed, 
                            getEmotionPercentage('angry'), angryTimeStamp,
                            getEmotionPercentage('disgust'), disgustTimeStamp,
                            getEmotionPercentage('fear'), fearTimeStamp,
                            getEmotionPercentage('happy'), happyTimeStamp,
                            getEmotionPercentage('neutral'), neutralTimeStamp,
                            getEmotionPercentage('sad'), sadTimeStamp,
                            getEmotionPercentage('surprise'), surpriseTimeStamp,
                            sessionStartTimeStamp, sessionEndTimeStamp, userID                        
                            ];
            
            let dataGraphs = document.getElementById("dataGraphs");
            dataGraphs.style.display = "block";

            wSocket.send(["request:SQL", [SQLArray]]);
        }
    };


    //Helper Functions

    //Update User Input Values
    const getFirstName = (e) => {
        firstName = e.target.value;
    }

    const getLastName = (e) => {
        lastName = e.target.value;
    }

    const getGamePlayed = (e) => {
        gamePlayed = e.target.value;
    }

    const getUserID = (e) => {
        userID = e.target.value;
    }

    //Video Player for Live Webcam Feed (Inspired from https://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm)
    function startWebcam(){
        let video = document.querySelector("#liveWebcam");

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true}).then( (streamData) => {
                video.srcObject = streamData;

                if(streamData.active){
                    intervalIdentifier = setInterval(drawOnCanvas, 1000);
                }

            }).catch( (error) => {
                console.log("Error Loading Webcam: ", error);
            })

        } else {
            alert("getUserMedia API Not Supported for this Browser.");
        }
    
    };


    function drawOnCanvas(){
        let video = document.querySelector("#liveWebcam");
        let imageCanvas = document.querySelector("#imageCanvas");

        //Code to hide Canvas:
        imageCanvas.style.display = "none";

        imageCanvas.getContext('2d').drawImage(video, 0, 0, imageCanvas.width, imageCanvas.height);
            
        let extractedImageURL = imageCanvas.toDataURL('image/jpeg');
        wSocket.send(["request:emotion", extractedImageURL]);

    };


    function verifyMessage(receivedData){

        const emotionClassifications = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'];
        let validMessage = false
    
        for(let i = 0; i < emotionClassifications.length; i++){
            if(emotionClassifications[i] === receivedData.trim()){
                validMessage = true;
                emotionTotalCount++;

               switch(emotionClassifications[i]) {
                case 'angry':
                    angryEmotion = angryEmotion + 1;
                    angryTimeStamp = reformatTime(new Date().toISOString().split("T"));
                    break;
                case 'disgust':
                    disgustEmotion = disgustEmotion + 1;
                    disgustTimeStamp = reformatTime(new Date().toISOString().split("T"));
                    break;
                case 'fear':
                    fearEmotion = fearEmotion + 1;
                    fearTimeStamp = reformatTime(new Date().toISOString().split("T"));
                    break;
                case 'happy':
                    happyEmotion = happyEmotion + 1;
                    happyTimeStamp = reformatTime(new Date().toISOString().split("T"));
                    break;
                case 'neutral':
                    neutralEmotion = neutralEmotion + 1;
                    neutralTimeStamp = reformatTime(new Date().toISOString().split("T"));
                    break;
                case 'sad':
                    sadEmotion = sadEmotion + 1;
                    sadTimeStamp = reformatTime(new Date().toISOString().split("T"));
                    break;
                case 'surprise':
                    surpriseEmotion = surpriseEmotion + 1;
                    surpriseTimeStamp = reformatTime(new Date().toISOString().split("T"));
                    break;
                default:
                    break;
                }

                updateAllPercentages()
            }
        }
        return validMessage;

    };

    
    function getEmotionPercentage(emotion){
        switch(emotion) {
            case 'angry':
                if(angryEmotion !== 0 && emotionTotalCount !== 0)
                {
                    return Math.round((angryEmotion / emotionTotalCount) * 100)
                } else {
                    return 0
                }
            case 'disgust':
                if(disgustEmotion !== 0 && emotionTotalCount !== 0)
                {
                    return Math.round((disgustEmotion / emotionTotalCount) * 100)
                } else {
                    return 0
                }
            case 'fear':
                if(fearEmotion !== 0 && emotionTotalCount !== 0)
                {
                    return Math.round((fearEmotion / emotionTotalCount) * 100)
                } else {
                    return 0
                }
            case 'happy':
                if(happyEmotion !== 0 && emotionTotalCount !== 0)
                {
                    return Math.round((happyEmotion / emotionTotalCount) * 100)
                } else {
                    return 0
                }
            case 'neutral':
                if(neutralEmotion !== 0 && emotionTotalCount !== 0)
                {
                    return Math.round((neutralEmotion / emotionTotalCount) * 100)
                } else {
                    return 0
                }
            case 'sad':
                if(sadEmotion !== 0 && emotionTotalCount !== 0)
                {
                    return Math.round((sadEmotion / emotionTotalCount) * 100)
                } else {
                    return 0
                }
            case 'surprise':
                if(surpriseEmotion !== 0 && emotionTotalCount !== 0)
                {
                    return Math.round((surpriseEmotion / emotionTotalCount) * 100)
                } else {
                    return 0
                }
            default:
                return 0
        }
    }


    function updateAllPercentages()
    {
        let angryElement = document.getElementById("AngryPercentage");
        let disgustElement = document.getElementById("DisgustPercentage");
        let fearElement = document.getElementById("FearPercentage");
        let happyElement = document.getElementById("HappyPercentage");
        let neutralElement = document.getElementById("NeutralPercentage");
        let sadElement = document.getElementById("SadPercentage");
        let surpriseElement = document.getElementById("SurprisePercentage");

        angryElement.innerHTML = "Angry: " + getEmotionPercentage('angry') + "%";
        disgustElement.innerHTML = "Disgust: " + getEmotionPercentage('disgust') + "%";
        fearElement.innerHTML = "Fear: " + getEmotionPercentage('fear') + "%";
        happyElement.innerHTML = "Happy: " + getEmotionPercentage('happy') + "%";
        neutralElement.innerHTML = "Neutral: " + getEmotionPercentage('neutral') + "%";
        sadElement.innerHTML = "Sad: " + getEmotionPercentage('sad') + "%";
        surpriseElement.innerHTML = "Surprise: " + getEmotionPercentage('surprise') + "%";
    }


    function resetEverything()
    {
        angryEmotion = 0;
        disgustEmotion = 0;
        fearEmotion = 0;
        happyEmotion = 0;
        neutralEmotion = 0;
        sadEmotion = 0;
        surpriseEmotion = 0;
        emotionTotalCount = 0

        angryTimeStamp = "";
        disgustTimeStamp = "";
        fearTimeStamp = "";
        happyTimeStamp = "";
        neutralTimeStamp = "";
        sadTimeStamp = "";
        surpriseTimeStamp = "";

        sessionStartTimeStamp = "";
        sessionEndTimeStamp = "";

        let angryElement = document.getElementById("AngryPercentage");
        let disgustElement = document.getElementById("DisgustPercentage");
        let fearElement = document.getElementById("FearPercentage");
        let happyElement = document.getElementById("HappyPercentage");
        let neutralElement = document.getElementById("NeutralPercentage");
        let sadElement = document.getElementById("SadPercentage");
        let surpriseElement = document.getElementById("SurprisePercentage");

        angryElement.innerHTML = "Angry: " + 0 + "%";
        disgustElement.innerHTML = "Disgust: " + 0 + "%";
        fearElement.innerHTML = "Fear: " + 0 + "%";
        happyElement.innerHTML = "Happy: " + 0 + "%";
        neutralElement.innerHTML = "Neutral: " + 0 + "%";
        sadElement.innerHTML = "Sad: " + 0 + "%";
        surpriseElement.innerHTML = "Surprise: " + 0 + "%";
    }


    function reformatTime(timeStamp){
        return timeStamp[0] + " " + String(Number(timeStamp[1].slice(0,2))) + timeStamp[1].slice(2, timeStamp[1].length-2);
    }


    function getMinutes(emotionTimeStamp, startTimeStamp){
        if(emotionTimeStamp !== "" && startTimeStamp !== "")
        {
            var emotionValues = emotionTimeStamp.split(" ")[1].split(".")[0].split(":");
            var startValues = startTimeStamp.split(" ")[1].split(".")[0].split(":");
            
            var emotionMinutes = (Number(emotionValues[0]) * 60) + Number(emotionValues[1]) + Number(emotionValues[2] / 60);
            var startMinutes = (Number(startValues[0]) * 60) + Number(startValues[1]) + (Number(startValues[2]) / 60);
    
            var sessionDuration = (emotionMinutes - startMinutes).toFixed(2);
            return sessionDuration;
        } else {
            return 0;
        }
    }

    function showLine(emotion){
        switch(emotion)
        {
            case 'angry':
                if(getMinutes(angryTimeStamp, sessionStartTimeStamp) !== 0)
                {
                    return 'Angry'
                } else {
                    return null
                }
            case 'disgust':
                if(getMinutes(disgustTimeStamp, sessionStartTimeStamp) !== 0)
                {
                    return 'Disgust'
                } else {
                    return null
                }
            case 'fear':
                if(getMinutes(fearTimeStamp, sessionStartTimeStamp) !== 0)
                {
                    return 'Fear'
                } else {
                    return null
                }
            case 'happy':
                if(getMinutes(happyTimeStamp, sessionStartTimeStamp) !== 0)
                {
                    return 'Happy'
                } else {
                    return null
                }
            case 'neutral':
                if(getMinutes(neutralTimeStamp, sessionStartTimeStamp) !== 0)
                {
                    return 'Neutral'
                } else {
                    return null
                }
            case 'sad':
                if(getMinutes(sadTimeStamp, sessionStartTimeStamp) !== 0)
                {
                    return 'Sad'
                } else {
                    return null
                }
            case 'surprise':
                if(getMinutes(surpriseTimeStamp, sessionStartTimeStamp) !== 0)
                {
                    return 'Surprise'
                } else {
                    return null
                }
            default:
                return null
        }
    }


    //Listeners
    wSocket.addEventListener("message", (capturedEmotion) =>{

        //Makes sure that the message is for updating emotions before we do any updates
        if(verifyMessage(capturedEmotion.data)){
            //Update variable using react hook
            setEmotion(capturedEmotion.data[0].toUpperCase() + capturedEmotion.data.slice(1));
        }

    });


    return (
        <div>
            <div className = "container-fluid bg-light">
                <h1>Service Page Component</h1>
                <div className = "btn-toolbar btn-toolbar-toggle gap-2 justify-content-center">
                    <button onClick = {() => startSession() } className = "btn btn-success btn-lg">Start Session</button>
                    <button onClick = {() => stopSession()} className = "btn btn-danger btn-lg">Stop</button>
                </div>

                <pre></pre>
                <pre></pre>
                
                <div className = "row">
                    <table className = "col-md-4">
                        <tbody>
                            <tr>
                                <td className = "border border-dark border-4">
                                    <video id = "liveWebcam" autoPlay width = "640" height = "480"></video>
                                    <p className = "text-center fw-bold">Current Emotion: { emotion }</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className = "col-md-4">
                        <label id = "firstName">
                            First Name:  
                            <input type = "text" onChange = {getFirstName}></input>
                        </label>
                        <br></br><br></br>

                        <label id = "lastName">
                            Last Name:
                            <input type = "text" onChange = {getLastName}></input>
                        </label>
                        
                        <br></br><br></br>

                        <label id = "gamePlayed">
                            Game Played:
                            <input type = "text" onChange = {getGamePlayed}></input>
                        </label>

                        <br></br><br></br>

                        <label id ="userID">
                            User ID:
                            <input type ="text" onChange = {getUserID}></input>
                        </label>

                        <br></br><br></br>

                        <label id = "AngryPercentage">
                            Angry: 0%
                        </label>

                        <br></br><br></br>

                        <label id = "DisgustPercentage">
                            Disgust: 0%
                        </label>

                        <br></br><br></br>

                        <label id = "FearPercentage">
                            Fear: 0%
                        </label>

                        <br></br><br></br>
                        
                        <label id = "HappyPercentage">
                            Happy: 0%
                        </label>

                        <br></br><br></br>

                        <label id = "NeutralPercentage">
                            Neutral: 0%
                        </label>

                        <br></br><br></br>
                        
                        <label id = "SadPercentage">
                            Sad: 0%
                        </label>

                        <br></br><br></br>

                        <label id = "SurprisePercentage">
                            Surprise: 0%
                        </label>

                        <br></br><br></br>
                        <label>
                            Test Start: {sessionStartTimeStamp}
                        </label>

                        <br></br><br></br>
                        <label>
                            Test End: {sessionEndTimeStamp}
                        </label>
                        
                    </div>
                </div>

                <div style = {{width: 600, display: "none"}} id = "dataGraphs">
                    <Bar
                        data = {{
                            labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
                            datasets: [
                                {
                                    label: 'Percentage of Emotion Shown (%)',
                                    backgroundColor: 'rgba(211,211,211,1)',
                                    borderColor: 'rgba(0,0,0,1)',
                                    borderWidth: 2,
                                    data: [
                                    getEmotionPercentage('angry'),
                                    getEmotionPercentage('disgust'),
                                    getEmotionPercentage('fear'),
                                    getEmotionPercentage('happy'),
                                    getEmotionPercentage('neutral'),
                                    getEmotionPercentage('sad'),
                                    getEmotionPercentage('surprise')
                                    ]
                                }
                            ]
                        }}
                    />

                    <Line
                        data = {{
                            labels: [showLine('angry'), showLine('disgust'), showLine('fear'), showLine('happy'), showLine('neutral'), showLine('sad'), showLine('surprise')],
                            datasets: [
                                {
                                    label: 'Last Time Emotion Was Shown (Minutes into Session)',
                                    backgroundColor: 'rgba(211,211,211,1)',
                                    borderColor: 'rgba(0,0,0,1)',
                                    borderWidth: 2,
                                    showLine: false,
                                    data: [
                                    getMinutes(angryTimeStamp, sessionStartTimeStamp),
                                    getMinutes(disgustTimeStamp, sessionStartTimeStamp),
                                    getMinutes(fearTimeStamp, sessionStartTimeStamp),
                                    getMinutes(happyTimeStamp, sessionStartTimeStamp),
                                    getMinutes(neutralTimeStamp, sessionStartTimeStamp),
                                    getMinutes(sadTimeStamp, sessionStartTimeStamp),
                                    getMinutes(surpriseTimeStamp, sessionStartTimeStamp)
                                    ]
                                }
                            ]
                        }}
                    />
                </div>

            </div>

            <canvas id = "imageCanvas" width = "640" height = "480"></canvas>
        </div>
    );
}

export default Service;