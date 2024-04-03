const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// DOM elements are already cached at the top, which is good.

// Cached levels for greenScreen optimization
// Assume that levels will not change often, so we can cache them outside of the greenScreen function
const levels = {};

function updateLevelsCache() {
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = Number(input.value);
  });
}
updateLevelsCache(); // Call this function whenever the levels are expected to change.

async function getVideo() {
  try {
    const localMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = localMediaStream;
    video.play();
  } catch (err) {
    console.error('Alert!', err);
  }
}

function paintToCanvas() {
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    // ctx.globalAlpha = 0.1;

    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // Play the sound
  snap.currentTime = 0;
  snap.play();

  // Take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.setAttribute('role', 'button');
  link.setAttribute('aria-label', 'Download photo');
  link.innerHTML = `<img src="${data}" alt="Captured photo" />`;
  strip.insertBefore(link, strip.firstChild);

  link.addEventListener('click', () => {
    URL.revokeObjectURL(data);
  });
}

const redEffect = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
};

const rgbSplit = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 100] = pixels.data[i + 1]; // GREEN;
    pixels.data[i - 150] = pixels.data[i + 2]; // Blue
  }
  return pixels;
};

const greenScreen = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    let red = pixels.data[i];
    let green = pixels.data[i + 1];
    let blue = pixels.data[i + 2];
    let alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
};

getVideo();
video.addEventListener('canplay', () => {
  // Resize canvas once when the video is ready to play
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  paintToCanvas();
});
