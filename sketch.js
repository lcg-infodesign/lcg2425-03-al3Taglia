//rappresentazione dei fiumi con delle barre verticali che partano dal basso dello schermo
//lla larghezza delle barre rappresneta la portata
//l'altezza la lunghezza
//il riempimento l'area
//il colore la temperatura media
//il nome del fiume sotto, per vederlo bisogna scrollare --> si può giocare a indovinare di che fiume si tratta



let data;
let dataObj;

function preload() {
  // per caricare il dataset
  data = loadTable("assets/DatasetFiumi.csv", "csv", "header");
}

//colori
let pageColor="#ededed";

//altre variabili
let padding = 15; // spazio tra i rettangoli
let maxLength; // variabile per il massimo valore di length
let maxDischarge; // variabile per il massimo valore di discharge
let maxArea; // variabile per il massimo valore di area
let maxTemp; // variabile per il massimo valore di avg_temp

// altezza per titolo e legenda
let titleHeight = 60;
let legendHeight = 80;

function setup() {
  
  // si usa getRows solo per i dati che necessitano di un array (come length, discharge, area)
  let dataRows = data.getRows(); // restituisce un array di righe

   // calcolo i valori massimi per length, discharge e area
  let lengths = dataRows.map(row => parseFloat(row.getString("length")));
  let discharges = dataRows.map(row => parseFloat(row.getString("discharge")));
  let areas = dataRows.map(row => parseFloat(row.getString("area")));
  let temps = dataRows.map(row => parseFloat(row.getString("avg_temp")));

   maxLength = Math.max(...lengths); // trova il massimo valore per length
   maxDischarge = Math.max(...discharges); // trova il massimo valore per discharge
   maxArea = Math.max(...areas); // trova il massimo valore per area
   maxTemp = Math.max(...temps); // trova il massimo valore per avg_temp

  // si usa getObject() per avere i dati strutturati in un oggetto
  dataObj = data.getObject(); // si usa getObject() se ti serve accedere ai dati come oggetto (per esempio per altre elaborazioni)

  // calcolo la larghezza totale 
  let totalWidth = padding; // inizia con il padding iniziale
  for (let i = 0; i < data.getRowCount(); i++) {
    let discharge = parseFloat(dataObj[i].discharge); // portata del fiume, parse load serve per rendere la stringa un numero
    let widthRatio = map(discharge, 0, maxDischarge, 10, 200); // calcola la larghezza del rettangolo
    totalWidth += widthRatio + padding; // somma larghezza rettangolo e padding
  }
  
  createCanvas(totalWidth, windowHeight +200);
  background(pageColor);
  
  // disegna il titolo e la legenda una sola volta
  drawTitle("Mappatura dei fiumi");
  drawLegend();

  // posizione iniziale per il disegno dei rettangoli
  let xPos = padding; // posizione iniziale x per i rettangoli
  let yPos = windowHeight; // la base dello schermo, dove appoggiano i rettangoli

   // ciclo per disegnare un rettangolo per ogni fiume
   for (let i = 0; i < data.getRowCount(); i++) {
    // Carico i dati della riga
    let river = dataObj[i];

    // calcolo altezza proporzionale alla lunghezza del fiume
    let riverLength = parseFloat(river.length); // Lunghezza del fiume
    let heightRatio = map(riverLength, 0, maxLength, 50, height - 300); // Mappa la lunghezza all'altezza

    // calcolo larghezza proporzionale alla portata del fiume
    let discharge = parseFloat(river.discharge); // Portata del fiume
    let widthRatio = map(discharge, 0, maxDischarge, 10, 200); // Mappa la portata alla larghezza

    // calcolo altezza del rettangolo di sfondo in base all'area
    let riverArea = parseFloat(river.area); // Area del fiume
    let areaHeight = map(riverArea, 0, maxArea, 30, height - 615); // Mappa l'area all'altezza del rettangolo di sfondo
    
     // calcolo il colore in base alla temperatura media
     let riverTemp = parseFloat(river.avg_temp); // Temperatura media
     let tempColor = lerpColor(color(0, 0, 255), color(255, 0, 0), map(riverTemp, 0, maxTemp, 0, 1));

     
    // disegno il rettangolo di sfondo
    drawBackgroundRectangle(xPos, yPos, widthRatio, areaHeight, tempColor);

    // disegno il rettangolo con il bordo
    drawRectangle(xPos, yPos, widthRatio, heightRatio, tempColor);
    
    // disegno il nome del fiume sotto il rettangolo, in verticale
    let riverName = river.name ? river.name : "Unknown"; // nome del fiume o "Unknown"
    drawVerticalText(riverName, xPos + widthRatio / 2, yPos + 10);

    // aggiorno la posizione x per il prossimo rettangolo
    xPos += widthRatio + padding; // spazio tra i rettangoli
  }
}

