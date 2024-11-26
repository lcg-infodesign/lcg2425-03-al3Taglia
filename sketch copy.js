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
let maxTemp; // Variabile per il massimo valore di avg_temp

function setup() {
  
  // Usa getRows solo per i dati che necessitano di un array (come length, discharge, area)
  let dataRows = data.getRows(); // Restituisce un array di righe

   // Calcolo i valori massimi per length, discharge e area
  let lengths = dataRows.map(row => parseFloat(row.getString("length")));
  let discharges = dataRows.map(row => parseFloat(row.getString("discharge")));
  let areas = dataRows.map(row => parseFloat(row.getString("area")));
  let temps = dataRows.map(row => parseFloat(row.getString("avg_temp")));

   maxLength = Math.max(...lengths); // Trova il massimo valore per length
   maxDischarge = Math.max(...discharges); // Trova il massimo valore per discharge
   maxArea = Math.max(...areas); // Trova il massimo valore per area
   maxTemp = Math.max(...temps); // Trova il massimo valore per avg_temp

  // Usa getObject() per avere i dati strutturati in un oggetto
  dataObj = data.getObject(); // Usa getObject() se ti serve accedere ai dati come oggetto (per esempio per altre elaborazioni)

  // Calcolo la larghezza totale 
  let totalWidth = padding; // inizia con il padding iniziale
  for (let i = 0; i < data.getRowCount(); i++) {
    let discharge = parseFloat(dataObj[i].discharge); // Portata del fiume, parse load serve per rendere la stringa un numero
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
    let river = dataObj[i];

    // Calcolo altezza proporzionale alla lunghezza del fiume
    let riverLength = parseFloat(river.length); // Lunghezza del fiume
    let heightRatio = map(riverLength, 0, maxLength, 50, height - 100); // Mappa la lunghezza all'altezza

    // Calcolo larghezza proporzionale alla portata del fiume
    let discharge = parseFloat(river.discharge); // Portata del fiume
    let widthRatio = map(discharge, 0, maxDischarge, 10, 200); // Mappa la portata alla larghezza

    // Calcolo altezza del rettangolo di sfondo in base all'area
    let riverArea = parseFloat(river.area); // Area del fiume
    let areaHeight = map(riverArea, 0, maxArea, 30, height - 415); // Mappa l'area all'altezza del rettangolo di sfondo
    
     // Calcolo il colore in base alla temperatura media
     let riverTemp = parseFloat(river.avg_temp); // Temperatura media
     let tempColor = lerpColor(color(0, 0, 255), color(255, 0, 0), map(riverTemp, 0, maxTemp, 0, 1));

     
    // Disegno il rettangolo di sfondo
    drawBackgroundRectangle(xPos, yPos, widthRatio, areaHeight, tempColor);

    // Disegno il rettangolo con il bordo
    drawRectangle(xPos, yPos, widthRatio, heightRatio, tempColor);

    // Aggiorno la posizione x per il prossimo rettangolo
    xPos += widthRatio + padding; // Spazio tra i rettangoli
  }
}

function drawBackgroundRectangle(x, y, width, height, tempColor) {
  fill(tempColor.levels[0], tempColor.levels[1], tempColor.levels[2], 200); // Colore di riempimento per il rettangolo di sfondo, con opacità diminuità
  noStroke(); // Nessun bordo per il rettangolo di sfondo
  rect(x, y - height, width, height); // Appoggia il rettangolo sul bordo inferiore dello schermo
}

function drawRectangle(x, y, width, height, tempColor) {
  noFill(); // Nessun riempimento per il rettangolo
  
  stroke(tempColor); // Colore del bordo
  strokeWeight(1); // Spessore del bordo
  rect(x, y - height, width, height); // Appoggia il rettangolo sul bordo inferiore dello schermo
}