let originalBits = [];

function calculate() {
  let input = document.getElementById("dataInput").value;
  if (!/^[01]{8}$/.test(input)) {
    alert("Lütfen 8 bitlik bir veri giriniz (örnek: 10110011)"); 
    return;
    
  }

  const d = input.split('').map(Number);
  originalBits = [];

  // Parity bitleri hesapla (Hamming(12,8) için pozisyonlar: 1,2,4,8)
  let p1 = d[0] ^ d[1] ^ d[3] ^ d[4] ^ d[6];
  let p2 = d[0] ^ d[2] ^ d[3] ^ d[5] ^ d[6];
  let p4 = d[1] ^ d[2] ^ d[3] ^ d[7];
  let p8 = d[4] ^ d[5] ^ d[6] ^ d[7];

  // Bit dizisi oluştur (1 tabanlı pozisyonlara parity'ler ekleniyor)
  originalBits = [
    p1,     // 1
    p2,     // 2
    d[0],   // 3
    p4,     // 4
    d[1],   // 5
    d[2],   // 6
    d[3],   // 7
    p8,     // 8
    d[4],   // 9
    d[5],   //10
    d[6],   //11
    d[7]    //12
  ];

   displayBits(originalBits, "hammingOutput", "", -1, [0,1,3,7]);
}

function addError() {
  const pos = parseInt(document.getElementById("errorBit").value);
  if (isNaN(pos) || pos < 1 || pos > 12) {
    alert("Geçersiz bit pozisyonu (1-12)");
    return;
  }

  const corruptedBits = [...originalBits];
  corruptedBits[pos - 1] = corruptedBits[pos - 1] ^ 1; // biti tersle
  displayBits(corruptedBits, "corruptedOutput", "corrupted");
  window.corruptedBits = corruptedBits;
}

function correct() {
  const bits = [...window.corruptedBits];

  // Parity kontrolleri
  let p1 = bits[0] ^ bits[2] ^ bits[4] ^ bits[6] ^ bits[8] ^ bits[10];
  let p2 = bits[1] ^ bits[2] ^ bits[5] ^ bits[6] ^ bits[9] ^ bits[10];
  let p4 = bits[3] ^ bits[4] ^ bits[5] ^ bits[6] ^ bits[11];
  let p8 = bits[7] ^ bits[8] ^ bits[9] ^ bits[10] ^ bits[11];

  let errorPosition = p8 * 8 + p4 * 4 + p2 * 2 + p1 * 1;

  let highlightIndex = -1;

  if (errorPosition > 0) {
    highlightIndex = errorPosition - 1;
    bits[highlightIndex] ^= 1; // hatalı biti düzelt
  }

  displayBits(bits, "correctedOutput", "corrected", highlightIndex);
}


function displayBits(bits, elementId, extraClass = "", highlightIndex = -1, parityIndices = []) {
  let html = bits.map((bit, i) => {
    let cls = "bit-box";
    if (extraClass) cls += ` ${extraClass}`;
    if (i === highlightIndex) cls += " highlight-error";
    if (parityIndices.includes(i)) cls += " parity-bit";
    return `<div class="${cls}">${bit}</div>`;
  }).join('');
  document.getElementById(elementId).innerHTML = html;
}

