// eslint-disable-next-line no-unused-vars
import { Navbar as BootstrapNavbar } from 'bootstrap';
import Navigate from '../Router/Navigate';
import { clearAuthenticatedUser } from '../../utils/auths';

/**
 * Render the Navbar which is styled by using Bootstrap
 * Each item in the Navbar is tightly coupled with the Router configuration :
 * - the URI associated to a page shall be given in the attribute "data-uri" of the Navbar
 * - the router will show the Page associated to this URI when the user click on a nav-link
 */

const Navbar = () => {
  const navbarWrapper = document.querySelector('#navbarWrapper');
  const navbar = `
    <nav class="navbar navbar-expand-lg navbar-light bg-orange navigation">
        <div class="container-fluid">
          <a class="navbar-brand href="#">Remember Or Die</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-4 mb-lg-0">
              <li class="nav-item me-5 ms-5">
                <a class="nav-link" href="#" data-uri="/worlds">Mondes</a>
              </li> 
              <li class="nav-item me-5">
                <a class="nav-link" href="#" data-uri="/leaderboard">Chroniques des Braves</a>
              </li>
              <li class="nav-item me-5">
                <a class="nav-link" href="#" data-uri="/allies">Alliés du Royaume</a>
              </li>     
              <li class="nav-item me-5">
                <a class="nav-link" href="#" data-uri="/profile">Profil</a>
              </li>   
              <li id="disconnectBtn" class="nav-item me-5">
                <a class="nav-link" data-uri="/play" href="#">Déconnexion</a>
              </li>          
            </ul>
          </div>
        </div>
      </nav>
  `;
  navbarWrapper.innerHTML = navbar;
  
  const navlink = document.querySelector('#disconnectBtn');
  navlink.addEventListener('click', (e) => {
    clearAuthenticatedUser();
    Navigate(e.target.uri);
  })
};

export default Navbar;
