
function loadShows() {
    return fetch('shows.json')
        .then(response => response.json())
        .then(shows => {
            const maximum = shows.length;
            const randomInteger = Math.floor(Math.random() * maximum);
            console.log("Show index: " + randomInteger);

            return shows[randomInteger];
        });
}

function loadRandomTrack(show) {
    const randomIndex = Math.floor(Math.random() * show.tracks.length);
    return show.tracks[randomIndex];
}

function displayShowInfo(show) {
    fullShowLink = "https://archive.org/details/" + show.showExtension
    document.getElementById('showDisplay').innerHTML = `<a href="${fullShowLink}" target="_blank">${show.showName}</a>`;

}

function getShowHTML(show) {
    fullShowLink = "https://archive.org/details/" + show.showExtension
    fullHTML = `<a href="${fullShowLink}" target="_blank">${show.showName}</a>`;

    return fullHTML;

}


function displayTrackInfo(track, show) {
    //document.getElementById('trackDisplay').innerHTML = track.trackName + "&nbsp;&nbsp;&nbsp;(" + show.showDate + ")";
    document.getElementById('trackDisplay').innerHTML = track.trackName;
}

function loadAndDisplayIframe(show, track) {
    const randomIframe = document.getElementById('random-iframe');
    const audioType = show.audioType;
    randomIframe.src = `https://archive.org/embed/${show.showExtension}/${track.trackExtension}.${audioType}`;
}

function handleError(error) {
    console.error('Error:', error);
}

function showContent() {
    var resultsDiv = document.querySelector('.results');
    resultsDiv.style.display = 'block';
}

function calculateScore(userYear, actualYear) {

    userScore = 5000;

    const givenDate = new Date(actualYear);
    const year = givenDate.getFullYear();

    console.log(year);
    console.log(userYear);

    if (year == userYear) {
        console.log("year correct");
        userScore = 5000;
        console.log(userScore);

    }
    else {

        console.log("year incorrect");

        const guessedDate = new Date(userYear, 0, 1);

        const timeDifference = Math.abs(givenDate - guessedDate);
        const differenceInYears = timeDifference / (1000 * 60 * 60 * 24 * 365.25); // Taking into account leap years

        console.log(`The guess is off by ${differenceInYears.toFixed(2)} years.`);

        userScore = Math.round(userScore - (differenceInYears * 565));

        if (userScore < 0) {
            userScore = 0
        }

        console.log(userScore);
    }

    return userScore;
}


function displayResultPage() {

    // HIDE ALL CURRENT ELEMENTS
    var resultsDiv = document.getElementById("resultsDiv");
    var mainDiv = document.getElementById("main-content");





    // Hide the content by changing the display property to "none"
    resultsDiv.style.display = "none";
    mainDiv.style.display = "none";

    yearSlider.disabled = true;
    confirmButton.disabled = true;
    nextRoundButton.style.display = "none";

    // SHOW RESULT PAGE ELEMENTS
    const resultPage = document.getElementById("finalResultPage");
    resultPage.style.display = "block";

    // Display the final score
    const finalScoreElement = document.getElementById("finalScoreValue");
    finalScoreElement.textContent = totalUserScore + "/25000";

    let tableHTML = `
<table>
  <tr>
    <th id="trackColumn">Track</th>
    <th>Your guess</th>
    <th>Actual Year</th>
    <th>Score</th>
  </tr>
`;

    for (let i = 0; i < rounds.length; i++) {
        const [showName, trackName, userGuess, actualYear, userScore] = rounds[i];
        tableHTML += `
    <tr>
      <td id="trackColumn">${showName}<br>${trackName}</td>
      <td>${userGuess}</td>
      <td>${actualYear}</td>
      <td>${userScore}</td>
    </tr>
  `;
    }
    tableHTML += `<tr> 
    <td id="trackColumn">Total Score:</td>
    <td></td><td></td>
    <td>${totalUserScore}/25000</td> </tr>`;
    tableHTML += '</table>';

    //var tableElement = document.createElement('div');
    //tableElement.innerHTML = tableHTML;

    // Select the parent element where you want to append the table
    var parentElement = document.getElementById('tableContainer');
    parentElement.innerHTML = tableHTML;


    // Append the table element to the parent element
    //parentElement.appendChild(tableElement);


    document.getElementById("homeButton").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    document.getElementById("newGameButton").addEventListener("click", function () {
        location.reload();

    });



}


