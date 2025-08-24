const botoes = document.querySelectorAll('button')
const displayer = document.querySelector("input[name='displayer']")

const EstadoInicial = {
    displayValue: '0',
    clearDisplay: false,
    operacao: null,
    valores: [0, 0],
    current: 0,
}
function usarEstado(valorInicial) {
    let valor = valorInicial;
    const getValor = () => valor//Ler o valor
    const setValor = (novoValor) => valor = novoValor

    return [getValor, setValor]
}
const [getState, setState] = usarEstado({ ...EstadoInicial });

const apagarUltimo = () => {
    let state = getState();
    let valorAtual = state.displayValue.toString();
    if (valorAtual.length > 1) {
        state.displayValue = valorAtual.slice(0, -1);
    } else {
        state.displayValue = "0"
    }
    state.valores[state.current] = parseFloat(state.displayValue) || 0

    setState({ ...state })
    displayer.value = state.displayValue;

}

const atualizaDisplayer = () => {
    let state = getState();
    displayer.value = state.displayValue;
    console.log("funcao atualiza", displayer.value);
}

const adicionarDigito = num => {
    let state = getState();
    const clearDisplay = state.displayValue === '0'
        || state.clearDisplay
    if (num === '.' && !clearDisplay && state.displayValue.includes('.')) return;

    const currentValue = clearDisplay ? '' : state.displayValue;
    const displayValue = currentValue + num;
    state.displayValue = displayValue;
    state.clearDisplay = false;

    if (num !== '.') {
        const newValue = parseFloat(displayValue);
        const values = [...state.valores]
        values[state.current] = newValue
        state.valores = values
    }
    setState({ ...state })
    atualizaDisplayer();
}

const clearMemory = () => {
    //Object.assign(state, EstadoInicial)
    setState({ ...EstadoInicial })
    atualizaDisplayer();
}

const setOperacao = operacao => {
    let state = getState();

    if (state.current === 0) {
        state.operacao = operacao
        state.current = 1
        state.clearDisplay = true

    } else {
        const igual = operacao === '='
        const valores = [...state.valores]
        try {
            switch (state.operacao) {
                case '+': valores[0] = valores[0] + valores[1]; break
                case '-': valores[0] = valores[0] - valores[1]; break
                case '*': valores[0] = valores[0] * valores[1]; break
                case '/': valores[0] = valores[0] / valores[1]; break
                case '%': valores[0] = valores[0] % valores[1]; break
                default: break
            }
        } catch (error) {
            valores[0] = state.valores[0]
        }
        state.displayValue = String(valores[0])
        state.operacao = igual ? null : operacao
        state.current = igual ? 0 : 1
        state.clearDisplay = !igual
        state.valores = valores
    }
    setState({ ...state })
    atualizaDisplayer()
}

