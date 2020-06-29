class Memorama {


  constructor() {
    this.totalTarjetas = [];
    this.numeroTarjeta = 0;
    this.verificadorTarjetas = [];
    this.errores = 0;
    this.nivelDificultad = '';
    this.imagenesCorrectas = [];
    this.agregadorTarjetas = [];
    this.numeroIntentos = 0;

    // Elementos html inicialzados desde el constructor

    this.$contenedorTarjetas = document.querySelector('.contenedor-tarjetas');
    this.$contenedorGeneral = document.querySelector('.contenedor-general');
    this.$pantallaBloqueada = document.querySelector('.pantalla-bloqueada');
    this.$mensaje = document.querySelector('h2.mensaje');
    this.$errorContenedor = document.createElement('div');
    this.$nivelDificultad = document.createElement('div');

    // Llamado a los eventos
    this.eventos();
  }


  eventos() {
    window.addEventListener('DOMContentLoaded', () => {
      console.log('Esta escuchando a los eventos');
      // Antes de jugar se requiere cargar la dificultad
      this.seleccionDificultad();
      this.cargaPantalla();

    })
  }

  seleccionDificultad() {
    const mensaje = prompt('Selecciona el nivel de dificultad: facil, intermedio o dificil');

    if (!mensaje) {
      this.numeroIntentos = 5;
      this.nivelDificultad = 'Intermedio';
    } else {
      if (mensaje.toLowerCase() === 'facil' || mensaje.toLowerCase === 'fácil') {
        this.numeroIntentos = 7;
        this.nivelDificultad = 'fácil';
      } else if (mensaje.toLowerCase() === 'intermedio') {
        this.numeroIntentos = 5;
        this.nivelDificultad = 'intermedio';
      } else if (mensaje.toLowerCase() === 'dificil' || mensaje.toLowerCase === 'difícil') {
        this.numeroIntentos = 3;
        this.nivelDificultad = 'dificil';
      } else {
        this.numeroIntentos = 5;
        this.nivelDificultad = 'intermedio';
      }
    }
    this.contenedorError();

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
      html += `<div class="tarjeta">
                    <img class = "tarjeta-img" src=${card.src} alt="imagen memorama">
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
    this.verificadorTarjetas.push(sourceImage);
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

      this.victoriaJuego();
    });
  }

  reversoTarjetas(arregloTarjetas) {
    arregloTarjetas.forEach(tarjeta => {
      setTimeout(() => {
        tarjeta.style.backgroundImage = 'url(../img/cover.jpg)';
        tarjeta.childNodes[1].style.display = 'none';
      }, 1000);
    })
  }

  // Método que va a permitir mantener las tarjetas volteadas o no en caso de que conicidan nuestras elecciones
  comparadorTarjetas() {
    if (this.verificadorTarjetas.length == 2) {
      // Se comparan las tarjetas a las cuales se le ha dado click
      if (this.verificadorTarjetas[0] === this.verificadorTarjetas[1]) {
        // Si coinciden las dos cartas electas se guardan en el arreglo de imagenes correctas
        this.fijarParAcertado(this.agregadorTarjetas);
      } else {
        // En caso de elegir cartas que no son pares se invoca al método reverso tarjetas
        this.reversoTarjetas(this.agregadorTarjetas);
        this.errores++;
        this.incrementadorError();
        this.derrotaJuego();
      }
      // El método splice() cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
      this.verificadorTarjetas.splice(0);
      this.agregadorTarjetas.splice(0);
    }
  }

  victoriaJuego() {
    // Se compara que el arreglo imagenesCorrectas tenga el mismo tamaño que numero tarjetas
    if (this.imagenesCorrectas.length === this.numeroTarjeta) {
      // Si el tamaño del arreglo es el mismo
      setTimeout(() => {
        // Se bloquea la pantalla y se agrega un mensaje en pantalla
        // console.log(this.$pantallaBloqueada.style.display = 'block');
        this.$pantallaBloqueada.style.display = 'block';
        this.$mensaje.innerText = '!Felicidades has ganado el juego.....¡';
      }, 1000);
      // Después de ganado el juego se reinicia el tablerp
      setTimeout(() => {
        location.reload();
      }, 4000);
    }
  }

  derrotaJuego() {
    // Nùmero de errores según la dificultad
    if (this.errores === this.numeroIntentos) {
      setTimeout(() => {
        this.$pantallaBloqueada.style.display = 'block';
        this.$mensaje.innerText = '!Huy....perdiste!!';
      }, 1000);

      setTimeout(() => {
        location.reload();
      }, 4000);
    }
  }

  incrementadorError() {
    // Se muestra la cantidad de errores en la pantalla
    this.$errorContenedor.innerText = `Errores: ${this.errores} / ${this.numeroIntentos}`;
  }

  contenedorError() {
    // Se agrega una nueva clase para mostrar los datos de error
    this.$errorContenedor.classList.add('error');
    this.incrementadorError();
    // Se agrega en pantalla la clase error
    this.$contenedorGeneral.appendChild(this.$errorContenedor);
  }

  // mensajeIntentos(){
  //   this.
  // }

}

new Memorama();