// funzione per disegnare il titolo
function drawTitle(title) {
  textSize(24);
  textAlign(LEFT, TOP);
  fill(0);
  text(title, padding, 10); // posiziona il titolo al centro in alto
}

// funzione per disegnare la legenda
function drawLegend() {
  //linea dell'altezza + testo
  strokeWeight(1);
  stroke(128,128,128);
  line(50,50,50,80);
  line(45,50,55,50);
  line(45,80,55,80);
  
  textSize(12);
  noStroke();
  text("lunghezza", 70,60);

  //linea della lunghezza + testo
  stroke(128,128,128);
  strokeWeight(1);
  line(210,65,250,65);
  line(210,60,210,70);
  line(250,60,250,70);
  
  textSize(12);
  noStroke();
  text("portata", 270,60);

  //area
  fill(128,128,128,200);
  rect(370,50,20,30);
  
  fill(0);
  textSize(12);
  text("area", 400,60);

  //temperatura
  let gradientStartX = 500; // inizio della linea del gradiente
  let gradientEndX = 700;   // fine della linea del gradiente
  let yPosition = 65;       // posizione verticale della linea

  //                           disegna il gradiente
  for (let x = gradientStartX; x < gradientEndX; x++) {
    let t = map(x, gradientStartX, gradientEndX, 0, 1); // calcola la posizione relativa (da 0 a 1)
    let tempColor = lerpColor(color(0, 0, 255), color(255, 0, 0), t); // interpola il colore
    stroke(tempColor);
    strokeWeight(5);
    point(x, yPosition); // disegna un punto del gradiente
  }

  noStroke();
  fill(0);
  textSize(18);
  text("-", gradientStartX, yPosition + 5);
  text("+", gradientEndX, yPosition + 5);
  
}

//funzione per disegnare i rettangoli per l'area
function drawBackgroundRectangle(x, y, width, height, tempColor) {
  fill(tempColor.levels[0], tempColor.levels[1], tempColor.levels[2], 200); // colore di riempimento per il rettangolo di sfondo, con opacità diminuità
  noStroke(); 
  rect(x, y - height, width, height); // appoggia il rettangolo sul bordo inferiore dello schermo
}

//funzioni per disegnare i rettangoli che rappresentano lunghezza e portata
function drawRectangle(x, y, width, height, tempColor) {
  noFill(); // nessun riempimento per il rettangolo
  
  stroke(tempColor); // colore del bordo
  strokeWeight(1); // spessore del bordo
  rect(x, y - height, width, height); // appoggia il rettangolo sul bordo inferiore dello schermo
}

// funzione per disegnare il testo in verticale (rotazione in senso orario)
function drawVerticalText(label, x, y) {
  push(); // aalva il contesto corrente
  translate(x, y); // sposta l'origine al punto (x, y), che è la base del rettangolo
  rotate(HALF_PI); // ruota il testo di 90 gradi in senso orario
  textAlign(LEFT, CENTER); // allinea il testo a sinistra e al centro in verticale
  fill(0); // colore del testo
  textSize(12); // dimensione del testo
  text(label, 0, 0); // disegna il testo, partendo dal punto di origine
  pop(); // ripristina il contesto precedente
}