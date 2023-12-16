import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import makeDisappearNavbar from '../../utils/navbarSetup';

const createListGroup = () => {
  const links = [
    { text: 'Jouer', uri: '/login' },
    { text: 'Règles', uri: '/rules' },
    { text: 'Crédits', uri: '/credits' },
  ];

  const listGroup = document.createElement('div');
  listGroup.classList.add('list-group');

  links.forEach((link) => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', '#');
    anchor.classList.add('list-group-item', 'list-group-item-action');
    anchor.setAttribute('data-uri', link.uri);
    anchor.textContent = link.text;
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      Navigate(link.uri);
    });
    listGroup.appendChild(anchor);
  });

  return listGroup;
};

const PlayPage = () => {
  clearPage();
  makeDisappearNavbar(true);

  const main = document.querySelector('main');
  const container = document.createElement('div');
  container.classList.add('container-fluid', 'full-screen-bg');

  const row = document.createElement('div');
  row.classList.add('row');

  const col = document.createElement('div');
  col.classList.add('col-md-3', 'game-menu');

  const listGroup = createListGroup();

  col.appendChild(listGroup);
  row.appendChild(col);
  container.appendChild(row);
  main.appendChild(container);
};

export default PlayPage;
