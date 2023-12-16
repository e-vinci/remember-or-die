import Navigate from '../Router/Navigate';
import makeDisappearNavbar from '../../utils/navbarSetup';
import { clearPage } from '../../utils/render';

const RulesPage = () => {
  clearPage();
  makeDisappearNavbar(true);
  const main = document.querySelector('main');

  const rulesPage = `
  <div class="container mt-5">
      <div class="row">
          <div class="col-md-6">
              <button id="backButton" class="btn btn-warning">Retour</button>
          </div>
      </div>
  </div>
  <div class="full-screen-bg d-flex justify-content-center align-items-center">
      <div class="text-center" style="max-width: 50%;">
          <h1 style="text-align: center; text-decoration: underline;">Salutations, aventurier, aventurière,</h1>
  
          <br>
          
          <p style="font-size: 20px; text-indent: 30px;">Les <strong>ombres</strong> s'étirent sur notre <strong>Royaume</strong>, emprisonnant nos <strong>terres</strong> dans l'étau du <strong>Mal</strong>. L'<em>urgence</em> nous presse, et toi, <strong>héros audacieux</strong> ou <strong>héroïne intrépide</strong>, peux changer le <em>destin funeste</em> qui s'annonce !</p>
                
          <p style="font-size: 20px; text-indent: 30px;">Ton <strong>chemin</strong> sera semé d'<em>épreuves</em> et de <em>rencontres uniques</em>. Les <strong>mystères</strong> se présentent par <strong>paires</strong>, mais point de frayeur : convertir ces <strong>jumelages</strong> en armes te permettra de façonner ton <em>avantage</em> et plier le destin à ta volonté ! </p>
                
          <p style="font-size: 20px; text-indent: 30px;">Le <strong>sablier des temps</strong> s'écoule inexorablement. Ne <em>tergiverse</em> point, car le <strong>défi</strong> est lancé ! Élève-toi au sommet des <strong>Chroniques des Braves</strong>, là où seuls les plus <strong>rapides</strong> et les plus <strong>intrépides</strong> graveront leur nom dans la <em>légende</em>.</p>
                
          <p style="font-size: 20px; text-indent: 30px;">Prépare-toi, car l'<em>aventure</em> t'attend, et le <em>temps</em> est ton plus redoutable <strong>adversaire</strong>.</p>
      </div>
  </div>
  `;

  main.innerHTML = rulesPage;

  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    Navigate('/play');
  });
};

export default RulesPage;
