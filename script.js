// Interaktiv SVG-side
const svgPlaceholder = document.querySelector(".svg-placeholder");

// Opsamlingsside
const opsamlingPlaceholder = document.querySelector(".opsamling-placeholder");

if (opsamlingPlaceholder) {
  const params = new URLSearchParams(window.location.search);
  // Eksempel: params.get("navn") henter værdien fra et formularfelt med name="navn".
}

function regnMedJordbaer() {
  const antal = 20;

  for (let i = 0; i < antal; i++) {
    const img = document.createElement("img");
    img.src = "imgs/jord_regn.png";
    img.alt = "";
    img.className = "jordbaer-regn";

    // Tilfældigt udseende og tempo
    img.style.width = 2 + Math.random() * 3 + "rem"; // 2-5rem
    img.style.left = Math.random() * 100 + "vw"; // spredt over bredden
    img.style.animationDuration = 4 + Math.random() * 4 + "s"; // 4-8 sekunders fald
    img.style.animationDelay = Math.random() * 3 + "s"; // forskudt start

    document.body.append(img);

    // Ryd op, når jordbæret er faldet færdigt
    img.addEventListener("animationend", () => img.remove());
  }
}

// Kør kun på forsiden (hvor .hero findes)
if (document.querySelector(".hero")) {
  regnMedJordbaer();
}
