
// ESTADO (JSON)

const estado = {
    historico: []
};


// UTIL — rolar dado

function rolarDado(lados) {
    return Math.floor(Math.random() * lados) + 1;
}


// ARMAZENAMENTO — salvar / carregar

function salvarEstado() {
    localStorage.setItem("historicoDnD", JSON.stringify(estado.historico));
}

function carregarEstado() {
    const dados = localStorage.getItem("historicoDnD");
    if (dados) {
        estado.historico = JSON.parse(dados);
        renderizarResultados();
    }
}


// CREATE — rolar dano

function rolarDano() {
    const motivo = document.getElementById("motivo").value || "Sem motivo";

    const quantidadeBase = Number(document.getElementById("quantidadeDados").value);
    const tipoBase = Number(document.getElementById("tipoDado").value);

    const quantidadeExtra = Number(document.getElementById("quantidadeDadosExtra").value);
    const tipoExtra = Number(document.getElementById("tipoDadoExtra").value);

    const bonus = Number(document.getElementById("bonus").value);

    let rolagens = [];
    let total = 0;

    // Dados base
    for (let i = 0; i < quantidadeBase; i++) {
        const valor = rolarDado(tipoBase);
        rolagens.push(`d${tipoBase}: ${valor}`);
        total += valor;
    }

    // Dados extras
    for (let i = 0; i < quantidadeExtra; i++) {
        const valor = rolarDado(tipoExtra);
        rolagens.push(`d${tipoExtra}: ${valor}`);
        total += valor;
    }

    total += bonus;

    estado.historico.push({
        motivo,
        base: `${quantidadeBase}d${tipoBase}`,
        extra: quantidadeExtra > 0 ? `${quantidadeExtra}d${tipoExtra}` : null,
        bonus,
        rolagens,
        total,
        editando: false
    });

    salvarEstado();
    renderizarResultados();
}


// READ — renderizar histórico

function renderizarResultados() {
    const container = document.getElementById("resultados");
    container.innerHTML = "";

    estado.historico.forEach((entrada, indice) => {
        const div = document.createElement("div");
        div.className = "resultado";

        const motivoHtml = entrada.editando
            ? `<input type="text" id="motivo-editar-${indice}" value="${entrada.motivo}">`
            : `<strong>Motivo:</strong> ${entrada.motivo}`;

        const botaoAcao = entrada.editando
            ? `<button onclick="salvarMotivo(${indice})">Salvar</button>`
            : `<button onclick="editarMotivo(${indice})">Editar motivo</button>`;

        div.innerHTML = `
            ${motivoHtml}<br>
            <strong>${entrada.base}${entrada.extra ? " + " + entrada.extra : ""}</strong><br>
            Rolagens:<br>${entrada.rolagens.join("<br>")}
            <br>Bônus: ${entrada.bonus}
            <br><strong>Total: ${entrada.total}</strong>
            <br><br>
            ${botaoAcao}
            <button onclick="removerResultado(${indice})">Remover</button>
            `;

        container.appendChild(div);
    });
}


// UPDATE — edição inline

function editarMotivo(indice) {
    estado.historico[indice].editando = true;
    renderizarResultados();
}

function salvarMotivo(indice) {
    const input = document.getElementById(`motivo-editar-${indice}`);
    const novoMotivo = input.value.trim();

    if (novoMotivo !== "") {
        estado.historico[indice].motivo = novoMotivo;
    }

    estado.historico[indice].editando = false;
    salvarEstado();
    renderizarResultados();
}


// DELETE — remover entrada
function removerResultado(indice) {
    estado.historico.splice(indice, 1);
    salvarEstado();
    renderizarResultados();
}


// INIT — carregar dados salvos
window.onload = carregarEstado;
