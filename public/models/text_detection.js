const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const textResult = document.getElementById('text-result');

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: video.width, height: video.height },
      audio: false,
    });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    console.error('Error accessing the webcam:', error);
  }
}

async function captureText() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);

  textResult.textContent = 'Detected Text: Processing...';

  Tesseract.recognize(imageDataUrl, 'eng', { logger: (m) => console.log(m) })
    .then(({ data: { text } }) => {
      textResult.textContent = `Detected Text: ${text}`;
    })
    .catch((error) => {
      console.error('Error during text recognition:', error);
      textResult.textContent = 'Detected Text: Error';
    });
}

captureButton.addEventListener('click', captureText);
startVideo();
