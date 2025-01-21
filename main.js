//------
// TIME & DATE
//------

//https://stackoverflow.com/questions/61280319/is-there-an-easier-way-to-display-live-time-and-date-in-html-using-bootstrap
var clockElement = document.getElementById('clock');

    function clock() {
        clockElement.textContent = new Date().toLocaleTimeString();
    }

    setInterval(clock, 1000);