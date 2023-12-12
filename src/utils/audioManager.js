import muteImgPath from '../img/mute.png';
import soundImgPath from '../img/sound.png';

const footer = document.querySelector('footer');

let audio;

export const createAudioButton = () => {
  const audioButton = document.createElement('button');
  audioButton.classList.add(
    'btn',
    'btn-secondary',
    'position-fixed',
    'bottom-0',
    'end-0',
    'm-5',
  );

  const imgElement = document.createElement('img');
  imgElement.src = soundImgPath;
  imgElement.alt = 'Audio button';
  imgElement.style.width = '40px';
  imgElement.style.height = '40px';
  imgElement.id = 'audioButtonImg';

  audioButton.appendChild(imgElement);

  return audioButton;
};

export const updateAudioButtonImage = () => {
  const imgElement = document.querySelector('#audioButtonImg');

  if (isAudioCurrentlyPlaying()) {
    imgElement.src = soundImgPath;
  } else {
    imgElement.src = muteImgPath;
  }
};

export function initializeAudio(audioPath) {
  audio = new Audio(audioPath);
  audio.loop = true;
}

export function playAudio() {
  if (audio.paused) {
    audio.setAttribute('autoplay', true);
    audio.play();
  }
}

export function toggleAudio() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

export function isAudioCurrentlyPlaying() {
  return !audio.paused;
}

const audioButton = createAudioButton();

footer.appendChild(audioButton);

audioButton.addEventListener('click', () => {
  toggleAudio();
  updateAudioButtonImage();
});