let currentRound = 1;
let totalUserScore = 0;


const rounds = [];

// Function to add a round to the array
function addRound(showName, trackName, userGuess, actualYear, userScore) {
    rounds.push([showName, trackName, userGuess, actualYear, userScore]);
}


document.addEventListener("DOMContentLoaded", () => {
    let loadedShow; // Declare a variable to hold the show object




    loadShows()
        .then(show => {
            console.log('Imported Show:', show);
            loadedShow = show; // Store the show object in the variable
            displayShowInfo(show);

            // Load a random track
            const track = loadRandomTrack(show);
            console.log(track);
            displayTrackInfo(track, show);

            return { show, track };
        })
        .then(data => {
            // Step 4: Load and display the iframe
            loadAndDisplayIframe(data.show, data.track);
        })
        .catch(handleError);

    const yearSlider = document.getElementById("yearSlider");
    const selectedYear = document.getElementById("selectedYear");


    yearSlider.addEventListener("input", () => {
        const year = yearSlider.value;
        selectedYear.textContent = year;
    });

    var confirmButton = document.getElementById("confirmButton");
    var resultsDiv = document.querySelector(".results");
    const userGuessElement = document.getElementById("userGuess");
    const userScoreElement = document.getElementById("userScore");
    var nextRoundButton = document.getElementById("nextRoundButton");
    const loadingMessage = document.getElementById("loadingMessage");


    const roundHeader = document.getElementById("roundHeader");

    var iframe = document.getElementById('random-iframe');
    iframe.style.display = 'none';


    // Add a load event listener to the iframe
    iframe.addEventListener('load', function () {
        console.log('Iframe is loaded.');
        loadingMessage.style.display = 'none';
        iframe.style.display = 'inline';
        // Show Iframe element

    });






    confirmButton.addEventListener("click", function () {
        resultsDiv.style.display = "block";
        yearSlider.disabled = true;
        confirmButton.disabled = true;
        userGuessElement.innerHTML = "Your guess: " + selectedYear.textContent + "&nbsp;&nbsp;&nbsp;&nbsp;Actual year: " + loadedShow.showYear;
        console.log(userGuessElement.textContent);

        userScore = calculateScore(selectedYear.textContent, loadedShow.showDate);

        totalUserScore = totalUserScore + userScore;

        console.log("total user score: " + totalUserScore)

        userScoreElement.textContent = (userScore + "/5000");

        const showElement = document.getElementById("showDisplay");
        const trackElement = document.getElementById("trackDisplay");

        //window.scrollTo(0, document.body.scrollHeight);
        nextRoundButton.scrollIntoView({ behavior: 'smooth' });



        addRound(showElement.innerHTML, trackElement.innerHTML, selectedYear.textContent, loadedShow.showYear, (userScore + "/5000"));



    });

    nextRoundButton.addEventListener("click", function () {

        currentRound++;


        if (currentRound == 6) {
            var embedDiv = document.querySelector('div.embed');

            // Remove the div element from the DOM
            embedDiv.parentNode.removeChild(embedDiv);
            displayResultPage();


        }
        else {

            if (currentRound == 5) {
                console.log("Final round");
                nextRoundButton.textContent = "Finish game";
            }

            roundHeader.textContent = ("Round " + currentRound + "/5")

            // LOAD NEXT ROUND
            console.log("Next round pressed");
            //currentRound = currentRound + 1

            // Reset UI elements
            resultsDiv.style.display = "none";
            yearSlider.disabled = false;
            confirmButton.disabled = false;
            yearSlider.value = 1980; // Reset slider value
            selectedYear.textContent = "1980"; // Reset selectedYear text

            iframe.style.display = "none";
            loadingMessage.style.display = "revert";

            // Load and display a new show
            loadShows()
                .then(show => {
                    console.log('Imported Show:', show);
                    loadedShow = show;
                    displayShowInfo(show);
                    const track = loadRandomTrack(show);
                    console.log(track);
                    displayTrackInfo(track, show);
                    loadAndDisplayIframe(show, track);

                    // Reset user input and scores
                    userScoreElement.textContent = "";
                    userGuessElement.textContent = "";

                    // Increment current round
                })
                .catch(handleError);


        }
    });
});



