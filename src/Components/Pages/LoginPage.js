import { setAuthenticatedUser } from '../../utils/auths';
import Navigate from '../Router/Navigate';
import makeDisappearNavbar from "../../utils/navbarSetup";
import { clearPage } from "../../utils/render";

const handleLoginResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  const player = await response.json();
  setAuthenticatedUser(player);

  Navigate('/worlds');
};

const LoginPage = () => {
  clearPage();
  makeDisappearNavbar(true);
  
  const main = document.querySelector('main');

  const loginPage = `
    <div class="full-screen-bg">
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-6">
            <button id="backButton" class="btn btn-warning">Retour</button>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <form id="loginForm">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" name="email" required>
              </div>

              <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" class="form-control" id="password" name="password" required>
              </div>
              <!-- Ajout de div pour afficher les messages d'erreur -->
              <div id="loginError" class="text-danger mt-3 text-center"></div>
              <br>
              
              <div class="text-center">
                <button type="submit" class="btn btn-warning btn-block">Se connecter</button>
              </div>

              <br>
              <p class="mt-3 text-center">
                N'avez-vous pas de compte ? 
                <a id="register" class="text-warning">S'inscrire ici</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  main.innerHTML = loginPage;

  const loginForm = document.querySelector('#loginForm');
  const loginError = document.querySelector('#loginError');

  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    Navigate('/play');
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch('http://localhost:3000/players/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      await handleLoginResponse(response);
    } catch (error) {
      loginError.textContent = error.message;
    }
  });

  const registerLink = document.querySelector('#register');

  registerLink.addEventListener('click', () => {
    // Appliquer la classe pour l'effet de bouton
    registerLink.classList.add('button-active');
  
    // Naviguer vers la page d'inscription après un court délai (pour l'effet visuel)
    setTimeout(() => {
      Navigate('/register');
    });
  
      // Réinitialiser la classe après la navigation
      registerLink.classList.remove('button-active');
    }, 500); // Délai de 500 millisecondes (ajustez selon vos besoins)
};

export default LoginPage;
