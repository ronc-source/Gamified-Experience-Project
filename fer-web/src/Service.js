//Service page component for the website - Uses bootstrap styling

import {useEffect, useState} from 'react'

import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:3001");

function Service() {

    const [emotion, setEmotion] = useState(['']);

    /*
    useEffect(() => {
        fetch('/fer/').then(res => {
            if(res.ok){
                return res.json()
            }
        }).then(jsonResponse => setInitialState(jsonResponse.hello))
    }, []);

    console.log(initialState);
    */

    function testFunction(){
        socket.emit('getEmotion');

    };

    socket.on('displayEmotion', function(data){
        console.log("Emotion: " + data);
        setEmotion(data);
    });

    return (
        <div>
            <h1>Service Page Component</h1>
            <button onClick = {() => testFunction()}>Test</button>
            <p>{ emotion }</p>
        </div>
    );
}

export default Service;