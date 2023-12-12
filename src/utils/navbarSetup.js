const makeDisappearNavbar = (param) => {
  const navbar = document.querySelector('#navbarWrapper');
  if (param === true) navbar.style.display = 'none';
  else navbar.style.display = '';
};

module.exports = { makeDisappearNavbar };
