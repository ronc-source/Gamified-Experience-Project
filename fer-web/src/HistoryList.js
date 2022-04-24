const HistoryList = ({SQLHistory}) => {

    return(
        <div>
            {SQLHistory.map((record) => (
                <div>
                    <p>{record.FirstName}</p>
                    <p>{record.LastName}</p>
                    <p>{record.GamePlayed}</p>
                    <p>{record.SessionStart}</p>
                    <p>{record.SessionEnd}</p>
                    <p>{record.userID}</p>
                </div>
            ))}
        </div>
    );
}

export default HistoryList;