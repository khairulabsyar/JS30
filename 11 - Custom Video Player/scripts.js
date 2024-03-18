const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen');

const togglePlay = () => {
  video[video.paused ? 'play' : 'pause']();
};

const updateButton = () => {
  toggle.textContent = video.paused ? '►' : '❚ ❚';
};

const handleProgress = () => {
  progressBar.style.flexBasis = `${(video.currentTime / video.duration) * 100}%`;
};

const skip = (e) => {
  video.currentTime += parseFloat(e.target.dataset.skip);
};

const handleRangeUpdate = (e) => {
  video[e.target.name] = e.target.value;
};

const pickTime = (e) => {
  video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
};

const fullscreenToggle = () => {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
// video.addEventListener('progress', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach((button) => button.addEventListener('click', skip));

let mousedown = false;

// ranges.forEach((range) => range.addEventListener('change', handleRangeUpdate));
ranges.forEach((range) => range.addEventListener('click', handleRangeUpdate));
ranges.forEach((range) => range.addEventListener('mousemove', (e) => mousedown && handleRangeUpdate(e)));
ranges.forEach((range) => range.addEventListener('mousedown', () => (mousedown = true)));
ranges.forEach((range) => range.addEventListener('mouseup', () => (mousedown = false)));

progress.addEventListener('click', pickTime);
progress.addEventListener('mousemove', (e) => mousedown && pickTime(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));

fullscreen.addEventListener('click', fullscreenToggle);
