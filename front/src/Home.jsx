import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [startButtonDisabled, setStartButtonDisabled] = useState(false);
    const [stopButtonDisabled, setStopButtonDisabled] = useState(true);

    useEffect(() => {
        // preload.jsで公開したAPIからデータの取得
        window.electronAPI.onInitData((data) => {
            const copyText = document.getElementById("copy-text");
            if (copyText) {
                copyText.href = 'http://localhost:' + data.port;
                copyText.textContent = 'http://localhost:' + data.port;
            }
        });
    }, []);

    const handleStartClick = () => {
        if (window.electronAPI && window.electronAPI.startFunction) {
            window.electronAPI.startFunction();
            setStartButtonDisabled(true);
            setStopButtonDisabled(false);
        } else {
            console.error('electronAPI.startFunction is not available.');
        }
    };

    const handleStopClick = () => {
        if (window.electronAPI && window.electronAPI.stopFunction) {
            window.electronAPI.stopFunction();
            setStartButtonDisabled(false);
            setStopButtonDisabled(true);
        } else {
            console.error('electronAPI.stopFunction is not available.');
        }
    }

    return (
        <div className="container">
            <h1>StreamMorph</h1>
            <div className="button-container">
                <button className="btn" id='startButton' onClick={handleStartClick} disabled={startButtonDisabled}>起動</button>
                <button className="btn" id='stopButton' onClick={handleStopClick} disabled={stopButtonDisabled}>停止</button>
                {/* <Link className="btn" to="/settings">設定</Link> */}
            </div>
            <a className="url-text" id="copy-text" target="_blank" rel="noreferrer"></a>
        </div>
    );
}

export default Home;
