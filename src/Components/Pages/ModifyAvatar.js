/* eslint-disable no-param-reassign */
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import makeDisappearNavbar from '../../utils/navbarSetup';
import { getAuthenticatedUser, setAvatar } from '../../utils/auths';
import calculateRank from '../../utils/xp';
import lock from '../../assets/default/pngkey.com-lock-image-png-3963255.png';
import { getAllAvatars } from '../../utils/imagesBossAndPlayer';

const avatarAllImages = getAllAvatars();

avatarAllImages.forEach((img, index) => {
  if (index < 8) {
    img.rank = 0;
  } else {
    img.rank = index - 7;
  }
});

const ModifyAvatarPage = () => {
  const player = getAuthenticatedUser();

  if (!player) {
    Navigate('/login');
    return;
  }
  clearPage();

  makeDisappearNavbar(false);

  const rank = calculateRank();

  const main = document.querySelector('main');

  const getAvatarImages = () => {
    let html = '';

    avatarAllImages.forEach((image, index) => {
      if (image.rank <= rank.level) {
        html += `<img src="${image.img}" class="avatar-option" data-avatar="avatar${index +
          1}" alt="Avatar" style="border-radius: 50%; width: 12.5%; height: 10%;">`;
      } else {
        html += `<img src="${lock}" class="avatar-option lock-img" data-avatar="avatar${index +
          1}" data-locked="true" alt="Avatar" style="border-radius: 50%; width: 12.5%; height: 10%;">`;
      }
    });

    return html;
  };

  const modifiedProfilPage = `
    <div class="full-screen-bg">
      <div class="full-screen-wood">
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6">
            <br>
              <form id="modificatedForm">

                <div class="form-group ">
                  <br>
                  <br>
                  <label for="avatar">Choisissez votre avatar :</label>
                  <br>
                  <br>
                  <div id="avatarOptions" class="d-flex flex-wrap ">
                    ${getAvatarImages()}
                  </div>
                </div>
                <br>
                <input type="hidden" id="selectedAvatar" name="selectedAvatar">

                <div class="button-container">
                  <button  type="submit" class="btn btn-warning btn-block">Sauvegarder</button>
                  <button id='backButton' type="submit" class="btn btn-warning btn-block">Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  main.innerHTML = modifiedProfilPage;

  const modificatedForm = document.querySelector('#modificatedForm');
  const passwordMismatchError = document.querySelector('#passwordMismatchError');
  const avatarOptions = document.querySelector('#avatarOptions');
  const selectedAvatarInput = document.querySelector('#selectedAvatar');

  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    Navigate('/profile');
  });

  // Ajout du gestionnaire d'événements pour les options d'avatar
  avatarOptions.addEventListener('click', (e) => {
    const selectedAvatar = e.target.dataset.avatar;
    const isLocked = e.target.dataset.locked;
    const avatarImages = document.querySelectorAll('.avatar-option');
    // Retirez la classe "selected" de toutes les images
    if (!isLocked) {
      avatarImages.forEach((image) => {
        image.classList.remove('selected');
      });
    }
    // Ajoutez la classe "selected" à l'image sélectionnée
    if (selectedAvatar && !isLocked) {
      selectedAvatarInput.value = selectedAvatar;
      e.target.classList.add('selected');
    }
  });

  modificatedForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const avatar = selectedAvatarInput.value;
    if (!avatar) {
      passwordMismatchError.textContent = 'Veuillez sélectionner un avatar';
      return;
    }

    const { playerId } = player;

    try {
      const response = await fetch(`${process.env.API_BASE_URL}/players/updateAvatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, avatar }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      setAvatar(avatar);

      Navigate('/profile');
    } catch (error) {
      passwordMismatchError.textContent = error.message;
    }
  });
};

export default ModifyAvatarPage;
