class Memorama {


  constructor() {
    this.totalTarjetas = [];
    this.numeroTarjeta = 0;
    this.varificadorTarjeta = [];
    this.errores = 0;
    this.nivelDificultad = '';
    this.imagenesCorrectas = [];
    this.agregadorTarjetas = [];

    // Elementos html inicialzados desde el constructor

    this.$contenedorTarjetas = document.querySelector('.contenedor-tarjetas');
    this.$contenedorGeneral = document.querySelector('.contenedor-general');
    this.$pantallaBloqueada = document.querySelector('h2.pantallaBloqueada');
    this.$mensaje = document.querySelector('h2.mensaje');

    // Llamado a los eventos
    this.eventos();
  }


  eventos() {
    window.addEventListener('DOMContentLoaded', () => {
      console.log('Esta escuchando a los eventos');
      this.cargaPantalla();
    })
  }

  async cargaPantalla() {
    const respuesta = await fetch('../memo.json');
    const data = await respuesta.json();
    // Se le agrega la data a total tarjeta -> Data contienen las imagenes de las tarjetas
    this.totalTarjetas = data;

    if (this.totalTarjetas.length > 0) {
      this.totalTarjetas.sort(orden);
      function orden(a, b) {
        return Math.random() - 0.5;
      }
    }

    console.log(this.totalTarjetas);

  }

}

new Memorama();