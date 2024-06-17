// { 'operation': 'sign to display' }
const operatorsDisplayMap = {
    '/': '÷',
    '*': '×',
};

const state = {
    firstOperand: '0',
    secondOperand: null,
    operation: null
};

const display = document.querySelector('.display-window');

const buttons = Array.from(document.querySelectorAll('.btn-calc'));

buttons.map((button) => {
    button.addEventListener('click', (e) => {
        const value = e.target.value;

        switch(value) {
            case 'AC':
                resetState();
                break;

            case '+':
            case '-':
            case '*':
            case '/':
                state.operation = value;
                break;

            case '=':
                try {
                    calculate();
                } catch (e) {
                    display.innerText = 'Error';
                    console.error('Error', e)

                    return;
                }
                break;

            case '%':
                // todo: check it, not sure how it should work
                state.firstOperand = (parseFloat(state.firstOperand) / 100).toString();
                state.secondOperand = null;
                state.operation = null;
                break;

            case '+/-':
                state.firstOperand = (state.firstOperand * -1).toString();
                break;

            case '.':
                // add . only if there is no . in the first operand
                if (state.secondOperand !== null && state.secondOperand.indexOf('.') === -1) {
                    state.secondOperand += value;
                } else if (state.firstOperand.indexOf('.') === -1) {
                    state.firstOperand += value;
                }
                break;

            default:
                if (state.firstOperand === '0' && state.operation === null) {
                    state.firstOperand = value;
                } else if (state.operation === null) {
                    state.firstOperand += value;
                } else {
                    state.secondOperand = null === state.secondOperand
                      ? value
                      : state.secondOperand + value
                }
        }

        updateView();
    })
});

function updateView() {
    const secondOperand = state.secondOperand === null
      ? ''
      : state.secondOperand;

    let secondPartOfExpression = '';

    if (state.operation !== null) {
        const operatorToDisplay = operatorsDisplayMap[state.operation]
          || state.operation;

        secondPartOfExpression = operatorToDisplay + secondOperand;
    }

    display.innerText = state.firstOperand + secondPartOfExpression;
}

function resetState() {
    state.firstOperand = '0';
    state.secondOperand = null;
    state.operation = null;
}

function calculate() {
    if (state.operation === null) {
        return;
    }

    if (state.firstOperand !== '0' && state.secondOperand === null) {
        state.secondOperand = state.firstOperand;
    }

    const result = getResult();

    if ('Error' === result) {
        throw new Error('Error');
    }

    state.firstOperand = result.toString();
    state.secondOperand = null;
    state.operation = null;
}

function getResult() {
    switch(state.operation) {
        case '+':
            return parseFloat(state.firstOperand) + parseFloat(state.secondOperand);
        case '-':
            return parseFloat(state.firstOperand) - parseFloat(state.secondOperand);
        case '*':
            return parseFloat(state.firstOperand) * parseFloat(state.secondOperand);
        case '/':
            return parseFloat(state.firstOperand) / parseFloat(state.secondOperand);
        default:
            return 'Get result error';
    }
}
