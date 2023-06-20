//GLOBAL VARIABLES
const headerText = document.getElementById('header-text');
let userNameInput = document.getElementById('username-input');
const userNameConfirmButton = document.getElementById('start-game-button');
const playAgainButton = document.getElementById('play-again-button');
const goToHomePageButton = document.getElementById('go-to-homepage');

const questionFromServer = document.getElementById('question-from-server');
const showAnswers = document.getElementById('answers');
const errorMessage = document.getElementById('error-message');
const userScore = document.getElementById('user-score');
const attemtsCounter = document.getElementById('attempts-number');
const bestScore = document.getElementById('best-score');
const timeLeft = document.getElementById('time-left');

//sectios
const homepageSection = document.getElementById('homepage-section');
const gameSection = document.getElementById('game-section');
const lostGameSectio = document.getElementById('play-again-section');
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

/*
{category: 'Sports', type: 'multiple', difficulty: 'easy', question: 'In baseball, how many fouls are an out?', correct_answer: '0', …}
category
: 
"Sports"
correct_answer
: 
"0"
difficulty
: 
"easy"
incorrect_answers
: 
(3) ['5', '3', '2']
question
: 
"In baseball, how many fouls are an out?"
type
: 
"multiple"
*/

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
  // console.log(data);
  questionFromServer.innerHTML = data.question;
}

function showAllAnswers(allAnswers) {
  // console.log(allAnswers);
  showAnswers.innerHTML = '';
  allAnswers.forEach((answers, i) => {
    showAnswers.innerHTML += `<button id='${i}' onClick="getAnswer(${i})" class="answer_button" value='${answers}'>${answers}</button>`;
  });

  //console.log(showAnswers);
}

function getAnswer(id) {
  const buttonClicked = document.getElementById(id);

  clickedSolution = buttonClicked.value;
  //console.log(clickedSolution);
  //console.log(globalCorrectAnswer);
  //console.log(storedAllAnswers);
  CheckSolution(clickedSolution, globalCorrectAnswer);
}

function storeDataInGlobalArrays(data) {
  //console.log(data);

  const correctAnswer = data.correct_answer;
  globalCorrectAnswer = correctAnswer;
  const incorectAnswers = data.incorrect_answers;

  const allAnswers = [correctAnswer, ...incorectAnswers];
  storedAllAnswers.push(allAnswers);
  //console.log(allAnswers);
}

function CheckSolution(solution, correctAnswer) {
  //show right aswer
  console.log(solution, correctAnswer);
  if (solution === correctAnswer) {
    //console.log('assa');

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
  // console.log(maxValue);
}

//Counters

function addScore() {
  userSumScore++;
  userScore.innerHTML = userSumScore;
}

function numerOfAttempts() {
  attemptsLeft--;
  attemtsCounter.innerHTML = attemptsLeft;

  if (attemptsLeft === 0) {
    attemptsLeft = 5;
    lostGame();

    // console.log(userSumScore);
    bestScores.push(userSumScore);
    //console.log(bestScores);
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

//HOME PAGE
const plyerAndScore = function (player, score) {
  let plyerStatistic = {
    playerName: player,
    playerScore: score,
  };
  savePlayerAndScore.push(plyerStatistic);
  console.log(savePlayerAndScore);
};

const homePage = function () {
  homepageSection.classList.remove('hidden');
  lostGameSectio.classList.add('hidden');
  gameSection.classList.add('hidden');
};

const playGame = function () {
  homepageSection.classList.add('hidden');
  lostGameSectio.classList.add('hidden');
  gameSection.classList.remove('hidden');
};

const lostGame = function () {
  plyerAndScore(player, userSumScore);
  homepageSection.classList.add('hidden');
  lostGameSectio.classList.remove('hidden');
  gameSection.classList.add('hidden');
};

userNameConfirmButton.onclick = function () {
  headerText.innerHTML = `Welcome ${userNameInput.value}`;
  player = userNameInput.value;
  userNameInput.value = 'Player Name';
  playGame();
  clearInterval(timer);
  timer = startLogOutTimer();
};

// YOU LOSE PAGE
playAgainButton.onclick = function () {
  playGame();
  clearInterval(timer);
  timer = startLogOutTimer();
};

goToHomePageButton.onclick = function () {
  clearInterval(timer);
  timer = 0;
  homePage();
};
