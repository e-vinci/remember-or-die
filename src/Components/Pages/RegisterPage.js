import Navigate from '../Router/Navigate';
import makeDisappearNavbar from '../../utils/navbarSetup';
import findBossOrPlayerImg from '../../utils/imagesBossAndPlayer';
import { clearPage } from '../../utils/render';

const RegisterPage = () => {
  clearPage();
  makeDisappearNavbar(true);

  const main = document.querySelector('main');

  const generateAvatarOptions = () => {
    const avatarImages = [
      'avatar1',
      'avatar2',
      'avatar3',
      'avatar4',
      'avatar5',
      'avatar6',
      'avatar7',
      'avatar8',
    ];

    return avatarImages
      .map((image) => {
        const avatarSrc = findBossOrPlayerImg(image);
        return `<img src="${avatarSrc}" class="avatar-option" data-avatar="${image}" alt="Avatar" style="border-radius: 50%; width: 12.5%; height: 10%;">`;
      })
      .join('');
  };

  const registerPage = `
    <div class="full-screen-bg">
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-6">
            <button id="backButton" class="btn btn-warning">Retour</button>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <form id="registrationForm">
              <div class="form-group">
                <label for="username">Pseudo</label>
                <input type="text" class="form-control" id="username" name="username" required>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" name="email" required>
              </div>

              <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" class="form-control" id="password" name="password" required>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
              </div>

              <div class="form-group">
                <label for="avatar">Choisissez votre avatar :</label>
                <div id="avatarOptions" class="d-flex flex-wrap">
                  ${generateAvatarOptions()}
                </div>
              </div>
              <input type="hidden" id="selectedAvatar" name="selectedAvatar">

              <div id="passwordMismatchError" class="text-danger mt-3 text-center"></div>
              <div id="existingUserError" class="text-danger mt-3 text-center"></div>

              <div class="text-center">
                <p class="consent">
                  En vous inscrivant, vous consentez à notre <a id="consentA">Politique de Confidentialité</a>.
                </p>
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-warning btn-block">S'inscrire</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  main.innerHTML = registerPage;

  const registrationForm = document.querySelector('#registrationForm');
  const passwordMismatchError = document.querySelector('#passwordMismatchError');
  const avatarOptions = document.querySelector('#avatarOptions');
  const selectedAvatarInput = document.querySelector('#selectedAvatar');

  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    Navigate('/login');
  });

  // Ajout du gestionnaire d'événements pour les options d'avatar
  avatarOptions.addEventListener('click', (e) => {
    const selectedAvatar = e.target.dataset.avatar;
    const avatarImages = document.querySelectorAll('.avatar-option');
    // Retirez la classe "selected" de toutes les images
    avatarImages.forEach((image) => {
      image.classList.remove('selected');
    });
    // Ajoutez la classe "selected" à l'image sélectionnée
    if (selectedAvatar) {
      selectedAvatarInput.value = selectedAvatar;
      e.target.classList.add('selected');
    }
  });

  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    const avatarPath = selectedAvatarInput.value;

    if (password !== confirmPassword) {
      passwordMismatchError.textContent = 'Les mots-de-passe ne correspondent pas !';
    } else if (login.trim() === '' || login.trim() === null) {
      passwordMismatchError.textContent = "Veuillez entrer un nom d'utilisateur valide";
    } else {
      try {
        const response = await fetch('http://localhost:3000/players/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login, email, password, avatarPath }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        Navigate('/login');
      } catch (error) {
        passwordMismatchError.textContent = error.message;
      }
    }
  });

  const consentA = document.querySelector('#consentA');
  consentA.addEventListener('click', () => {
    Navigate('/gdpr');
  });
};

export default RegisterPage;
