//words in script.js
const wordlist = [];
const words = [];

const targetWord = wordlist[Math.floor(Math.random() * wordlist.length)].toUpperCase();
let currentGuess = [];
let guesses = 0;

// Initialize keyboard
const keyboardDiv = document.getElementById('keyboard');

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['BACK', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
];

// Initialize keyboard
keyboardLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    row.forEach(letter => {
        const btn = document.createElement('button');
        if (letter === 'BACK') {
            btn.innerText = 'Delete';
            btn.addEventListener('click', () => removeLetterFromGuess());
            btn.classList += "keySpecial";
        } else if (letter === 'ENTER') {
            btn.innerText = 'Enter';
            btn.addEventListener('click', () => submitGuess());
            btn.classList += "keySpecial";
        } else {
            btn.innerText = letter;
            btn.setAttribute('data-letter', letter);
            btn.addEventListener('click', () => addLetterToGuess(letter.toLowerCase()));
        }
        rowDiv.appendChild(btn);
    });
    keyboardDiv.appendChild(rowDiv);
});

for (let i = 0; i < 6; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";
    for (let j = 0; j < 5; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        // Create cell-front and cell-back divs with the same letter
        const cellFront = document.createElement("div");
        cellFront.className = "cell-front";
        cell.appendChild(cellFront);

        const cellBack = document.createElement("div");
        cellBack.className = "cell-back";
        cell.appendChild(cellBack);

        rowDiv.appendChild(cell);
    }
    document.getElementById("guesses").appendChild(rowDiv);
}





function addLetterToGuess(letter) {
    if (currentGuess.length < 5) {
        currentGuess.push(letter);
        displayCurrentGuess();
    }
}

function removeLetterFromGuess() {
    currentGuess.pop();
    displayCurrentGuess();
}

function getStorage(name) {
    var score = localStorage.getItem(name);
    if(score && score != "NaN" && score != null && score != undefined)
        return parseInt(score);
    else
        return 0;
}

function setStorage(name, newscore) {
    localStorage.setItem(name, newscore);
}

function displayCurrentGuess() {
    const currentRow = document.querySelectorAll('.row')[guesses];
    currentRow.innerHTML = ''; // Clear current row

    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';

        const cellFront = document.createElement('div');
        cellFront.className = 'cell-front';

        const cellBack = document.createElement('div');
        cellBack.className = 'cell-back';

        if (currentGuess[i]) {
            cellFront.innerText = currentGuess[i].toUpperCase();
            cellBack.innerText = currentGuess[i].toUpperCase();
            if (!currentGuess[i+1])
            cell.classList.add('jump'); // Add the "jump" effect when a new letter is added
        }

        cell.appendChild(cellFront);
        cell.appendChild(cellBack);
        currentRow.appendChild(cell);
    }
}


function submitGuess() {
    if (guesses < 6 && currentGuess.length === 5) {
        if(!words.includes(currentGuess.join('').toLowerCase()) && !wordlist.includes(currentGuess.join('').toLowerCase())) {
            modal3.style.display = "block";
            return;
        }
        var won = checkGuess(currentGuess.join(''));
        currentGuess = [];
        guesses++;
        if(guesses == 6 && !won) {
            endGame(false);
        }
    }
}
function countLetterUpTo(letter, word, index) {
    return word.substr(0, index + 1).split(letter).length - 1;
}
function countLetterFrom(letter, word, index) {
    return word.substr(index).split(letter).length - 1;
}
function countLetterOccurrences(letter, word) {
    return word.split(letter).length - 1;
}

function checkGuess(guessedWord) {
    const currentRow = document.querySelectorAll('.row')[guesses];

    let letterOccurrencesInTarget = {};
    let letterOccurrencesInGuess = {};

    for (let i = 0; i < 5; i++) {
        let letter = guessedWord[i].toUpperCase();
        if (!letterOccurrencesInTarget[letter]) {
            letterOccurrencesInTarget[letter] = countLetterOccurrences(letter, targetWord);
        }
        if (!letterOccurrencesInGuess[letter]) {
            letterOccurrencesInGuess[letter] = 0; // Initialize counter for guessed word
        }
    }

    // First pass: Set the content for the cells without changing the color
    for (let i = 0; i < 5; i++) {
        const cell = currentRow.children[i];
        const letter = guessedWord[i].toUpperCase();
        const cellBack = cell.querySelector('.cell-back');
        cellBack.textContent = letter;
    }

    // Delay the addition of color classes and flip
    setTimeout(() => {
        // Marking exact matches (green)
        for (let i = 0; i < 5; i++) {
            const cell = currentRow.children[i];
            const letter = guessedWord[i].toUpperCase();

            if (letter === targetWord[i]) {
                cell.classList.add("green");
                letterOccurrencesInGuess[letter]++;
                //letterOccurrencesInTarget[letter]--;
            }
        }

        // Marking partial matches (yellow)
        for (let i = 0; i < 5; i++) {
            const cell = currentRow.children[i];
            const letter = guessedWord[i].toUpperCase();

            if (!cell.classList.contains("green") &&
                targetWord.includes(letter) &&
                letterOccurrencesInGuess[letter] < letterOccurrencesInTarget[letter]) {
                cell.classList.add("yellow");
                letterOccurrencesInGuess[letter]++;
                //letterOccurrencesInTarget[letter]--;

            } else if (!cell.classList.contains("green") && !cell.classList.contains("yellow")) {
                cell.classList.add("gray");
            }

            cell.classList.add("flip");
        }
    }, 10);  // This short delay ensures the content update is rendered before the color change and flip

    // Update the buttons' colors
    for (let i = 0; i < guessedWord.length; i++) {
        let letter = guessedWord[i].toUpperCase();
        const button = document.querySelector(`button[data-letter="${letter}"]`);

        if (button) {
            if (targetWord.charAt(i) === letter) {
                button.classList.remove("yellow");
                button.classList.add('green');
            } else if (targetWord.includes(letter)) {
                if (!button.classList.contains('green'))
                    button.classList.add('yellow');
            } else {
                button.classList.add('disabled');
            }
        }
    }

    if (targetWord.toUpperCase().includes(guessedWord.toUpperCase())) {
        guesses++;
        endGame(true);
        return true;
    }
}


