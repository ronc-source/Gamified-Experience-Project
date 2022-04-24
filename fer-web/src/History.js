//History page component for the website - Uses bootstrap styling
import {useState} from 'react';
import {wSocket} from './socketClient.js'
import HistoryList from './HistoryList.js';

var userID = "";
var SQLDataArray = [];

function History() {

    function start()
    {
        wSocket.send(["request:HISTORY", userID]);
    }

    const getUserID = (e) => {
        userID = e.target.value;
    }


    wSocket.addEventListener("message", (SQLHistory) =>{
        var SQLHistoryData = JSON.parse(SQLHistory.data);
        for(let i = 0; i < SQLHistoryData.length; i++)
        {
            SQLDataArray.push({ FirstName: SQLHistoryData[i]['First Name'], LastName: SQLHistoryData[i]['Last Name'], 
                               GamePlayed: SQLHistoryData[i]['Game Played'], SessionStart: SQLHistoryData[i]['Session Start'],
                               SessionEnd: SQLHistoryData[i]['Session End'], userID: SQLHistoryData[i]['userid']} );
        }
        console.log(SQLDataArray.slice(0, (SQLDataArray.length / 2 )));
        
    });



    return (
        <div>
            <h1>History Page Component</h1>
            <button onClick = {() => start() }>
                Test
            </button>
            <div>
                <label id ="userID">
                    User ID:
                <input type ="text" onChange = {getUserID}></input>
                </label>

                <HistoryList SQLHistory={SQLDataArray} />
            </div>
        </div>
    );
}

export default History;