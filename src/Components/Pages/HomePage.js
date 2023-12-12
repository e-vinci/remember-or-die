import anime from 'animejs/lib/anime.es';
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { playAudio } from '../../utils/audioManager';
import { makeDisappearNavbar } from '../../utils/navbarSetup';

const HomePage = () => {
  clearPage();
  makeDisappearNavbar(true);

  const main = document.querySelector('main');

  const homePage = document.createElement('div');
  homePage.classList.add('container-fluid');

  const centeredDiv = document.createElement('div');
  centeredDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center');
  centeredDiv.style.height = '100vh';

  const playLink = document.createElement('div');
  playLink.setAttribute('id', 'btnStart');
  playLink.setAttribute('data-uri', '/play');
  playLink.innerText = 'Start';

  playLink.addEventListener('click', () => {
    playLink.disabled = true;

    playAudio();

    anime({
      targets: playLink,
      scale: 3,
      rotate: '1turn',
      opacity: 0,
      duration: 500,
      easing: 'easeInOutQuad',
      complete() {
        Navigate('/play');
      },
    });
  });

  centeredDiv.appendChild(playLink);
  homePage.appendChild(centeredDiv);
  main.appendChild(homePage);
};

export default HomePage;
