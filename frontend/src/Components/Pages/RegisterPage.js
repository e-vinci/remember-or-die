import { makeDisappearNavbar } from "../../utils/navbarSetup";
import { clearPage } from "../../utils/render";

const RegisterPage = () => {
  clearPage();
  makeDisappearNavbar();
  
    const main = document.querySelector('main');
  
    const registerPage = `
    <div class="full-screen-bg">
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <form id="registrationForm">
              <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
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

              <br>
              <div class="form-group">
                <label for="profilePicture">Photo de profil</label>
                <input type="file" class="form-control-file" id="profilePicture" name="profilePicture" accept="image/*" required>
              </div>
  
              <br>
              <button type="submit" class="btn btn-warning btn-block" data-uri="/game">S'inscrire</button>
            </form>
          </div>
        </div>
      </div>
      </div>
    `;
  
    main.innerHTML = registerPage;
  };
  
  export default RegisterPage;
  