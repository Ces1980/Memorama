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
    // Se indica cuantas tarjetas se quieren mostrar
    this.numeroTarjeta = this.totalTarjetas.length;

    // Se crea e inicializa la variable html como un string vacio
    let html = '';

    // Se utiliza la propiedad this.tarjetas y se recorre para mostrar en pantalla las tarjetas y
    // en el recorrido del for se asigna a html las tarjetas a mostrar usando string literal
    this.totalTarjetas.forEach(card => {
      html += `<div class='tarjeta'>
                    <img class = "tarjeta-img" src="${card.src}" alt="imagen memorama">
              </div>`
    });
    //Se agregan a  contenedorTarjetas.innerHTML el valor de la variable html
    this.$contenedorTarjetas.innerHTML = html;
    this.comienzaJuego();

  }

  comienzaJuego() {
    // Se seleccionan todas las tarjetas
    const tarjetas = document.querySelectorAll('.tarjeta');
    // Se recorre con el forEach a las tarjetas para que se este al tanto a que tarjeta se le da click
    tarjetas.forEach(tarjeta => {
      tarjeta.addEventListener('click', event => {
        this.clickTarjeta(event)
      })
    })
  }

  clickTarjeta(event) {
    // Permite visualizar el reverso de la tarjeta al dar click
    this.efectoVoltearTarjeta(event);

    let sourceImage = event.target.childNodes[1].attributes[1].value;
    // Se obtieneel src de donde se encuentran resguardadas las tarjetas
    // console.log(sourceImage)
    this.varificadorTarjeta.push(sourceImage);
    // Se obtiene todo el div que contiene la la tarjeta que se seleccione
    let tarjeta = event.target;
    // console.log(tarjeta);
    // El método unshift() agrega uno o más elementos al inicio del array, y devuelve la nueva longitud del array.
    //Se agrega a un arreglo las tarjetas que se seleccionen y así poder voltearlas
    this.agregadorTarjetas.unshift(tarjeta);
    this.comparadorTarjetas();
  }

  efectoVoltearTarjeta(event) {
    // Se quita el backgrund image
    event.target.style.backgroundImage = 'none';
    // Se agrega el bg el color blanco
    event.target.style.backgroundColor = 'white';
    // Se indica como se va a colocar el elemento
    event.target.childNodes[1].style.display = 'block';
  }

  // Agregar eh un arreglo las tarjetas acertadas
  fijarParAcertado(arregloTarjetasAcertadas) {
    // mediante un forEach se recorren las tarjetas y se agregan en una clase los pares de tarjetas acertadas
    arregloTarjetasAcertadas.forEach(tarjeta => {
      tarjeta.classList.add('acertada');
      // en el arreglo imagenes correctas se agregan con el método puch las imagenes correctas
      this.imagenesCorrectas.push(tarjeta);
    });
  }

  reversoTarjetas() { }

  // Método que va a permitir mantener las tarjetas volteadas o no en caso de que conicidan nuestras elecciones
  comparadorTarjetas() {
    if (this.varificadorTarjeta.length == 2) {
      if (this.varificadorTarjeta[0] === this.efectoVoltearTarjeta[1]) {
        this.fijarParAcertado(this.agregadorTarjetas);
      } else {
        this.reversoTarjetas(this.agregadorTarjetas);
        this.errores++;
      }
    }
  }

}

new Memorama();