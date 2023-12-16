import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import makeDisappearNavbar from '../../utils/navbarSetup';
import { getAuthenticatedUser } from '../../utils/auths';
import findBossOrPlayerImg from '../../utils/imagesBossAndPlayer';
import shield from '../../img/backgrounds/Bouclier.png';
import calculateRank from '../../utils/xp';

const ProfilePage = () => {
  const player = getAuthenticatedUser();

  if (!player) {
    Navigate('/login');
    return;
  }

  clearPage();
  makeDisappearNavbar(false);

  const rank = calculateRank();

  const main = document.querySelector('main');

  const profilPageDiv = document.createElement('div');
  profilPageDiv.style.maxWidth = '100%';
  profilPageDiv.classList.add('container-fluid', 'full-screen-bg');

  const imageBProfil = document.createElement('div');
  imageBProfil.classList.add('full-screen-wood');

  const tableProfil = document.createElement('table');
  tableProfil.classList.add('container-fluid-profile');

  const theadDutableau = document.createElement('thead');

  const titreDiv = document.createElement('tr');
  const titre = document.createElement('td');
  titre.innerText = "Fiche D'Aventure";

  const tbodyDutableau = document.createElement('tbody');

  const colonne1Div = document.createElement('tr');
  const colonne1Name = document.createElement('td');
  colonne1Name.innerHTML = 'Pseudo';
  const colonne1Value = document.createElement('td');
  colonne1Value.innerHTML = player.login;

  const colonne2Div = document.createElement('tr');
  const colonne2Name = document.createElement('td');
  colonne2Name.innerHTML = 'Rank';
  const colonne2Value = document.createElement('td');
  colonne2Value.innerHTML = rank.level;

  const colonne3Div = document.createElement('tr');
  const colonne3Name = document.createElement('td');
  colonne3Name.innerHTML = 'XP';
  const colonne3Value = document.createElement('td');
  colonne3Value.innerHTML = player.xp;

  const colonne4Div = document.createElement('tr');
  const colonne4Name = document.createElement('td');
  colonne4Name.innerHTML = 'Email';
  const colonne4Value = document.createElement('td');
  colonne4Value.innerHTML = player.email;

  const imgProfil = document.createElement('img');
  imgProfil.src = findBossOrPlayerImg(player.avatarPath);
  imgProfil.classList.add('img-profile');

  const imgProfilBack = document.createElement('img');
  imgProfilBack.src = shield;
  imgProfilBack.classList.add('img-profile-shield');

  const BouttonModifierPassword = document.createElement('button');
  BouttonModifierPassword.textContent = 'Modifier Mot-de-passe';
  BouttonModifierPassword.classList.add(
    'btn',
    'btn-warning',
    'btn-block',
    'button-profile-password',
  );
  BouttonModifierPassword.addEventListener('click', (e) => {
    e.preventDefault();
    Navigate('/modifyProfile');
  });
  const BouttonModifierAvatar = document.createElement('button');
  BouttonModifierAvatar.textContent = 'Modifier Avatar';
  BouttonModifierAvatar.classList.add('btn', 'btn-warning', 'btn-block', 'button-profile-avatar');
  BouttonModifierAvatar.addEventListener('click', (e) => {
    e.preventDefault();
    Navigate('/modifyAvatar');
  });

  titreDiv.appendChild(titre);
  theadDutableau.appendChild(titreDiv);

  colonne1Div.appendChild(colonne1Name);
  colonne1Div.appendChild(colonne1Value);

  colonne2Div.appendChild(colonne2Name);
  colonne2Div.appendChild(colonne2Value);

  colonne3Div.appendChild(colonne3Name);
  colonne3Div.appendChild(colonne3Value);

  colonne4Div.appendChild(colonne4Name);
  colonne4Div.appendChild(colonne4Value);

  tbodyDutableau.appendChild(colonne1Div);
  tbodyDutableau.appendChild(colonne2Div);
  tbodyDutableau.appendChild(colonne3Div);
  tbodyDutableau.appendChild(colonne4Div);

  tableProfil.appendChild(theadDutableau);
  tableProfil.appendChild(tbodyDutableau);

  profilPageDiv.appendChild(imgProfilBack);
  profilPageDiv.appendChild(BouttonModifierPassword);
  profilPageDiv.appendChild(BouttonModifierAvatar);
  profilPageDiv.appendChild(imageBProfil);
  profilPageDiv.appendChild(imgProfil);
  profilPageDiv.appendChild(tableProfil);

  main.appendChild(profilPageDiv);
};

export default ProfilePage;
