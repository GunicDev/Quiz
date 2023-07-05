//GLOBAL VARIABLES
const headerText = document.getElementById('header-text');
let userNameInput = document.getElementById('username-input');

const userNameConfirmButton = document.getElementById('start-game-button');
//const playAgainButton = document.getElementById('play-again-button');
//const goToHomePageButton = document.getElementById('go-to-homepage');

const questionFromServer = document.getElementById('question-from-server');
const showAnswers = document.getElementById('answers');
const errorMessage = document.getElementById('error-message');
const userScore = document.getElementById('user-score');
const attemtsCounter = document.getElementById('attempts-number');
const bestScore = document.getElementById('best-score');
const timeLeft = document.getElementById('time-left');
const showPlayerScore = document.getElementById('show-player-score');
const bestPlayerTable = document.getElementById('best-plyers-table');

//sectios
const homepageSection = document.getElementById('homepage-section');
const gameSection = document.getElementById('game-section');
const lostGameSectio = document.getElementById('play-again-section');
const bestPlayerSection = document.getElementById('best-players-section');

const correctAnswerColorElement = document.getElementById(
  'correct-answer-color'
);
const wrongAnswerColorElement = document.getElementById('wrong-answer-color');

//Global storage data
let clickedSolution = '';
const storedAllAnswers = [];
let globalCorrectAnswer = '';
let userSumScore = 0;
let attemptsLeft = 5;
const bestScores = [];
let timer;
const savePlayerAndScore = [];
let player = '';

async function loadQuestion() {
  const APIUrl =
    'https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple';
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  showQuestion(data.results[0]);

  const getAllAnswers = [
    data.results[0].correct_answer,
    ...data.results[0].incorrect_answers,
  ];

  // shuffle array and change order of answers
  //const shuffledArray = getAllAnswers.sort(() => Math.random() - 0.5);
  getAllAnswers.forEach((value, i) => {
    randomIndex = Math.floor(Math.random() * (i + 1));
    getAllAnswers[i] = getAllAnswers[randomIndex];
    getAllAnswers[randomIndex] = value;
  });

  showAllAnswers(getAllAnswers);

  storeDataInGlobalArrays(data.results[0]);
}
function showQuestion(data) {
  
  questionFromServer.innerHTML = data.question;
}

function showAllAnswers(allAnswers) {
 
  showAnswers.innerHTML = '';
  allAnswers.forEach((answers, i) => {
    showAnswers.innerHTML += `<button id='${i}' onClick="getAnswer(${i})" class="answer_button" value='${answers}'>${answers}</button>`;
  });


}

function getAnswer(id) {
  const buttonClicked = document.getElementById(id);

  clickedSolution = buttonClicked.value;

  CheckSolution(clickedSolution, globalCorrectAnswer);
}

function storeDataInGlobalArrays(data) {
  

  const correctAnswer = data.correct_answer;
  globalCorrectAnswer = correctAnswer;
  const incorectAnswers = data.incorrect_answers;

  const allAnswers = [correctAnswer, ...incorectAnswers];
  storedAllAnswers.push(allAnswers);
  
}

function CheckSolution(solution, correctAnswer) {
  //show right aswer
  //console.log(solution, correctAnswer);
  if (solution === correctAnswer) {
   

    questionFromServer.innerHTML = '';
    showAnswers.innerHTML = '';
    errorMessage.classList.add('hidden');
    addScore();
    loadQuestion();
  } else {
    numerOfAttempts();
    errorMessage.classList.remove('hidden');
  }
}

//calc best score
function showBestScore(bestScores) {
  const maxValue = Math.max(...bestScores);

  bestScore.innerHTML = maxValue;
  
}

//Counters

function addScore() {
  userSumScore++;
  userScore.innerHTML = userSumScore;
  correctAnswerColor();
}

function numerOfAttempts() {
  attemptsLeft--;
  attemtsCounter.innerHTML = attemptsLeft;
  wrongAnswerColor();

  if (attemptsLeft === 0) {
    attemptsLeft = 5;
    lostGame();

    
    bestScores.push(userSumScore);
   
    userSumScore = 0;
    userScore.innerHTML = userSumScore;
    attemtsCounter.innerHTML = attemptsLeft;
    loadQuestion();
    showBestScore(bestScores);
  }
}

loadQuestion();

// timer

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    timeLeft.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      lostGame();
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

const correctAnswerColor = function () {
  correctAnswerColorElement.style.backgroundColor = 'green';
  setTimeout(() => {
    resetBackgroundColor(correctAnswerColorElement);
  }, 1000);
};

const wrongAnswerColor = function () {
  wrongAnswerColorElement.style.backgroundColor = 'red';
  setTimeout(() => {
    resetBackgroundColor(wrongAnswerColorElement);
  }, 1000);
};

const resetBackgroundColor = function (div) {
  
  div.style.backgroundColor = '#025464';
};

//HOME PAGE
const plyerAndScore = function (player, score) {
  let plyerStatistic = {
    playerName: player,
    playerScore: score,
  };
  savePlayerAndScore.push(plyerStatistic);
 
};

const homePage = function () {
  homepageSection.classList.remove('hidden');
  lostGameSectio.classList.add('hidden');
  gameSection.classList.add('hidden');
  bestPlayerSection.classList.add('hidden');
  //reset error message
  errorMessage.classList.add('hidden');
};

const playGame = function () {
  homepageSection.classList.add('hidden');
  lostGameSectio.classList.add('hidden');
  bestPlayerSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
};

const bestScoreTable = function () {
  homepageSection.classList.add('hidden');
  lostGameSectio.classList.add('hidden');
  gameSection.classList.add('hidden');
  bestPlayerSection.classList.remove('hidden');
  table();
};

const lostGame = function () {
  plyerAndScore(player, userSumScore);
  showPlayerScore.innerHTML = `Your score : ${userSumScore}`;
  homepageSection.classList.add('hidden');
  lostGameSectio.classList.remove('hidden');
  gameSection.classList.add('hidden');
  bestPlayerSection.classList.add('hidden');
};

//BUTTONS

userNameConfirmButton.onclick = function () {
  headerText.innerHTML = `Welcome ${userNameInput.value}`;
  player = userNameInput.value;
  userNameInput.value = '';
  userNameInput.placeholder = 'Player Name';
  playGame();
  clearInterval(timer);
  timer = startLogOutTimer();
};

const playAgainButton = function () {
  errorMessage.classList.add('hidden');
  playGame();
  clearInterval(timer);
  timer = startLogOutTimer();
};

const goToHomePageButton = function () {
  headerText.innerHTML = `Welcome to Quiz`;
  clearInterval(timer);
  timer = 0;
  homePage();
};

const checkBestPlayer = function () {
  bestScoreTable();
};

const table = function () {
  bestPlayerTable.innerHTML = '';
  savePlayerAndScore.sort((a, b) => b.playerScore - a.playerScore);
  savePlayerAndScore.forEach((value, i) => {
    

    bestPlayerTable.innerHTML += `
    <div class="player_list">
    <p>${savePlayerAndScore[i].playerName}</p>
    <p>${savePlayerAndScore[i].playerScore}</p>
  </div>  
  `;
  });
};
table();
