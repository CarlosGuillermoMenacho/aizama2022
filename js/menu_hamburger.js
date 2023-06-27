export default function menuHamburger(navegacionHamburger, menu, menuLink) {
  const d = document;
  d.addEventListener('click', (e) => {
    if (e.target.matches(navegacionHamburger) || e.target.matches(`${navegacionHamburger} *`)) {
        d.querySelector(menu).classList.toggle('is-active');
        d.querySelector(navegacionHamburger).classList.toggle('is-active');
    }
    if (e.target.matches(menuLink)) {
        d.querySelector(menu).classList.remove('is-active');
        d.querySelector(navegacionHamburger).classList.remove('is-active');
    }
  });

}