// Se asignan los eventos al botón para generar la tabla de honorarios y calcular la ganancia máxima
document.getElementById('agregar-honorarios-btn').addEventListener('click', generarTablaHonorarios);
document.getElementById('calcular-btn').addEventListener('click', calcularMaximoIngreso);
document.getElementById('reset-btn').addEventListener('click', restablecerFormulario);

// Variables para verificar si la tabla y la solución han sido generadas
let tablaGenerada = false;
let solucionGenerada = false;


// Función para mostrar y ocultar las instrucciones
function toggleInstrucciones() {
    const instrucciones = document.getElementById('instrucciones');
    const btn = document.getElementById('toggle-instrucciones-btn');
    if (instrucciones.style.display === 'none') {
        instrucciones.style.display = 'block';
        btn.textContent = 'Ocultar Instrucciones';
    } else {
        instrucciones.style.display = 'none';
        btn.textContent = 'Mostrar Instrucciones';
    }
}



// Función para validar los campos del formulario
function validarFormulario() {
    const dias = document.getElementById('dias').value;
    const nombre1 = document.getElementById('nombre1').value;
    const nombre2 = document.getElementById('nombre2').value;
    const nombre3 = document.getElementById('nombre3').value;

    // Verificar si el campo 'dias' está vacío o es igual a 0
    if (!dias || dias <= 0) {
        alert("Por favor, ingrese un número de días mayor a 0.");
        return false; // Detener la ejecución si la validación falla
    }

    // Verificar si los campos de nombre de las etapas están vacíos
    if (!nombre1 || !nombre2 || !nombre3) {
        alert("Por favor, ingrese el nombre para cada una de las etapas (S1, S2, S3).");
        return false;
    }

    return true; // Validación exitosa
}



// Función para generar la tabla de honorarios de los días y empresas
function generarTablaHonorarios() {

    // Llamar a la función de validación antes de generar la tabla
    if (!validarFormulario()) return; // Si la validación falla, detener la ejecución

    const dias = parseInt(document.getElementById('dias').value);
    const contenedor = document.getElementById('inputs-honorarios');
    contenedor.innerHTML = ''; // Limpiar cualquier tabla anterior

    // Obtiene los nombres de las empresas ingresadas por el usuario
    const nombre1 = document.getElementById('nombre1').value;
    const nombre2 = document.getElementById('nombre2').value;
    const nombre3 = document.getElementById('nombre3').value;

    // Agregar encabezados de las compañías
    contenedor.innerHTML += `
        <div>
            <label>Día</label>
            <label>${nombre1}</label>
            <label>${nombre2}</label>
            <label>${nombre3}</label>
        </div>
    `;

    // Genera filas de entrada para cada día (incluyendo día 0) para ingresar honorarios
    for (let i = 0; i <= dias; i++) { // Mantener el día cero
        contenedor.innerHTML += `
            <div>
                <label>Día ${i}:</label>
                <input type="number" id="empresa1-${i}" placeholder="${nombre1}" value="0" min="0"> 
                <input type="number" id="empresa2-${i}" placeholder="${nombre2}" value="0" min="0"> 
                <input type="number" id="empresa3-${i}" placeholder="${nombre3}" value="0" min="0">
            </div>`;
    }

     // Mostrar el título y el contenedor de honorarios
     document.getElementById('titulo-honorarios').style.display = 'block'; // Muestra el <h3>
     contenedor.style.display = 'block'; // Muestra el contenedor de los honorarios

    // Mostrar el botón de calcular al finalizar la tabla
    document.getElementById('calcular-btn').style.display = 'inline-block';

    // Desplazarse hacia el contenedor de la tabla generada
    contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Indica que la tabla ha sido generada
    tablaGenerada = true;

    // Habilitar y mostrar el botón de restablecer
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.disabled = false;  // Habilitar el botón
    resetBtn.style.display = 'inline-block';  // Mostrar el botón
}


