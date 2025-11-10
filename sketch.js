let margine = 100;
let data;
let latitudineMinima, longitudineMinima, latitudineMassima, longitudineMassima, altezzaMinima, altezzaMassima;

let vulcanoSelezionato = null; 

function preload() {
  data = loadTable("assets/vulcani.csv", "CSV", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // deifnisco valori minimi e massimi per la latitudine
  let tutteLeLatitudini = data.getColumn("Latitude");
  latitudineMinima = min(tutteLeLatitudini);
  latitudineMassima = max(tutteLeLatitudini);

  //deifnisco valori minimi e massimi per la lagitudine
  let tutteLeLongitudini = data.getColumn("Longitude");
  longitudineMinima = min(tutteLeLongitudini);
  longitudineMassima = max(tutteLeLongitudini);

  let tutteLeAltezze = data.getColumn("Elevation (m)");
  altezzaMinima = min(tutteLeAltezze);
  altezzaMassima = max(tutteLeAltezze);
  
}

function draw() {
  background(10);

  scriviTitolo();
  scriviFooter();

hoveredVolcano = null;

  for (let i=0; i<data.getRowCount(); i++) {
    //leggo i dati della singola riga
    let riga = data.getRow(i);
    let longitudine = data.getNum(i, "Longitude");
    let latitudine = data.getNum(i, "Latitude");
    let altezza = float(riga.get("Elevation (m)"));
    let paese = data.getString(i, "Country");
    let nomeVulcano = riga.get("Volcano Name") || "Unknown";
    let tipo = riga.get("Type");
    let status = data.getString(i, "Status");
    // converto le coordinate geografiche in pixel
    let x = map(longitudine, longitudineMinima, longitudineMassima, margine, width-margine);
    let y = map(latitudine, latitudineMinima, latitudineMassima, height-margine, margine);
    let activeColor = 100;
    let dormantColor = 50;
    let otherColor = null;
    let trasparenzaVulcano;
    if (status.includes("Historical") || status.startsWith("D")) {
        trasparenzaVulcano = activeColor;
    } else if (status.includes("Holocene") || status === "U") {
        trasparenzaVulcano = dormantColor;
    } else {
        trasparenzaVulcano = otherColor;
    }
    let coloreAltitudine = map(altezza, altezzaMinima, altezzaMassima, 0, 1);
    let gammaColoriPerAltitudine = lerpColor(color(0, 200, 0, trasparenzaVulcano), color(255, 0, 0, trasparenzaVulcano), coloreAltitudine);
    fill(gammaColoriPerAltitudine);


    //fill("yellow");
    let raggio = 5;

    // calcolo la distanza
    let distanza = dist(x, y, mouseX, mouseY);

    //if(distanza < raggio) {
    //  raggio = 10;
    //} 
    
    ellipse(x, y, raggio*2);

    if (distanza < raggio){
      //text(paese, x, y);
      hoveredVolcano = {paese, nomeVulcano, tipo, altezza, x, y};
    }

     // se il vulcano è hovered, disegna un bordo di evidenziazione
    if (hoveredVolcano && hoveredVolcano.nomeVulcano === nomeVulcano) {
      stroke(200);
      strokeWeight(2);
      ellipse(x, y, raggio*2);
      noStroke();
    }
  }

  // tooltip / label del vulcano sotto il mouse
  if (hoveredVolcano) {
    drawTooltip(hoveredVolcano);
  }

  function drawTooltip(volcano) {
  push();
  textSize(12);
  let padding = 8;
  let lineeTesto = [`${volcano.paese}`, `${volcano.nomeVulcano}`, `${volcano.tipo}`, `${nf(volcano.altezza, 0, 0)} m`];

  // calcola larghezza testo
  textAlign(LEFT, TOP);
  let tw = 0;
  for (let t of lineeTesto) {
    tw = max(tw, textWidth(t));
  }
  tw += padding * 2;
  let th = lineeTesto.length * 16 + padding * 2;

  // posizione iniziale: preferisci sopra a destra del punto
  let tx = volcano.x + 12;
  let ty = volcano.y - th - 12;

  // sanity checks: non uscire dallo schermo
  if (tx + tw > width - 8) tx = volcano.x - tw - 12;
  if (ty < 8) ty = volcano.y + 12;

  // box tooltip
  fill(255, 250, 240, 240);
  stroke(180);
  strokeWeight(1);
  rect(tx, ty, tw, th, 6);

  // testo
  noStroke();
  fill(20);
  for (let i = 0; i < lineeTesto.length; i++) {
    text(lineeTesto[i], tx + padding, ty + padding + i * 16);
  }

  // lineetta che collega al punto
  stroke(150, 300);
  strokeWeight(2);
  line(constrain(volcano.x, tx, tx + tw), constrain(volcano.y, ty, ty + th), volcano.x, volcano.y);

  pop();
}
  }

// per lo stato cambiare opacità
// se c'è tempo inserire anche una mappa

function scriviTitolo() {
  push();
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  textSize(40);
  fill(250); 
  text("VULCANI NEL MONDO", width - 100, 60);
  pop();
}

function scriviFooter() {
  textAlign(CENTER, CENTER);
  textSize(12);
  fill(250);
  text("Silvia La mastra — Assignment 03", width / 2, height - 20);
}

