function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.calculator-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(section + '-section').classList.add('active');
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
}

function calcularError() {
    const vt = parseFloat(document.getElementById('valor-teorico').value);
    const ve = parseFloat(document.getElementById('valor-experimental').value);
    const resultDiv = document.getElementById('error-result');

    if (isNaN(vt) || isNaN(ve)) {
        resultDiv.innerHTML = '<div class="result error"><h3>Error</h3><p>Por favor, ingresa valores numéricos válidos.</p></div>';
        return;
    }

    if (vt === 0) {
        resultDiv.innerHTML = '<div class="result error"><h3>Error</h3><p>El valor teórico no puede ser cero.</p></div>';
        return;
    }

    const errorAbsoluto = Math.abs(ve - vt);
    const errorPorcentual = (errorAbsoluto / Math.abs(vt)) * 100;

    resultDiv.innerHTML = `
        <div class="result">
            <h3>Resultados del Cálculo de Error</h3>
            <p><strong>Valor Teórico (Vt):</strong> ${vt}</p>
            <p><strong>Valor Experimental (Ve):</strong> ${ve}</p>
            <p><strong>Error Absoluto:</strong> |${ve} - ${vt}| = ${errorAbsoluto.toFixed(6)}</p>
            <p><strong>Error Porcentual:</strong> ${errorPorcentual.toFixed(4)}%</p>
            <p><strong>Fórmula utilizada:</strong> Error% = |Ve - Vt| / |Vt| × 100</p>
            <p><strong>Interpretación:</strong> ${errorPorcentual < 5 ? 'Excelente precisión' : errorPorcentual < 10 ? 'Buena precisión' : 'Revisar metodología'}</p>
        </div>
    `;
}

function cambiarTamanoMatriz() {
    const size = parseInt(document.getElementById('matrix-size').value);
    const matrixA = document.getElementById('matrix-a');
    const matrixB = document.getElementById('matrix-b');

    // Limpiar matrices existentes
    matrixA.innerHTML = '';
    matrixB.innerHTML = '';

    // Cambiar clases CSS
    matrixA.className = `matrix-inputs matrix-${size}x${size}`;
    matrixB.className = `matrix-inputs matrix-${size}x${size}`;

    // Generar inputs para las matrices
    for (let i = 1; i <= size; i++) {
        for (let j = 1; j <= size; j++) {
            matrixA.innerHTML += `<input type="number" step="any" placeholder="a${i}${j}" id="a${i}${j}">`;
            matrixB.innerHTML += `<input type="number" step="any" placeholder="b${i}${j}" id="b${i}${j}">`;
        }
    }
}

function obtenerMatriz(prefix, size) {
    const matriz = [];
    for (let i = 1; i <= size; i++) {
        const fila = [];
        for (let j = 1; j <= size; j++) {
            const valor = parseFloat(document.getElementById(`${prefix}${i}${j}`).value);
            if (isNaN(valor)) return null;
            fila.push(valor);
        }
        matriz.push(fila);
    }
    return matriz;
}

function mostrarMatriz(matriz, nombre) {
    let html = `<div class="matrix-display"><strong>${nombre}</strong><table>`;
    for (let i = 0; i < matriz.length; i++) {
        html += '<tr>';
        for (let j = 0; j < matriz[i].length; j++) {
            html += `<td>${matriz[i][j].toFixed(3)}</td>`;
        }
        html += '</tr>';
    }
    html += '</table></div>';
    return html;
}

function operarMatrices(operacion) {
    const size = parseInt(document.getElementById('matrix-size').value);
    const matrizA = obtenerMatriz('a', size);
    const matrizB = obtenerMatriz('b', size);
    const resultDiv = document.getElementById('matrices-result');

    if (!matrizA || !matrizB) {
        resultDiv.innerHTML = '<div class="result error"><h3>Error</h3><p>Por favor, completa todos los campos con valores numéricos.</p></div>';
        return;
    }

    let resultado = [];
    let operacionTexto = '';

    switch (operacion) {
        case 'suma':
            operacionTexto = 'Suma de Matrices (A + B)';
            for (let i = 0; i < size; i++) {
                resultado[i] = [];
                for (let j = 0; j < size; j++) {
                    resultado[i][j] = matrizA[i][j] + matrizB[i][j];
                }
            }
            break;

        case 'resta':
            operacionTexto = 'Resta de Matrices (A - B)';
            for (let i = 0; i < size; i++) {
                resultado[i] = [];
                for (let j = 0; j < size; j++) {
                    resultado[i][j] = matrizA[i][j] - matrizB[i][j];
                }
            }
            break;

        case 'multiplicacion':
            operacionTexto = 'Multiplicación de Matrices (A × B)';
            for (let i = 0; i < size; i++) {
                resultado[i] = [];
                for (let j = 0; j < size; j++) {
                    resultado[i][j] = 0;
                    for (let k = 0; k < size; k++) {
                        resultado[i][j] += matrizA[i][k] * matrizB[k][j];
                    }
                }
            }
            break;
    }

    resultDiv.innerHTML = `
        <div class="result">
            <h3>${operacionTexto}</h3>
            <div style="text-align: center;">
                ${mostrarMatriz(matrizA, 'Matriz A')}
                <span style="font-size: 1.5em; margin: 0 20px;">${operacion === 'suma' ? '+' : operacion === 'resta' ? '-' : '×'}</span>
                ${mostrarMatriz(matrizB, 'Matriz B')}
                <span style="font-size: 1.5em; margin: 0 20px;">=</span>
                ${mostrarMatriz(resultado, 'Resultado')}
            </div>
        </div>
    `;
}

function calcularInterpolacion() {
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);
    const x = parseFloat(document.getElementById('x-interpolacion').value);
    const resultDiv = document.getElementById('interpolacion-result');

    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(x)) {
        resultDiv.innerHTML = '<div class="result error"><h3>Error</h3><p>Por favor, completa todos los campos con valores numéricos.</p></div>';
        return;
    }

    if (x1 === x2) {
        resultDiv.innerHTML = '<div class="result error"><h3>Error</h3><p>Los valores X₁ y X₂ no pueden ser iguales.</p></div>';
        return;
    }

    // Calcular interpolación lineal: y = y1 + (y2-y1) * (x-x1) / (x2-x1)
    const y = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
    
    // Calcular la pendiente
    const pendiente = (y2 - y1) / (x2 - x1);
    
    // Ecuación de la recta
    const b = y1 - pendiente * x1;

    resultDiv.innerHTML = `
        <div class="result">
            <h3>Resultado de la Interpolación Lineal</h3>
            <p><strong>Puntos dados:</strong></p>
            <p>P₁(${x1}, ${y1}) y P₂(${x2}, ${y2})</p>
            <p><strong>Valor a interpolar:</strong> X = ${x}</p>
            <p><strong>Resultado:</strong> Y = ${y.toFixed(6)}</p>
            <p><strong>Pendiente:</strong> m = ${pendiente.toFixed(6)}</p>
            <p><strong>Ecuación de la recta:</strong> y = ${pendiente.toFixed(6)}x ${b >= 0 ? '+' : ''} ${b.toFixed(6)}</p>
            <p><strong>Fórmula utilizada:</strong> y = y₁ + (y₂-y₁) × (x-x₁) / (x₂-x₁)</p>
            <p><strong>Verificación:</strong> El punto interpolado es (${x}, ${y.toFixed(6)})</p>
        </div>
    `;
}

// Inicializar la página
window.onload = function() {
    cambiarTamanoMatriz();
};