// Función para restablecer el formulario
function restablecerFormulario() {

    // Reinicia las variables de estado
    tablaGenerada = false;
    solucionGenerada = false;
    
    // Limpiar los campos de texto
    document.getElementById('dias').value = 0; // Valor por defecto
    document.getElementById('nombre1').value = '';
    document.getElementById('nombre2').value = '';
    document.getElementById('nombre3').value = '';

    // Limpiar los honorarios
    const contenedor = document.getElementById('inputs-honorarios');
    contenedor.innerHTML = ''; // Limpiar cualquier tabla anterior

    // Limpiar el resultado
    document.getElementById('resultado').innerHTML = '';

    // Ocultar el botón de calcular
    document.getElementById('calcular-btn').style.display = 'none';

    // Deshabilitar y ocultar el botón de restablecer después de reiniciar
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.disabled = true;  // Deshabilitar el botón
    resetBtn.style.display = 'none';  // Ocultar el botón

    // Ocultar el título y el contenedor de honorarios
    document.getElementById('titulo-honorarios').style.display = 'none'; // Ocultar el <h3>
    contenedor.style.display = 'none'; // Ocultar el contenedor de los honorarios
}

// Función para calcular la máxima ganancia y la distribución óptima de días
// Almacena los honorarios ingresados en una matriz para cada día y empresa
function calcularMaximoIngreso() {
    const dias = parseInt(document.getElementById('dias').value);
    let honorarios = [];

    // Recopilar los honorarios ingresados por el usuario
    for (let i = 0; i <= dias; i++) { // Mantener el día cero
        let empresa1 = parseInt(document.getElementById(`empresa1-${i}`).value);
        let empresa2 = parseInt(document.getElementById(`empresa2-${i}`).value);
        let empresa3 = parseInt(document.getElementById(`empresa3-${i}`).value);

        honorarios.push([empresa1, empresa2, empresa3]);
    }

    // Obtener los nombres de las compañías
    const nombre1 = document.getElementById('nombre1').value;
    const nombre2 = document.getElementById('nombre2').value;
    const nombre3 = document.getElementById('nombre3').value;

    // Generar las tablas de cada empresa en el orden correcto: S3, S2, S1
    // //Genera tablas de ingresos máximos para cada empresa en orden (S3, S2, S1)
    let maxGanancia3 = Array(dias + 1).fill(0);
    let tabla3 = generarTabla(nombre3, dias, honorarios, 2, maxGanancia3);

    let maxGanancia2 = Array(dias + 1).fill(0);
    let tabla2 = generarTabla(nombre2, dias, honorarios, 1, maxGanancia2, maxGanancia3);

    let maxGanancia1 = Array(dias + 1).fill(0);
    let tabla1 = generarTabla(nombre1, dias, honorarios, 0, maxGanancia1, maxGanancia2);

    // Mostrar todas las tablas generadas para las empresas en el orden: S3, S2, S1
    document.getElementById('resultado').innerHTML = tabla3 + tabla2 + tabla1;

    // Calcular las combinaciones de días que maximizan el ingreso
    let mejorGanancia = 0;
    let mejoresSoluciones = [];

    for (let i = 0; i <= dias; i++) { // Días en empresa1
        for (let j = 0; j <= dias - i; j++) { // Días en empresa2
            let k = dias - i - j; // Días en empresa3

            let ganancia = honorarios[i][0] + honorarios[j][1] + honorarios[k][2];

            // Actualiza la mejor ganancia y las soluciones óptimas
            if (ganancia > mejorGanancia) {
                mejorGanancia = ganancia;
                mejoresSoluciones = [{ empresa1: i, empresa2: j, empresa3: k }];
            } else if (ganancia === mejorGanancia) {
                mejoresSoluciones.push({ empresa1: i, empresa2: j, empresa3: k });
            }
        }
    }

    // Mostrar el resumen final con todas las combinaciones
    mostrarResumenFinal(mejorGanancia, mejoresSoluciones, nombre1, nombre2, nombre3);

    solucionGenerada = true;

    // Desplazarse hacia el contenedor de resultados
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Función para imprimir la página con validación
function imprimirPagina() {
    if (tablaGenerada && solucionGenerada) {
        window.print();
    } else {
        alert("No hay reporte para imprimir. Por favor, asegúrese de generar la tabla y la solución antes de imprimir.");
    }
}

// Función para mostrar el resumen de resultados
function mostrarResumenFinal(ganancia, soluciones, nombre1, nombre2, nombre3) {
    let resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML += `
        <h3>Resumen Final</h3>
        <p class="mejor-ganancia">
            Mejor Ganancia: <span class="ganancia-resultado">${ganancia} millones</span>
        </p>`;

    soluciones.forEach((solucion, index) => {
        resultadoDiv.innerHTML += `<p class="solucion">Solución ${index + 1}: ${solucion.empresa1} días en ${nombre1}, 
            ${solucion.empresa2} días en ${nombre2}, ${solucion.empresa3} días en ${nombre3}.</p>`;
    });


}

// Genera la tabla de ingresos máximos para cada empresa
function generarTabla(empresa, dias, honorarios, indice, maxGanancia, maxGananciaPrev = []) {
    // Definir una clase específica para cada tabla (S1, S2, S3)
    const claseTabla = `tabla-s${indice + 1}`;
    let tabla = generarTablaInicial(dias, empresa, `S${indice + 1}`, `X${indice + 1}`, 'F*', claseTabla);

    // Determinar el último día ingresado
    let ultimoDiaIngresado = dias;

    for (let d = 0; d <= dias; d++) { // Iterar sobre los días
        // Solo se mostrarán días en la tabla S1 si son iguales o mayores al último día ingresado
        if (indice === 0 && d < ultimoDiaIngresado) {
            continue; // Saltar días anteriores en la tabla S1
        }

        tabla += `<tr><td>${d}</td>`;
        let filaGanancias = [];
        let diasOptimos = [];
        let maxFila = -Infinity;

        for (let i = 0; i <= dias; i++) {
            if (i > d) {
                tabla += `<td></td>`;
            } else if (i === d) {
                tabla += `<td>${honorarios[d][indice]}</td>`;
                filaGanancias.push(honorarios[d][indice]);
                if (honorarios[d][indice] > maxFila) {
                    maxFila = honorarios[d][indice];
                    diasOptimos = [d];
                } else if (honorarios[d][indice] === maxFila) {
                    diasOptimos.push(d);
                }
            } else {
                const gananciaTotal = honorarios[i][indice] + (maxGananciaPrev[d - i] || 0);
                tabla += `<td>${gananciaTotal}</td>`;
                filaGanancias.push(gananciaTotal);
                if (gananciaTotal > maxFila) {
                    maxFila = gananciaTotal;
                    diasOptimos = [i];
                } else if (gananciaTotal === maxFila) {
                    diasOptimos.push(i);
                }
            }
        }

        maxGanancia[d] = maxFila;

        tabla += `<td>${maxFila}</td><td>${diasOptimos.join(' - ')}</td></tr>`;
    }
    tabla += `</tbody></table>`;
    return tabla;

}

function generarTablaInicial(dias, empresa, letra, letraX, letraF, claseTabla) {
    let encabezados = `<tr><th>Días</th>`;
    for (let i = 0; i <= dias; i++) {
        encabezados += `<th>${i}</th>`;
    }
    return `<h2>${empresa} (${letra})</h2><table class="${claseTabla}"><thead>${encabezados}<th>${letraF}</th><th>${letraX}</th></tr></thead><tbody>`;
}

window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';
    }, 2000); // Cambia los milisegundos (2000 ms = 2 segundos) según tus preferencias
});

// Selecciona el contenedor de marcas de agua
const backgroundWatermark = document.querySelector('.background-watermark');

// Array con las imágenes de marcas de agua
const watermarks = [
    'imagenes/raiz-cuadrada.png',
    'imagenes/funcion.png',
    'imagenes/Simbolo-pi.png',
    'imagenes/Simbolo-suma.png'
];

// Número de marcas de agua a generar
const numberOfWatermarks = 50; // Puedes ajustar este número

for (let i = 0; i < numberOfWatermarks; i++) {
    // Crea un nuevo div para la marca de agua
    const watermark = document.createElement('div');
    watermark.classList.add('watermark');

    // Selecciona una imagen aleatoria del array
    const randomImage = watermarks[Math.floor(Math.random() * watermarks.length)];
    watermark.style.backgroundImage = `url('${randomImage}')`;

    // Genera posiciones aleatorias dentro del contenedor
    const randomTop = Math.random() * 100; // Porcentaje para top
    const randomLeft = Math.random() * 100; // Porcentaje para left
    watermark.style.top = `${randomTop}%`;
    watermark.style.left = `${randomLeft}%`;

    // Agrega la marca de agua al contenedor
    backgroundWatermark.appendChild(watermark);
}

