import makeDisappearNavbar from '../../utils/navbarSetup';
import { clearPage } from '../../utils/render';

const GdprPage = () => {
  clearPage();
  makeDisappearNavbar(true);

  const main = document.querySelector('main');
  const text = `
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6">
                <button id="backButton" class="btn btn-warning">Retour</button>
            </div>
        </div>
    </div>
    <div class="d-flex justify-content-center align-items-center">
        <div class="text-center" style="max-width: 50%;">
            <h1 style="text-align: center; text-decoration: underline;">Politique de Confidentialité</h1>
            <p>
                <br>
                    Cette Politique de Confidentialité décrit la manière dont Remember or Die collecte, utilise et protège les informations personnelles que vous nous fournissez 
                    en utilisant notre site web <a href="https://e-vinci.github.io/remember-or-die">Remember or Die</a>.
                <br>
                <br>
                <em><strong>
                    Collecte d'Informations Personnelles
                </strong></em>
                <br>
                    Lors de votre inscription, nous vous demandons de fournir votre adresse e-mail, un mot de passe et un pseudo pour personnaliser votre expérience sur Remember or Die. 
                    De plus, vous pouvez choisir un avatar parmi ceux proposés pour votre compte utilisateur. Dans le cadre de notre fonctionnalité de système d'amis, 
                    nous permettons aux utilisateurs d'envoyer et de recevoir des demandes d'amis via des identifiants pseudonymes.
                <br>
                <br>
                <em><strong>
                    Utilisation des Informations Collectées
                </strong></em>
                <br>
                    Les informations personnelles que nous collectons sont utilisées uniquement pour personnaliser votre expérience sur notre site, pour afficher votre pseudonyme, avatar et 
                    pour permettre la fonctionnalité du système d'amis ainsi que du leaderboard.
                <br>
                <br>
                <em><strong>
                    Protection des Informations
                </strong></em>
                <br>
                    Nous accordons une importance capitale à la sécurité de vos données. Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations personnelles 
                    contre tout accès non autorisé ou toute divulgation.
                <br>
                <br>
                <em><strong>
                    Vos Droits
                </strong></em>
                <br>
                    Vous avez le droit de modifier votre mot de passe, votre avatar et de gérer votre liste d'amis directement sur notre site. Si vous avez des questions ou souhaitez supprimer 
                    votre compte, veuillez contacter l'<a href="mailto:dawid.ciborowski@student.vinci.be">administrateur</a> du site.
                <br>
                <br>
                <em><strong>
                    Conservation des Données
                </strong></em>
                <br>
                    Vos informations personnelles seront conservées aussi longtemps que nécessaire pour l'utilisation de notre service, pour la gestion du système d'amis et pour respecter 
                    les obligations légales en vigueur.
                <br>
                <br>
                    En utilisant notre site, vous consentez à cette Politique de Confidentialité.
                <br>
                <br>
                    Pour toute question concernant cette Politique de Confidentialité, veuillez nous contacter à l'adresse e-mail suivante : <a href="mailto:dawid.ciborowski@student.vinci.be">dawid.ciborowski@student.vinci.be</a>.
            </p>
        </div>
    </div>
    `;
  main.innerHTML = text;
  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    window.history.go(-1);
  });
};

export default GdprPage;
