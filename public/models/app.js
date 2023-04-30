const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const video = document.createElement('video');
video.width = 600;
video.height = 500;
canvas.width = 600;
canvas.height = 500;
let model;

async function loadModel() {
  model = await posenet.load();
}

async function predict() {
  if (model) {
    const pose = await model.estimateSinglePose(video, {
      flipHorizontal: false,
    });

    draw(pose);
  }

  requestAnimationFrame(predict);
}

const skeleton = [
  { from: 'leftHip', to: 'leftShoulder' },
  { from: 'leftShoulder', to: 'leftElbow' },
  { from: 'leftElbow', to: 'leftWrist' },
  { from: 'leftHip', to: 'leftKnee' },
  { from: 'leftKnee', to: 'leftAnkle' },
  { from: 'rightHip', to: 'rightShoulder' },
  { from: 'rightShoulder', to: 'rightElbow' },
  { from: 'rightElbow', to: 'rightWrist' },
  { from: 'rightHip', to: 'rightKnee' },
  { from: 'rightKnee', to: 'rightAnkle' },
  { from: 'leftShoulder', to: 'rightShoulder' },
  { from: 'leftHip', to: 'rightHip' },
];

function draw(pose) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, video.width, video.height);

  const keypoints = pose.keypoints.reduce((acc, keypoint) => {
    if (keypoint.score > 0.5) {
      acc[keypoint.part] = keypoint.position;
    }
    return acc;
  }, {});

  skeleton.forEach(({ from, to }) => {
    if (keypoints[from] && keypoints[to]) {
      ctx.beginPath();
      ctx.moveTo(keypoints[from].x, keypoints[from].y);
      ctx.lineTo(keypoints[to].x, keypoints[to].y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.stroke();
    }
  });
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
    console.error('Error accessing the webcam:', error);
  }
}

startVideo();