function endGame(won) {
    const banner = document.getElementById('banner');
    document.querySelector('.answer').innerText = `Answer: ${targetWord.toUpperCase()}`;
    const resultMessage = document.getElementById('resultMessage');
    if (won) {
        banner.innerText = 'You Won!';
        setStorage("gamesWon", getStorage("gamesWon")+1);
        setStorage("frequency"+guesses, getStorage("frequency"+guesses)+1);
    } else {
        banner.innerText = 'You Lost!';
    }
    setStorage("gamesPlayed", getStorage("gamesPlayed")+1);
    document.getElementById("answer").innerText = targetWord;
    document.getElementById("myModal").style.display = "block";
    disableKeyboard();
}

function disableKeyboard() {
    keyboardDiv.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    });
}

document.addEventListener('keydown', function(event) {
    // Convert the key to uppercase
    const key = event.key.toUpperCase();

    // If the key is a valid letter
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
        // Check if the key hasn't been disabled already
        const button = document.querySelector(`button[data-letter="${key.toUpperCase()}"]:not(:disabled)`);
        if (button) {
            button.click();  // Simulate a button click on the virtual keyboard
        }
    }
    // Handle backspace key
    else if (event.key === 'Backspace') {
        if (currentGuess.length > 0) {
            currentGuess.pop();
            displayCurrentGuess();
        }
    }
    // Handle enter key
    else if (event.key === 'Enter') {
        if(modal3.style.display == "block") {
            modal3.style.display = "none";
            return;
        }
        submitGuess();
    }
});


var modal = document.getElementById("myModal");

var modal2 = document.getElementById("statsModal");

var newGame = document.getElementById("new");
var new2 = document.getElementById("new2");

var statsButton = document.getElementById("stats");

var modal3 = document.getElementById("modal3");

var closeMod3 = document.getElementById("closeList");

// Get the button that opens the modal
//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];

// When the user clicks on the button, open the modal
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
newGame.onclick = function() {
    location.reload();
}
new2.onclick = function() {
    location.reload();
}
closeMod3.onclick = function() {
    modal3.style.display = "none";
}


statsButton.onclick = function() {
    modal2.style.display = "block";
    var played = getStorage('gamesPlayed');
    var won = getStorage('gamesWon');
    var percent = (won/played)
    if (played == 0) {
        percent = 0;
    }
    document.getElementById("gamesPlayed").innerText = played;
    document.getElementById("gamesWon").innerText = won;
    document.getElementById("percentWins").innerText = Math.ceil(percent*100);

    const bars = document.querySelectorAll('.bar');
    var distribution = []
    var total = 0;
    for(var barIdx = 1; barIdx <= 6; barIdx++) {
        var thisVal = getStorage("frequency"+barIdx);
        distribution.push(thisVal);
        total += thisVal;
    }
    for(var barIdx = 1; barIdx <= 6; barIdx++) {
        var bar = document.getElementsByClassName("bar")[barIdx-1];
        var value = Math.floor(distribution[barIdx-1]/total*100);
        if(isNaN(value)) {
            value = 0;
        }
        bar.style.setProperty('--fill-width', value + '%');
        var marker = document.getElementsByClassName("marker")[barIdx-1];
        if(value == 100) {
            marker.style.display = "none";
        } else {
            marker.style.display = "block";
        }
        marker.style.left = value + '%';
        marker.style.transform = 'translateX(-100%)';
        document.getElementsByClassName("labelPercent")[barIdx-1].innerText = value + "%";
    }
}

span.onclick = function() {
  modal.style.display = "none";
}
span2.onclick = function() {
    modal2.style.display = "none";
  }
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    new2.style.display = "block";
  }
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
  if (event.target == modal3) {
    modal3.style.display = "none";
  }
} 