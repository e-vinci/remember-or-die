import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import makeDisappearNavbar from '../../utils/navbarSetup';
import { getAuthenticatedUser} from '../../utils/auths';

let user = null; // Variable stockant utilisateur connecte


  const createListGroup = () => {
    const links = [
      { text: 'Facile', uri: '/levels?world=1' , img: 'easy-image_back'},
      { text: 'Moyen', uri: '/levels?world=2', img: 'medium-image_back' },
      { text: 'Difficile', uri: '/levels?world=3', img: 'hard-image_back' },
    ];
  
    const listGroup = document.createElement('div');
    listGroup.classList.add('list-group');
  
    links.forEach((link) => {
      const anchor = document.createElement('a');
      anchor.setAttribute('href', '#');
      anchor.classList.add('list-group-item-alex');
      anchor.setAttribute('data-uri', link.uri);
      anchor.textContent = link.text;
      anchor.classList.add(link.img);
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        Navigate(link.uri);
      });
      listGroup.appendChild(anchor);
    });
  
    return listGroup;
  };

const WorldPage = () => {
  clearPage();
  makeDisappearNavbar(false);
  user = getAuthenticatedUser();
  if (!user) {
    Navigate('/login');
    return;
  }

  const main = document.querySelector('main');

  const worldPageDiv = document.createElement('div');
  worldPageDiv.style.maxWidth = "100%";
  worldPageDiv.classList.add('container-fluid', 'full-screen-bg');

  const row = document.createElement('div');
  row.classList.add('row');

  const col = document.createElement('div');
  col.classList.add('game-menu-alex');

  const listGroup = createListGroup();

  col.appendChild(listGroup);

  row.appendChild(col);

  worldPageDiv.appendChild(row);
  
  main.appendChild(worldPageDiv);
};

export default WorldPage;
