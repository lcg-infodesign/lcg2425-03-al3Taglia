let data;
let dataObj;

function preload() {
  // per caricare il dataset
  data = loadTable("assets/datasetfiumi.csv", "csv", "header");
}

//colori
let pageColor="#ededed";
let rectColor="darkblue";
let rectStroke = "darkblue";

//altre variabili
let padding = 15; // spazio tra i rettangoli
let maxLength; // Variabile per il massimo valore di length
let maxDischarge; // Variabile per il massimo valore di discharge
let maxArea; // Variabile per il massimo valore di area

function setup() {
  
  // Usa getRows solo per i dati che necessitano di un array (come length, discharge, area)
  let dataRows = data.getRows(); // Restituisce un array di righe

   // Calcolo i valori massimi per length, discharge e area
  let lengths = dataRows.map(row => parseFloat(row.getString("length")));
  let discharges = dataRows.map(row => parseFloat(row.getString("discharge")));
  let areas = dataRows.map(row => parseFloat(row.getString("area")));
 
   maxLength = Math.max(...lengths); // Trova il massimo valore per length
   maxDischarge = Math.max(...discharges); // Trova il massimo valore per discharge
   maxArea = Math.max(...areas); // Trova il massimo valore per area
  
  // Usa getObject() per avere i dati strutturati in un oggetto
  dataObj = data.getObject(); // Usa getObject() se ti serve accedere ai dati come oggetto (per esempio per altre elaborazioni)

  // Calcolo la larghezza totale 
  let totalWidth = padding; // inizia con il padding iniziale
  for (let i = 0; i < data.getRowCount(); i++) {
    let discharge = parseFloat(dataRows[i].getString("discharge")); // Portata del fiume, parse load serve per rendere la stringa un numero
    let widthRatio = map(discharge, 0, maxDischarge, 10, 200); // Calcola la larghezza del rettangolo
    totalWidth += widthRatio + padding; // Somma larghezza rettangolo e padding
  }
 
   createCanvas(totalWidth, windowHeight);
   background(pageColor);

  // Posizione iniziale per il disegno dei rettangoli
  let xPos = padding; // Posizione iniziale x per i rettangoli
  let yPos = height; // La base dello schermo, dove appoggiano i rettangoli

   // Ciclo per disegnare un rettangolo per ogni fiume
   for (let i = 0; i < data.getRowCount(); i++) {
    // Carico i dati della riga
    let river = dataRows[i];

    // Calcolo altezza proporzionale alla lunghezza del fiume
    let riverLength = parseFloat(river.getString("length")); // Lunghezza del fiume
    let heightRatio = map(riverLength, 0, maxLength, 50, height - 100); // Mappa la lunghezza all'altezza

    // Calcolo larghezza proporzionale alla portata del fiume
    let discharge = parseFloat(river.getString("discharge")); // Portata del fiume
    let widthRatio = map(discharge, 0, maxDischarge, 15, 200); // Mappa la portata alla larghezza

    // Calcolo altezza del rettangolo di sfondo in base all'area
    let riverArea = parseFloat(river.getString("area")); // Area del fiume
    let areaHeight = map(riverArea, 0, maxArea, 10, height - 400); // Mappa l'area all'altezza del rettangolo di sfondo

    // Disegno il rettangolo di sfondo
    drawBackgroundRectangle(xPos, yPos, widthRatio, areaHeight);

    // Disegno il rettangolo con il bordo
    drawRectangle(xPos, yPos, widthRatio, heightRatio);

    // Aggiorno la posizione x per il prossimo rettangolo
    xPos += widthRatio + padding; // Spazio tra i rettangoli
  }
}

function drawBackgroundRectangle(x, y, width, height) {
  fill(rectColor); // Colore di riempimento per il rettangolo di sfondo
  noStroke(); // Nessun bordo per il rettangolo di sfondo
  rect(x, y - height, width, height); // Appoggia il rettangolo sul bordo inferiore dello schermo
}

function drawRectangle(x, y, width, height) {
  noFill(); // Nessun riempimento per il rettangolo
  stroke(rectStroke); // Colore del bordo
  strokeWeight(2); // Spessore del bordo
  rect(x, y - height, width, height); // Appoggia il rettangolo sul bordo inferiore dello schermo
}