let margine = 20;
let data;
let latitudineMinima, longitudineMinima, latitudineMassima, longitudineMassima, altezzaMinima, altezzaMassima;

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

  //let tutteLeAltezze = data.getColumn("Elevation (m)");
  //altezzaMinima = min(tutteLeAltezze);
  //altezzaMassima = max(tutteLeAltezze);
  
}

function draw() {
  background(10);

  for (let i=0; i<data.getRowCount(); i++) {
    //leggo i dati della singola riga
    let longitudine = data.getNum(i, "Longitude");
    let latitudine = data.getNum(i, "Latitude");
    //let altezza = data.getNum(i, "Elevation (m)");
    let paese = data.getString(i, "Country");

    // converto le coordinate geografiche in pixel
    let x = map(longitudine, longitudineMinima, longitudineMassima, margine, width-margine);
    let y = map(latitudine, latitudineMinima, latitudineMassima, height-margine, margine);
    //let coloreAltitudine = map(altezza, altezzaMinima, altezzaMassima, 0, 1);
    //let gammaColoriPerAltitudine = lerpColor(color(0, 200, 0), color(255, 0, 0), coloreAltitudine);
    //fill(gammaColoriPerAltitudine);
    fill("yellow");
    let raggio = 5;

    // calcolo la distanza
    let distanza = dist(x, y, mouseX, mouseY);

    if(distanza < raggio) {
      raggio = 10;
    } 
    
    ellipse(x, y, raggio*2);

    if (distanza < raggio){
      fill("white");
      text(paese, x, y);
    }
  }

// in base all'altezza cambiare colore figura
// in base al tipo se possibile cambiare forma
// per o stato cambiare opacità
// creare box che compare accanto al mouse
// al cui interno inserire: nome vulcano - paese 
// se c'è tempo inserire anche una mappa

}


/*function drawSun(x, y, radius, blur, color) {
  noStroke();

  // Applica un filtro di blur solo a questo elemento
  drawingContext.filter = "blur(" + blur + "px)";
  fill(color);
  ellipse(x, y, radius, radius);

  // Reset del filtro per i prossimi elementi
  drawingContext.filter = "none";
}

// Funzione per disegnare un tooltip vicino al mouse
function drawTooltip(px, py, textString) {
  textSize(16);
  textAlign(LEFT, CENTER);
  fill("white");
  stroke("black");
  text(textString, px, py);
}
*/