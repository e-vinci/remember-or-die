/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
// eslint-disable-next-line
import anime from 'animejs';
import { clearPage } from '../../utils/render';
import imgheart from '../../assets/default/heart.png';
import imgskull from '../../img/favicon.ico';
import findBossOrPlayerImg from '../../utils/imagesBossAndPlayer';
import { initializeArrayOfCards } from '../../utils/imagesCards';
import makeDisappearNavbar from '../../utils/navbarSetup';
import Navigate from '../Router/Navigate';
import { getAuthenticatedUser, setXp, setLastLevel } from '../../utils/auths';
import calculateRank from '../../utils/xp';
import backgroundImage from '../../img/backgrounds/background_Game.png';

const main = document.querySelector('main');

const GamePage = async () => {
  
  let numberOfCards = null; // Variable stockant par rapport au niveau le nombre de cartes a généré.
  let bossLifeMax = null; // Variable stockant les points de vie du boss en fonction du nombre de cartes.(NB : Une paire de cartes trouvée => -10 pv au boss . C'est pour cela qu'on fait *5)
  let bossLife = null;
  let memoryTimer = null; // Variable stockant en fonction des niveaux le temps de memorisation
  let lifeBarWrapper = null;
  let bossLifeWrapper = null;
  let clickableWhenStartMemoryTimer = false; // Variable pour autoriser le click après la fin du timer de mémorisation.
  let cards = null;
  let firstCard = null; // Variable stockant la première carte cliquée.
  let idGameTimer = 0;
  let timerOfThePlayer = 0; // Variable stockant le temps pris par le joueur pour vaincre le boss ou trouver toutes les paires de cartes.
  let countHeartPlayer = 3; // Variable stockant le nombre de coeurs restant du joueur durant la partie .
  let level = null; // Variable stockant tous les informations du level (world, l'image du boss, level number,memory timer etc...)
  let nbrOfclicks = null; // Variable stockant le nombre de clicks sur les cartes
  let imgBoss = null; // Variable stockant l'image du boss
  let urlParams = null;
  let levelparams = null;
  let gameSeconds = 0;
  let user = null; // Variable stockant utilisateur connecte
  let divBossAndPlayer = null;
  

  user = getAuthenticatedUser();
  if (!user) {
    Navigate('/login');
    return;
  }

  // Permet de faire disparaitre la bar de navigation
  makeDisappearNavbar(true);

  clearPage();

  // on initialise le nombre de click au debut de chaque partie a 0
  nbrOfclicks = 0;

  divBossAndPlayer = document.createElement('div');
  divBossAndPlayer.className = 'bossAndPlayer';
  // Recuperation des donnees (Level, World, Memory Timer etc..)
  try {
    urlParams = new URLSearchParams(window.location.search);

    // Récupérez la valeur du paramètre 'levelId'
    levelparams = urlParams.get('levelId');
    console.log(levelparams);

    await recoveryData();

    main.style.backgroundImage = `url(${backgroundImage})`;
    main.style.height = '100vh';
  } catch (error) {
    console.error(error);
  }
  if (
    user.lastLevel.world + 1 < level.world ||
    user.lastLevel.level_number + 1 < level.level_number
  ) {
    Navigate(`/levelMap?world=${user.lastLevel.world + 1}`);
    return;
  }

  // Affichage du monde , du niveau et du logo VS
  displayVSAndTitle();
  // Affichage de la barre de vie du boss
  displayBoss(level.boss);
  // Affichage des vies du joueur
  displayplayerLife();
  // Ajouts des divs HTML du jeu (div cards, div memorytimer,div gameTimer etc...)
  buildGamePage();

  cards = document.querySelectorAll('.card');
  lifeBarWrapper = document.querySelector('#lifeBar');

  bossLifeWrapper = document.querySelector('#bossLife');

  // On creer le timer de memorisation
  createMemoryTimer(memoryTimer);

  // Retourner toutes les cartes dès le début de la partie afin que le joueur puisse mémoriser les cartes dans le temps imparti
  turnAllTheCards();

  // Mise en place d'un écouteur d'événement sur toutes les cartes lorsque l'on clique sur une carte.
  cards.forEach((card) =>
    card.addEventListener('click', () => {
      if (clickableWhenStartMemoryTimer === true) {
        const firstCardid = firstCard?.dataset?.id;
        const secondCardid = card?.dataset?.id;
        nbrOfclicks++;
        // Si le joueur a clicker sur la meme carte alors on ne fait rien
        if (firstCardid === secondCardid) {
          nbrOfclicks--;
          return;
        }
        // Avec se if on oblige le joueur a clicker sur 2 cartes a la fois.
        if (nbrOfclicks <= 2) {
          // Si la variable est vraie, le temps de mémorisation écoulé autorise le joueur à cliquer sur les cartes
          if (!card.classList.contains('card-found')) {
            handleCardClick(card);
            checkMatchingCards(card);
          }
        }
      }
    }),
  );
  async function recoveryData() {
    try {
      level = await getLevel();
    } catch (error) {
      console.Error(error);
    }
    numberOfCards = level.card_number;
    memoryTimer = level.memorisation_time;
    bossLifeMax = numberOfCards * 5;
    bossLife = bossLifeMax;
  }
  async function getLevel() {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/levels/${levelparams}`);
      if (!response.ok)
        throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
      const levelresult = await response.json();
      console.log(levelresult);
      return levelresult;
    } catch (error) {
      console.error('getLevelById::error: ', error);
      throw error;
    }
  }
  function displayVSAndTitle() {
    main.appendChild(divBossAndPlayer);
    const divTitle = document.createElement('div');

    const divVersusTitle = document.createElement('div');
    divVersusTitle.id = 'divVersus';
    divVersusTitle.style.textAlign = 'center';
    divVersusTitle.style.marginTop = '5%';

    divBossAndPlayer.appendChild(divVersusTitle);

    const showWorldAndLevel = document.createElement('h3');

    showWorldAndLevel.innerText = `Monde ${level.world} - Niveau ${level.level_number}`;

    const versusTitle = document.createElement('h1');
    versusTitle.innerText = 'VS';
    versusTitle.id = 'versus';
    versusTitle.style.marginTop = '5%';

    divTitle.appendChild(showWorldAndLevel);
    divVersusTitle.appendChild(divTitle);
    divVersusTitle.appendChild(versusTitle);
  }
  function displayBoss(bossSrc) {
    imgBoss = findBossOrPlayerImg(bossSrc);
    const div = document.createElement('div');
    div.className = 'divBoss';
    divBossAndPlayer.appendChild(div);
    const boss = document.createElement('div');
    boss.className = 'boss';
    div.appendChild(boss);
    const imgWrapperBoss = document.createElement('img');
    imgWrapperBoss.src = imgBoss;
    imgWrapperBoss.className = 'imgBoss';
    boss.appendChild(imgWrapperBoss);
    displayBossLife(boss);
  }

  function displayBossLife(bossWrapper) {
    const divLife = document.createElement('div');
    divLife.id = 'life';
    divLife.className = 'boss';
    bossWrapper.appendChild(divLife);
    const divBossLife = document.createElement('div');
    divBossLife.id = 'lifeBar';
    divLife.appendChild(divBossLife);

    const p = document.createElement('p');
    p.innerText = bossLife;
    p.id = 'bossLife';
    divBossLife.appendChild(p);
  }

  function displayplayerLife() {
    const divPlayer = document.createElement('div'); // container of player and his life
    const player = document.createElement('div'); // container img of player
    player.className = 'player';
    divPlayer.appendChild(player);

    const playerImg = findBossOrPlayerImg(user.avatarPath); // img player src
    const wrapperimg = document.createElement('img'); // wrapper img
    wrapperimg.src = playerImg;
    wrapperimg.className = 'playerImg';
    player.appendChild(wrapperimg);
    divPlayer.className = 'divPlayer';
    const divHeart = document.createElement('div');
    divHeart.className = 'divHearts';
    divBossAndPlayer.appendChild(divPlayer); // container for hearts
    player.appendChild(divHeart);
    for (let index = 0; index < 3; index++) {
      const heart = document.createElement('img');
      heart.src = imgheart;
      heart.className = 'heart';
      divHeart.appendChild(heart);
    }
  }

  function buildGamePage() {
    let innerHTML = `<div id="memoryTimer"></div>
                     <div id="gameTimer"></div>
                     <div class="card-container">`;
    const arrayOfCards = initializeArrayOfCards(level.world, level.level_number);
    shuffleArray(arrayOfCards);

    for (let index = 0; index < numberOfCards; index++) {
      innerHTML += `<div class="card" data-id=${index}>
                    <div class="front">
                        ?
                    </div>
                    <div class="back">
                        <img src=${arrayOfCards[index]} class="imagesOfCards">
                    </div>                  
                  </div>`;
    }
    main.innerHTML += `${innerHTML} </div>`;
    const cardContainer = document.querySelector('.card-container');
    cardContainer.style.display = 'grid';

    if (numberOfCards === 8) {
      cardContainer.style.gridTemplateColumns = `repeat(4, auto)`;
      cardContainer.style.gap = '30px';
      cardContainer.style.width = '600px';
      cardContainer.style.height = '60%';
      cardContainer.style.gridTemplateRows = 'repeat(4, 125px)';
    }
    if (numberOfCards === 16) {
      cardContainer.style.gridTemplateColumns = `repeat(4, auto)`;
      cardContainer.style.gap = '30px';
      cardContainer.style.width = '600px';
      cardContainer.style.height = '60%';
      cardContainer.style.gridTemplateRows = 'repeat(4, 125px)';
    }
    if (numberOfCards === 24) {
      cardContainer.style.gridTemplateColumns = `repeat(6, auto)`;
      cardContainer.style.gap = '30px';
      cardContainer.style.width = '900px';
      cardContainer.style.height = '60%';
      cardContainer.style.gridTemplateRows = 'repeat(4, 125px)';
    }
  }

  function createMemoryTimer(timer) {
    let secondsRemaining = timer;

    // Mise en place du minuteur avec setTimeout
    const timerInterval = setInterval(() => {
      if (document.getElementById('memoryTimer') !== null) {
        // Mise à jour du minuteur
        document.getElementById(
          'memoryTimer',
        ).innerText = `Temps restant : ${secondsRemaining} secondes`;

        // Si les secondes restante sont a 0 on efface le contenue de la div memoryTimer
        if (secondsRemaining === 0) {
          clearInterval(timerInterval);
          document.getElementById('memoryTimer').innerHTML = '';
          clickableWhenStartMemoryTimer = true;

          // Lance le chrono de la partie
          startGameTimer();

          // Retourner toutes les cartes après que le minuteur ai expiré
          turnAllTheCards();
        }
        secondsRemaining--;
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
  }

  function turnAllTheCards() {
    cards.forEach((card) => {
      handleCardClick(card);
    });
  }

  function handleCardClick(card) {
    if (card.classList.contains('card-found')) {
      return;
    }

    /** *************************************************************************************
     *    Title: flip a card with animeJS
     *    Author: Joshua McFarland -> https://codesandbox.io/u/mcfarljw
     *    Date: no date
     *    Code version:
     *    Availability: https://codesandbox.io/s/e7ou1
     *
     ************************************************************************************** */
    anime({
      targets: card,
      scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
      rotateY: { value: '+=540', delay: 200 },
      easing: 'easeInOutSine',
      duration: 400,
    });
  }

  // eslint-disable-next-line no-shadow
  function animationBossLife(lifeBarWrapper) {
    console.log((bossLife / bossLifeMax) * 100);
    anime({
      targets: lifeBarWrapper,
      width: `${(bossLife / bossLifeMax) * 100}%`,
      duration: 500,
      easing: 'easeInOutSine',
    });
  }

  function shuffleArray(arrayOfCards) {
    /** *************************************************************************************
     *    Title: creation d'une function qui melange un tableau de cards en javascript
     *    Author: ChatGpt -> https://chat.openai.com/
     *    Date: no date
     *    Code version: no code version
     *    Availability: https://chat.openai.com/
     *
     ************************************************************************************** */

    // Algorithme de Fisher-Yates
    for (let i = arrayOfCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line no-param-reassign
      [arrayOfCards[i], arrayOfCards[j]] = [arrayOfCards[j], arrayOfCards[i]];
    }
  }

  function checkMatchingCards(card) {
    if (firstCard == null) {
      firstCard = card;
      return;
    }
    if (firstCard !== null) {
      // Si c'est la deuxième carte cliquée
      const firstCardImgSrc = firstCard.querySelector('.back img').src;
      const secondCardImgSrc = card.querySelector('.back img').src;

      if (firstCardImgSrc !== secondCardImgSrc) {
        setTimeout(() => {
          handleCardClick(firstCard);
          console.log('first Card= ', firstCard);
          handleCardClick(card);
          console.log('second Card= ', card);
          nbrOfclicks = 0;
          if (firstCard !== null) {
            firstCard = null;
          }
        }, 850);

        // Puisque les cartes clicker ne sont pas identique on enleve une vie au joueur
        animationBreakHeart();

        // Si le joueur n'as plus de vie restantes , On affiche "GAME OVER" apres un court delai.
        // On met le popUp alert dans un setTimeout afin de laisser asser de temps au cartes de se remettre dans le bon sens
        if (countHeartPlayer === 0) {
          setTimeout(() => {
            clearPage();
            gameOver();
          }, 1000);
        }
      } else {
        // On verifier si les cartes clicker sont pas des cartes deja trouvées
        if (card.classList.contains('card-found') && firstCard.classList.contains('card-found')) {
          return;
        }
        // Si les 2 cartes sont identique on ajoute alors a leurs attribut class "card-found" afin de desactive leur ecouteurs evenements et donc ne plus les retourner.
        card.classList.add('card-found');
        firstCard.classList.add('card-found');

        // On remet la first Card a Null ,on enleve des point de vies au boss et on remet le nombre de click a 0.
        firstCard = null;
        nbrOfclicks = 0;
        bossLife -= 10;
        bossLifeWrapper.innerText = bossLife;
        animationBossLife(lifeBarWrapper);

        if (bossLife === 0) {
          stopGameTimer();
          setTimeout(() => {
            clearPage();
            victory();
          }, 850);
        }
      }
    }
  }

  function startGameTimer() {
    /** *************************************************************************************
     *    Title: creation d'un chronometre en javascript
     *    Author: ChatGpt -> https://chat.openai.com/
     *    Date: no date
     *    Code version: no code version
     *    Availability: https://chat.openai.com/
     *
     ************************************************************************************** */

    const gameTimerElement = document.getElementById('gameTimer');

    idGameTimer = setInterval(() => {
      gameSeconds++;
      gameTimerElement.innerText = `Temps de jeu : ${formatTime(gameSeconds)}`;
    }, 1000);
  }

  function stopGameTimer() {
    clearInterval(idGameTimer);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerOfThePlayer = `${formatANumber(minutes)}:${formatANumber(seconds)}`;
    return `${formatANumber(minutes)}:${formatANumber(seconds)}`;
  }

  function formatANumber(value) {
    return value < 10 ? `0${value}` : value;
  }

  function animationBreakHeart() {
    const hearts = document.querySelectorAll('.heart');
    if (hearts) {
      const heart = hearts[hearts.length - 1];
      heart.className = 'skull';
      heart.src = imgskull;
      countHeartPlayer--;
    }
  }

  function gameOver() {
    const divGameOver = `<div class="game-over-container full-screen-bg">
                          <h1 class="h1-game-over">GAME OVER !</h1>
                          <button id="tryAgain" class="btn btn-warning button-game-over-try">Réessayer</button>
                          <button id="giveUp" class="btn btn-warning button-game-over-give">Abandonner</button>
                        </div>
                        `;
    main.innerHTML = divGameOver;

    const tryAgain = document.getElementById('tryAgain');
    tryAgain.addEventListener('click', () => {
      Navigate(`/game?levelId=${levelparams}`);
    });
    const giveUp = document.getElementById('giveUp');
    giveUp.addEventListener('click', () => {
      Navigate('/worlds');
    });
  }

  async function victory() {
    try {
      const player = getAuthenticatedUser();
      const { playerId } = player;
      const score = gameSeconds;
      const levelId = levelparams;

      const response = await fetch(`${process.env.API_BASE_URL}/scores/addScore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, score, levelId }),
      });
      if (!response.ok) {
        throw new Error('Réponse Network pas ok');
      }
      const data = await response.json();
      setXp(data.xp);
      setLastLevel(data.lastLevel);
    } catch (error) {
      console.error('Erreur lors de la récupération des scores: ', error);
    }

    const rank = calculateRank();
    const experience = rank.progressPercentage;

    const divGameOver = `
    <div class="victory-container full-screen-bg text-center">
      <h1 class="h1-victory">Bravo aventurier</h1>
      <p class="p-victory">Vous avez fini en seulement ${timerOfThePlayer}</p>
      <p class="p-victory">Vous avez gagné beaucoup d'expérience grâce à ce temps</p>
      <div class="experience-victory"> Rank: ${rank.level}</div>
      <div class="progress" style="width: 50%; margin: 0 auto;">
        <div class="bg-success progress-bar-animated" role="progressbar" style="height: 30px; width: ${experience}%;" aria-valuenow="${experience}" aria-valuemin="0" aria-valuemax="100">${experience}%</div>
      </div>
      <br>
      <button id="replayLevel" class="btn btn-warning button-victory">Recommencer</button>
      <button id="goToWorld" class="btn btn-warning button-victory">Mondes</button>
      <button id="nextLevel" class="btn btn-warning button-victory">Prochain Niveau</button>
    </div>
    `;

    main.innerHTML = divGameOver;

    const replayLevel = document.getElementById('replayLevel');
    replayLevel.addEventListener('click', () => Navigate(`/game?levelId=${levelparams}`));
    const goToWorld = document.getElementById('goToWorld');
    goToWorld.addEventListener('click', () => Navigate('/worlds'));
    const nextLevel = document.getElementById('nextLevel');
    nextLevel.addEventListener('click', () => {
      let numericLevel = parseInt(levelparams, 10);
      numericLevel += 1;
      levelparams = numericLevel.toString();
      Navigate(`/game?levelId=${levelparams}`);
    });
  }
};

export default GamePage;
