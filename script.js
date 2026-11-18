/* =====================================
   EAT THE RAINBOW - JAVASCRIPT
===================================== */

const rainbowPath = document.querySelector("#rainbow-path");
const rainbowSvg = document.querySelector("#rainbow-svg");
const strawberry = document.querySelector("#strawberry");
const walkButton = document.querySelector("#walk-button");
const resetButton = document.querySelector("#reset-button");

if (rainbowPath && rainbowSvg && strawberry && walkButton && resetButton) {
  const pathLength = rainbowPath.getTotalLength();

  const programItems = Array.from(
    document.querySelectorAll(".rainbow-game .program-item"),
  );

  let currentStop = -1;
  let progress = 0;
  let animationId = null;

  const duration = 1600;

  function calculateStops() {
    const screenMatrix = rainbowPath.getScreenCTM();

    if (!screenMatrix) return [];

    const stopPositions = programItems.map((item) => {
      const rect = item.getBoundingClientRect();
      const targetY = rect.top + rect.height / 2;

      let bestProgress = 0;
      let bestDistance = Infinity;

      for (let i = 0; i <= 1000; i++) {
        const fraction = i / 1000;

        const point = rainbowPath.getPointAtLength(fraction * pathLength);

        const svgPoint = rainbowSvg.createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;

        const screenPoint = svgPoint.matrixTransform(screenMatrix);

        const distance = Math.abs(screenPoint.y - targetY);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestProgress = fraction;
        }
      }

      return {
        stop: Number(item.dataset.stop),
        progress: bestProgress,
      };
    });

    stopPositions.sort((a, b) => a.stop - b.stop);

    return stopPositions.map((item) => item.progress);
  }

  let stops = calculateStops();

  function moveStrawberry() {
    const point = rainbowPath.getPointAtLength(progress * pathLength);

    strawberry.setAttribute("x", point.x - 30);
    strawberry.setAttribute("y", point.y - 30);
  }

  function highlightStop() {
    programItems.forEach((item) => {
      item.classList.toggle(
        "active",
        Number(item.dataset.stop) === currentStop,
      );
    });
  }

  function animateToStop(targetProgress) {
    if (animationId !== null) return;

    walkButton.disabled = true;

    const startProgress = progress;
    const startTime = performance.now();

    function animate(timestamp) {
      const elapsed = timestamp - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      const eased = fraction * fraction * (3 - 2 * fraction);

      progress = startProgress + (targetProgress - startProgress) * eased;

      moveStrawberry();

      if (fraction < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        progress = targetProgress;
        animationId = null;

        moveStrawberry();
        highlightStop();

        if (currentStop === stops.length - 1) {
          walkButton.textContent = "Færdig! 🍓";
          walkButton.disabled = true;
        } else {
          walkButton.textContent = "Næste stop 🍓";
          walkButton.disabled = false;
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  walkButton.addEventListener("click", () => {
    if (animationId !== null) return;
    if (currentStop >= stops.length - 1) return;

    currentStop++;
    animateToStop(stops[currentStop]);
  });

  resetButton.addEventListener("click", () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }

    animationId = null;
    currentStop = -1;
    progress = 0;

    stops = calculateStops();

    moveStrawberry();
    highlightStop();

    walkButton.disabled = false;
    walkButton.textContent = "Start eventyret 🍓";
  });

  window.addEventListener("resize", () => {
    if (animationId !== null) return;

    stops = calculateStops();

    progress = currentStop < 0 ? 0 : stops[currentStop];

    moveStrawberry();
  });

  moveStrawberry();
  highlightStop();
}

const cardQuestion = document.querySelector("#card-question");
const cardTopic = document.querySelector("#card-topic");
const cardCounter = document.querySelector("#card-counter");

if (cardQuestion && cardTopic && cardCounter) {
  const params = new URLSearchParams(window.location.search);

  const age = Number(params.get("alder")) || 8;

  const fruit = (params.get("frugt") || "jordbær").trim().toLowerCase();

  const customTopic = (params.get("samtale") || "").trim();

  const selectedTopics = params.getAll("emner");

  const fruitEmojis = {
    kiwi: "🥝",
    banan: "🍌",
    jordbær: "🍓",
  };

  const chosenFruitEmoji = fruitEmojis[fruit] || "🍓";

  const ageOutput = document.querySelector("#result-age");
  const fruitOutput = document.querySelector("#result-fruit");
  const cardFruit = document.querySelector("#card-fruit");

  ageOutput.textContent = `${age} år`;

  fruitOutput.textContent = `Yndlingsfrugt: ${fruit} ${chosenFruitEmoji}`;

  cardFruit.textContent = chosenFruitEmoji;

  cardFruit.setAttribute("aria-label", `Barnets yndlingsfrugt: ${fruit}`);

  let ageGroup = "middle";

  if (age <= 5) {
    ageGroup = "young";
  } else if (age >= 11) {
    ageGroup = "older";
  }

  const questions = {
    "Mad og sundhed": {
      young: [
        `Hvilken farve har ${fruit}, og hvilke andre frugter har samme farve?`,
        `Hvis ${fruit} kunne tale, hvad ville den så sige?`,
        `Kan du finde på en sjov madpakke med ${fruit}?`,
      ],
      middle: [
        `Hvis du skulle lave en superhelte-madpakke, hvad ville du putte i den? Ville ${fruit} være med?`,
        `Hvorfor tror du, det er godt at spise forskellige slags frugt og grøntsager?`,
        `Hvis du skulle opfinde en sund snack med ${fruit}, hvordan skulle den så smage?`,
      ],
      older: [
        `Hvordan kan man gøre sunde madvaner sjove i stedet for kedelige?`,
        `Hvad synes du gør det nemt eller svært at vælge sund mad i hverdagen?`,
        `Hvordan ville du lave en sund og lækker ret med ${fruit}?`,
      ],
    },

    "Følelser og trivsel": {
      young: [
        `Hvad gør dig rigtig glad?`,
        `Hvis ${fruit} havde følelser, hvornår ville den så være glad?`,
        `Hvad hjælper dig, når du bliver ked af det?`,
      ],
      middle: [
        `Hvad er det bedste, der er sket for dig i denne uge?`,
        `Hvordan kan vi hjælpe hinanden, når vi har en dårlig dag?`,
        `Hvis dine følelser var forskellige frugter, hvilken ville være gladest?`,
      ],
      older: [
        `Hvad hjælper dig, når du føler dig presset eller stresset?`,
        `Hvordan kan familien blive bedre til at tale om følelser?`,
        `Hvad gør dig mest tryg og glad i hverdagen?`,
      ],
    },

    "Familie og hverdag": {
      young: [
        `Hvad er det sjoveste, vi laver sammen som familie?`,
        `Hvis hele familien var frugter, hvem ville så være ${fruit}?`,
        `Hvad vil du gerne lave sammen i weekenden?`,
      ],
      middle: [
        `Hvis hele familien skulle lave aftensmad sammen, hvad ville du så vælge?`,
        `Hvilken ny tradition kunne vi starte derhjemme?`,
        `Hvordan kan vi gøre vores måltider hyggeligere?`,
      ],
      older: [
        `Hvad synes du, vi kunne gøre anderledes for at få mere kvalitetstid sammen?`,
        `Hvordan kan vi gøre det lettere for alle at hjælpe til derhjemme?`,
        `Hvad betyder det for dig, at familien spiser sammen?`,
      ],
    },

    "Venner og fællesskab": {
      young: [
        `Hvad kan du bedst lide at lege med dine venner?`,
        `Hvis du delte ${fruit} med en ven, hvad ville I så lave bagefter?`,
        `Hvordan kan du gøre en ven glad?`,
      ],
      middle: [
        `Hvad synes du gør en person til en god ven?`,
        `Hvis du skulle arrangere en hyggelig picnic for dine venner, hvad ville du tage med?`,
        `Hvordan kan man hjælpe nogen, der føler sig udenfor?`,
      ],
      older: [
        `Hvad betyder det for dig at føle dig som en del af et fællesskab?`,
        `Hvordan håndterer du uenigheder med venner?`,
        `Hvad er vigtigt for dig i et godt venskab?`,
      ],
    },

    "Drømme og fantasi": {
      young: [
        `Hvis ${fruit} var en superhelt, hvilke kræfter ville den have?`,
        `Hvis du kunne flyve hvor som helst hen, hvor ville du tage hen?`,
        `Hvis du havde en magisk have, hvad ville der vokse i den?`,
      ],
      middle: [
        `Hvis du kunne opfinde en helt ny frugt, hvordan ville den se ud?`,
        `Hvis du kunne bygge din egen fantasiverden, hvad skulle der være i den?`,
        `Hvilken superkraft ville du vælge, og hvorfor?`,
      ],
      older: [
        `Hvis du kunne lære én ny ting med det samme, hvad ville du vælge?`,
        `Hvordan forestiller du dig din perfekte dag om ti år?`,
        `Hvis du kunne ændre én ting i verden, hvad ville det være?`,
      ],
    },

    "Sjove spørgsmål": {
      young: [
        `Ville du helst have hår lavet af spaghetti eller sko lavet af ${fruit}?`,
        `Hvis du var en frugt for en dag, hvilken ville du være?`,
        `Ville du helst kunne tale med dyr eller flyve?`,
      ],
      middle: [
        `Ville du helst spise ${fruit} hver dag i en uge eller prøve en helt ny frugt hver dag?`,
        `Hvis du åbnede din egen restaurant, hvad skulle den hedde?`,
        `Hvis du kunne bytte plads med en tegnefilmsfigur, hvem skulle det være?`,
      ],
      older: [
        `Hvis du skulle lave din egen madtrend, hvad skulle det være?`,
        `Ville du helst kunne rejse i tiden eller læse tanker?`,
        `Hvis du fik lov til at bestemme familiens regler i en dag, hvad ville du ændre?`,
      ],
    },
  };

  const cards = [];

  const topicsToUse = selectedTopics.length
    ? selectedTopics
    : ["Mad og sundhed"];

  topicsToUse.forEach((topic) => {
    if (questions[topic]) {
      const possibleQuestions = questions[topic][ageGroup];

      const randomIndex = Math.floor(Math.random() * possibleQuestions.length);

      cards.push({
        topic: topic,
        question: possibleQuestions[randomIndex],
      });
    }
  });

  if (customTopic) {
    let customQuestions;

    if (age <= 5) {
      customQuestions = [
        `Hvad kan du fortælle mig om ${customTopic}?`,
        `Hvad kan du bedst lide ved ${customTopic}?`,
        `Kan du finde på en lille historie om ${customTopic}?`,
      ];
    } else if (age <= 10) {
      customQuestions = [
        `Hvad synes du er mest spændende ved ${customTopic}?`,
        `Hvad kunne du godt tænke dig at vide mere om, når det handler om ${customTopic}?`,
        `Hvis du kunne ændre én ting ved ${customTopic}, hvad skulle det være?`,
      ];
    } else {
      customQuestions = [
        `Hvad er dine egne tanker om ${customTopic}?`,
        `Hvordan påvirker ${customTopic} dig i hverdagen?`,
        `Hvad synes du, vi som familie skal forstå bedre om ${customTopic}?`,
      ];
    }

    const randomIndex = Math.floor(Math.random() * customQuestions.length);

    cards.push({
      topic: "Jeres eget emne",
      question: customQuestions[randomIndex],
    });
  }

  if (cards.length === 0) {
    cards.push({
      topic: "Mad og sundhed",
      question: questions["Mad og sundhed"][ageGroup][0],
    });
  }

  let currentCard = 0;

  const previousButton = document.querySelector("#previous-card");
  const nextButton = document.querySelector("#next-card");

  function displayCard() {
    const card = cards[currentCard];

    cardTopic.textContent = card.topic;
    cardQuestion.textContent = card.question;

    cardCounter.textContent = `Kort ${currentCard + 1} af ${cards.length}`;

    previousButton.disabled = currentCard === 0;
    nextButton.disabled = currentCard === cards.length - 1;
  }

  previousButton.addEventListener("click", () => {
    if (currentCard > 0) {
      currentCard--;
      displayCard();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentCard < cards.length - 1) {
      currentCard++;
      displayCard();
    }
  });

  displayCard();
}
