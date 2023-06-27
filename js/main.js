import menuHamburger from './menu_hamburger.js';
const d = document;

d.addEventListener('DOMContentLoaded', (e) => {
  
  /* Scroll Top Buttoon */
  const botonScrollTop = d.querySelector('.scrollTop')
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 600) {
      botonScrollTop.classList.add('scrollTopActive');
    } else {
      botonScrollTop.classList.remove('scrollTopActive');
    }
  });

  /* Enlances seleccionados */
  let enlance = d.querySelectorAll('.navegacion a');
	for (let i = 0; i < enlance.length; i++) {
    enlance[i].onclick = function() {
      let el = enlance[0];
      while (el) {
        if (el.tagName === "Inicio") {
          el.classList.remove('active');
        }
        el = el.nextSibling;
      }
      this.classList.add('active');
    };
  }

  /* Mostrar menu hamburguesa*/
  menuHamburger(".boton-hamburger",".navegacion",".navegacion a");
  
});

