let data;
let latitudineMinima, longitudineMinima, latitudineMassima, longitudineMassima;
let margine = 20;

function preload() {
  data = loadTable("assets/sipri-report-explosions.csv", "CSV", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // deifnisco valori minimi e massimi per la latitudine
  let tutteLeLatitudini = data.getColumn("latitude");
  latitudineMinima = min(tutteLeLatitudini);
  latitudineMassima = max(tutteLeLatitudini);

  //deifnisco valori minimi e massimi per la lagitudine
  let tutteLeLongitudini = data.getColumn("longitude");
  longitudineMinima = min(tutteLeLongitudini);
  longitudineMassima = max(tutteLeLongitudini);

  console.log(longitudineMassima);
}

function draw() {
  background(10);

  for (let i=0; i<data.getRowCount(); i++) {
    //leggo i dati della singola riga
    let longitudine = data.getNum(i, "longitude");
    let latitudine = data.getNum(i, "latitude");
    let paese = data.getString(i, "country");
    
    // converto le coordinate geografiche in pixel
    let x = map(longitudine, longitudineMinima, longitudineMassima, margine, width-margine);
    let y = map(latitudine, latitudineMinima, latitudineMassima, height-margine, margine);
    let raggio = 10;

    // calcolo la distanza
    let distanza = dist(x, y, mouseX, mouseY);

    if(distanza < raggio) {
      fill("red");
    } else {
      fill("yellow");
    }

    ellipse(x, y, raggio*2);

    if (distanza < raggio){
      fill("white");
      text(paese, x, y);
    }
  }



}
