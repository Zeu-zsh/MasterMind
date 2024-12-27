let proposals = document.querySelector(".choose");
let error = document.querySelector(".error");
let code = document.querySelector(".code");
let play = document.querySelector(".play");
let form = document.querySelector("form");
let historyContainer = document.querySelector(".history");

play.disabled = true;

const tupleColor = ["R", "J", "B", "V", "N", "O"];

let game = ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R',
    'R', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J', 'J',
    'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'V',
    'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'N', 'N',
    'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'O', 'O', 'O',
    'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'];

function shuffle(game) {
    game.sort(() => Math.random() - 0.5);
}

function initGame() {
    shuffle(game);
    console.log(code.textContent = `${game[0]} ${game[1]} ${game[2]} ${game[3]} ${game[4]}`);
}

initGame();

form.addEventListener("submit", (event) => {
    event.preventDefault();
});

function playGame() {
    const maxAttempts = 10;
    const history = [];
    let attempts = 0;

    play.addEventListener("click", (event) => {
        event.preventDefault();
        const input = proposals.value.toUpperCase();

        if (input.length !== 5 || !input.split("").every(char => tupleColor.includes(char))) {
            error.textContent = "Code invalide. Assurez-vous d'utiliser 5 lettres parmi R, J, B, V, N, O.";
            error.style.color = "red";
            return;
        }

        const result = checkSecretCode(input);
        attempts++;

        history.push({
            proposals: input,
            nbGoodPlace: result.nbGoodPlace,
            nbBadPlace: result.nbBadPlace
        });

        updateHistory(history);

        if (result.nbGoodPlace === 5) {
            error.textContent = "C'est gagné !!!";
            error.style.color = "green";
            play.disabled = true;
            return;
        }

        if (attempts >= maxAttempts) {
            error.textContent = `C'est perdu... Le code secret était : ${code.textContent}.`;
            error.style.color = "red";
            play.disabled = true;
            return;
        }

        error.textContent = `Plus que ${maxAttempts - attempts} chance(s).`;
        error.style.color = "blue";
        proposals.value = "";
        play.disabled = true;
    });
}

function checkSecretCode(input) {
    let secretCodeTemp = code.textContent.split(" ");
    let proposalsTemp = input.split("");
    let nbGoodPlace = 0;
    let nbBadPlace = 0;

    for (let i = 0; i < secretCodeTemp.length; i++) {
        if (proposalsTemp[i] === secretCodeTemp[i]) {
            nbGoodPlace++;
            secretCodeTemp[i] = "-";
            proposalsTemp[i] = "-";
        }
    }

    for (let i = 0; i < proposalsTemp.length; i++) {
        if (proposalsTemp[i] !== "-" && secretCodeTemp.includes(proposalsTemp[i])) {
            nbBadPlace++;
            secretCodeTemp[secretCodeTemp.indexOf(proposalsTemp[i])] = "-";
        }
    }

    return { nbGoodPlace, nbBadPlace };
}

proposals.addEventListener("input", () => {
    const input = proposals.value.toUpperCase();
    if (input.length === 5 && input.split("").every(char => tupleColor.includes(char))) {
        play.disabled = false;
        error.textContent = "Code valide.";
        error.style.color = "green";
    } else {
        play.disabled = true;
        error.textContent = "Code invalide. Veuillez entrer 5 lettres parmi R, J, B, V, N, O.";
        error.style.color = "red";
    }
});

function updateHistory(history) {
    historyContainer.innerHTML = "";
    history.forEach(entry => {
        const historyItem = document.createElement("p");
        historyItem.textContent = `${entry.proposals} | Bien placé(s) : ${entry.nbGoodPlace} / Mal placé(s) : ${entry.nbBadPlace}`;
        historyContainer.appendChild(historyItem);
    });
}

playGame();
