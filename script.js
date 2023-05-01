let audioContext, analyzer, source, dataArray, bufferLength, isRunning = false;
let count = 1;

var c = document.getElementsByClassName('tick');
for (let index = 0; index < c.length; index++) {
  c[index].style.transform = `rotate(${17*index}deg) rotateZ(-120deg)`;
}
console.log(c[0].style.transform);
document.getElementsByClassName('speed__tick').innerHTML= c;

function startNoiseDetection() {
  audioContext = new AudioContext();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      source = audioContext.createMediaStreamSource(stream);
      analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048;
      source.connect(analyzer);

      bufferLength = analyzer.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      isRunning = true;

      detectNoise();
    })
    .catch(error => {
      console.log(error);
    });
}

function stopNoiseDetection() {
  isRunning = false;
  source.disconnect();
  analyzer.disconnect();
}

function detectNoise() {
  if (!isRunning) return;

  requestAnimationFrame(detectNoise);
  analyzer.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((a, b) => a + b) / bufferLength;
  const frequency = (average / 255) * audioContext.sampleRate / 2;
  const idname = `frequency${count}`
  // console.log(idname);
  document.getElementById(idname).style.height = frequency/80 + 'px' ;
  // console.log(document.getElementById(idname).style.width);
  count = count +1 ;
  const storingbox = document.getElementById('graph').innerHTML;
  // console.log(storingbox);
  document.getElementById('graph').innerHTML = storingbox + `<div id="frequency${count}" class="bar"></div>`;
  console.log(document.getElementById('pointer').style.transform);
  document.getElementById('pointer').style.transform = `rotate(${-125 +(frequency)/80}deg)`;
  document.getElementById('digital').innerText = parseInt(frequency) + "  DB";
  if (frequency < 1000) {
    document.getElementById('alert').innerText = 'Low Volume';
    document.getElementById('alert').style.backgroundColor = 'green';

      } else if(frequency>=1000 && frequency < 4000) {
    document.getElementById('alert').innerText = 'Normal Volume' ;
    document.getElementById('alert').style.backgroundColor = 'yellow';
  }
  else{
    document.getElementById('alert').innerText = "High Volume";
    document.getElementById('alert').style.backgroundColor = 'Red';

  }
}

document.getElementById("start-btn").addEventListener("click", startNoiseDetection);
document.getElementById("stop-btn").addEventListener("click", stopNoiseDetection);
document.getElementById('reset-btn').addEventListener(
  "click", function reset(){
    document.getElementById('graph').innerHTML = '<div id="frequency1" class="bar"></div>';
    count =1;
  }
);