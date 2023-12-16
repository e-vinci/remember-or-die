import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import makeDisappearNavbar from '../../utils/navbarSetup';
import { getAuthenticatedUser } from '../../utils/auths';

const ModifyProfilePage = () => {
  const player = getAuthenticatedUser();

  if (!player) {
    Navigate('/login');
    return;
  }

  clearPage();
  makeDisappearNavbar(false);
  const main = document.querySelector('main');

  const modifiedProfilPage = `
    <div class="full-screen-bg">
      <div class="full-screen-wood">
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6">
            <br>
              <form id="modificatedForm" >
              <br>
                <div class="form-group">
                  <label for="password">Nouveau mot de passe</label>
                  <input type="password" class="form-control" id="password" name="password" required>
                </div>
                <br>
                <div class="form-group">
                  <label for="confirmPassword">Confirmer le mot de passe</label>
                  <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
                </div>


                <div id="passwordMismatchError" class="text-danger mt-3 text-center"></div>

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

  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    Navigate('/profile');
  });

  modificatedForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    if (password !== confirmPassword) {
      passwordMismatchError.textContent = 'Les mots-de-passe ne correspondent pas';
      return;
    }

    const { playerId } = player;

    try {
      const response = await fetch(`${process.env.API_BASE_URL}/players/updatePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, newPassword: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      Navigate('/profile');
    } catch (error) {
      passwordMismatchError.textContent = error.message;
    }
  });
};

export default ModifyProfilePage;
