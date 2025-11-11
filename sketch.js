let margine = 150;
let data;
let latitudineMinima, longitudineMinima, latitudineMassima, longitudineMassima, altezzaMinima, altezzaMassima;

let vulcanoSelezionato = null; 

function preload() {
  data = loadTable("assets/vulcani.csv", "CSV", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // deifnisco valori minimi e massimi per la latitudine
  const tutteLeLatitudini = data.getColumn("Latitude");
  latitudineMinima = min(tutteLeLatitudini);
  latitudineMassima = max(tutteLeLatitudini);

  //deifnisco valori minimi e massimi per la lagitudine
  const tutteLeLongitudini = data.getColumn("Longitude");
  longitudineMinima = min(tutteLeLongitudini);
  longitudineMassima = max(tutteLeLongitudini);

  const tutteLeAltezze = data.getColumn("Elevation (m)");
  altezzaMinima = min(tutteLeAltezze);
  altezzaMassima = max(tutteLeAltezze);
  
}

function draw() {
  background(10);

  scriviTitolo();
  scriviFooter();
  disegnaLegenda();

  vulcanoSelezionato = null;

  for (let i=0; i<data.getRowCount(); i++) {
    //leggo i dati della singola riga
    const riga = data.getRow(i);

    const longitudine = data.getNum(i, "Longitude");
    const latitudine = data.getNum(i, "Latitude");
    const altezza = float(riga.get("Elevation (m)"));

    const paese = data.getString(i, "Country");
    const nome = riga.get("Volcano Name") || "Unknown";
    const tipo = riga.get("Type");
    const status = data.getString(i, "Status");

    // converto le coordinate geografiche in pixel
    let x = map(longitudine, longitudineMinima, longitudineMassima, margine, width-margine);
    let y = map(latitudine, latitudineMinima, latitudineMassima, height-margine, margine);

    // definisco trasparenza in base allo stato del vulcano
    let trasparenzaVulcanoAttivo = 100;
    let trasparenzaVulcanoDormiente = 50;
    let altriStatiVulcanici = null;
    const alpha = dammiTrasparenzaVulcano(status, trasparenzaVulcanoAttivo, trasparenzaVulcanoDormiente, altriStatiVulcanici);
    
    //coloro in vari modi i puntini per rappresentare altezza vulcano
    //da verde(più basso) a rosso(più alto)
    let coloreAltitudine = map(altezza, altezzaMinima, altezzaMassima, 0, 1);
    let gammaColoriPerAltitudine = lerpColor(color(0, 200, 0, alpha), color(255, 0, 0, alpha), coloreAltitudine);
    fill(gammaColoriPerAltitudine);

    let raggio = 5;

    // calcolo la distanza
    const distanza = dist(x, y, mouseX, mouseY);
    // se la distanza è minore del raggio aumenta di dimensione
    if(distanza < raggio) {
      raggio = 10;
    } 
    // disegna ellisse
    ellipse(x, y, raggio*2);

    if (distanza < raggio){
      //text(paese, x, y);
      vulcanoSelezionato = {paese, nomeVulcano: nome, tipo, altezza, x, y};
    }

     // se il vulcano è hovered evidenzia bordo
    if (vulcanoSelezionato && vulcanoSelezionato.nome === nome) {
      push();
      stroke(200);
      strokeWeight(2);
      ellipse(x, y, raggio*2);
      noStroke();
      pop(); 
    }
  }

  // tooltip / label descrizione vulcano
  if (vulcanoSelezionato) {
    disegnaToolTip(vulcanoSelezionato);
  }

}

function scriviTitolo() {
  push();
  textStyle(BOLD);
  textAlign(CENTER);
  textSize(40);
  fill(250); 
  text("VULCANI NEL MONDO", width - 1200, 60);
  pop();
}

function scriviFooter() {
  textAlign(CENTER, CENTER);
  textSize(12);
  fill(250);
  text("Silvia La mastra — Assignment 03", width / 2, height - 20);
}


function dammiTrasparenzaVulcano(status, trasparenzaVulcanoAttivo, trasparenzaVulcanoDormiente, altriStatiVulcanici) {
  if (status.includes("Historical") || status.startsWith("D")) {
        trasparenzaVulcano = trasparenzaVulcanoAttivo;
    } else if (status.includes("Holocene") || status === "U") {
        trasparenzaVulcano = trasparenzaVulcanoDormiente;
    } else {
        trasparenzaVulcano = altriStatiVulcanici;
    }
  return(trasparenzaVulcano);
}

function disegnaToolTip(volcano) {
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

  // posizione iniziale
  let tx = volcano.x + 12;
  let ty = volcano.y - th - 12;

  //non uscire dallo schermo
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

  // linea collegamento
  stroke(150, 300);
  strokeWeight(2);
  line(constrain(volcano.x, tx, tx + tw), constrain(volcano.y, ty, ty + th), volcano.x, volcano.y);
  pop();
}

function disegnaLegenda() {
   const x0 = width - margine - 220;
  const y0 = 40;

  push();
  // Titolo legenda
  fill(230);
  textAlign(LEFT, CENTER);
  textSize(12);
  text("Legenda", x0, y0);

  // Gradiente quota
  const gX = x0;
  const gY = y0 + 14;
  const gW = 160;
  const gH = 10;

  noStroke();
  for (let i = 0; i < gW; i++) {
    const t = i / (gW - 1);
    const c = lerpColor(color(0, 200, 0), color(255, 0, 0), t);
    stroke(red(c), green(c), blue(c));
    line(gX + i, gY, gX + i, gY + gH);
  }
  noStroke();
  fill(180);
  textSize(10);
  textAlign(LEFT, TOP);
  text("Quota bassa", gX, gY + gH + 4);
  textAlign(RIGHT, TOP);
  text("Quota alta", gX + gW, gY + gH + 4);

  // Trasparenza stato
  const sY = gY + gH + 24;
  fill(255, 0, 0, 150);
  ellipse(gX + 8, sY, 10);
  fill(230);
  textAlign(LEFT, CENTER);
  text("Attivo / eruzioni storiche", gX + 20, sY);

  fill(255, 0, 0, 70);
  ellipse(gX + 8, sY + 16, 10);
  fill(230);
  text("Dormiente / olocene", gX + 20, sY + 16);

  fill(255, 0, 0, 30);
  ellipse(gX + 8, sY + 32, 10);
  fill(230);
  text("Altro/ignoto", gX + 20, sY + 32);
}
