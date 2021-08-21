"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

// Wrapper function that gives pre-generated shuffled list of cards.
const colors = () => shuffle(COLORS);

createCards(colors);

const cardsClicked = [];
let lockCards = false;



/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */
function createCards(colors) {
  const gameBoard = document.getElementById("game");
  
  for (let color of colors()) {
    // create div for card, append it to gameBoard and give it a class per the color array
    const card = document.createElement("div");
    const back = document.createElement('img');

    gameBoard.appendChild(card);

    card.classList.add("card", color, "unflipped");
    card.style.backgroundColor = color;
    card.appendChild(back);

    back.src = "images/cardBack.png";
    back.alt = "Card back image";
    back.draggable = false;
    back.classList.add("cardBack")
  }
}

/** Flip a card face-up. */
function flipCard(card) {
  const image = card.firstElementChild;

  if (card.classList.contains("unflipped")) {
    card.classList.remove("unflipped");
    card.classList.add("flipped");

    image.style.display = "none";
  }
}

/** Flip a card face-down. */
function unFlipCard(card) {
  const image = card.firstElementChild;

  if (card.classList.contains("flipped") && !card.classList.contains("matchFound")) {
    card.classList.remove("flipped");
    card.classList.add("unflipped");

    image.style.display = "inline-block";
  }
}

/** Determine whether or not two cards match */
function doCardsMatch(card1, card2) {
  const classList1 = card1.classList;
  const classList2 = card2.classList;

  if (classList1[1] === classList2[1]) return true;
}

function resetGame() {
  const gameBoard = document.getElementById("game");
  const congratulations = document.getElementById("congrats");

  setTimeout(() => {
    congratulations.style.display = "block";
  }, 500);

  setTimeout(() => {
    congratulations.style.display = "none";

    Array.from(gameBoard.children).forEach(element => {
      element.remove();
    });

    createCards(colors);
  }, 3000);
};

function isGameOver() {
  const cards = document.getElementsByClassName("card");

  return Array.from(cards).every((card) => {
    return card.classList.contains("matchFound");
  });
}

/** Handle clicking on a card: this could be first-card or second-card. */
function handleCardClick(evt) {
  evt.preventDefault();
  if (lockCards) {return;}
  if (cardsClicked.length < 3 && !evt.target.parentElement.classList.contains("matchFound")
        && evt.target.parentElement.classList.contains("unflipped")){
    cardsClicked.push(evt.target.parentElement);
    flipCard(evt.target.parentElement);
  }

  if (cardsClicked.length === 2) {
    const card1 = cardsClicked[0];
    const card2 = cardsClicked[1];
    if (doCardsMatch(card1, card2)) {
      card1.classList.add("matchFound");
      card2.classList.add("matchFound");
    } else {
      lockCards = true;
      setTimeout(() => {
        unFlipCard(card1);
        unFlipCard(card2);
        lockCards = false;
      }, 1000);
    }

    cardsClicked = [];
  }

  if (isGameOver()) resetGame();
}

document.getElementById("game").addEventListener("click", handleCardClick);
