const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const video = document.createElement("video");
video.width = 600;
video.height = 500;
canvas.width = 600;
canvas.height = 500;
let model;

async function loadModel() {
  model = await cocoSsd.load();
}

async function predict() {
  if (model) {
    const predictions = await model.detect(video);

    draw(predictions);
  }

  requestAnimationFrame(predict);
}

function draw(predictions) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, video.width, video.height);

  let humanCount = 0;

  predictions.forEach((prediction) => {
    if (prediction.class === "person") {
      const [x, y, width, height] = prediction.bbox;

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      humanCount++;
    }
  });

  const humanCountElement = document.getElementById("human-count");
  humanCountElement.textContent = `Number of humans: ${humanCount}`;
}

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: video.width, height: video.height },
      audio: false,
    });
    video.srcObject = stream;
    video.play();
    video.onloadedmetadata = () => {
      loadModel();
      predict();
    };
  } catch (error) {
    console.error("Error accessing the webcam:", error);
  }
}

startVideo();
