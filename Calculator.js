class Calculator {
  // { 'operation': 'sign to display' }
  static operatorsDisplayMap = {
    '/': '÷',
    '*': '×',
  };

  state = {
    firstOperand: '0',
    secondOperand: null,
    operation: null
  };

  displayElement = null;
  buttonsElements = [];

  constructor (displayElement, buttonsElements) {
    this.displayElement = displayElement;
    this.buttonsElements = buttonsElements;
  }

  init() {
    this.buttonsElements.forEach((button) => {
      button.addEventListener('click', (event) => {
        this.handleClick(event);
      })
    });
  }

  handleClick(e) {
    const value = e.target.value;

    switch(value) {
      case 'AC':
        this.resetState();
        break;

      case '+':
      case '-':
      case '*':
      case '/':
        this.state.operation = value;
        break;

      case '=':
        try {
          this.calculate();
        } catch (e) {
          this.displayElement.innerText = 'Error';
          console.error('Error', e)

          return;
        }
        break;

      case '%':
        // todo: check it, not sure how it should work
        this.state.firstOperand = (parseFloat(this.state.firstOperand) / 100).toString();
        this.state.secondOperand = null;
        this.state.operation = null;
        break;

      case '+/-':
        this.state.firstOperand = (this.state.firstOperand * -1).toString();
        break;

      case '.':
        // add . only if there is no . in the first operand
        if (this.state.secondOperand !== null && this.state.secondOperand.indexOf('.') === -1) {
          this.state.secondOperand += value;
        } else if (this.state.firstOperand.indexOf('.') === -1) {
          this.state.firstOperand += value;
        }
        break;

      default:
        if (this.state.firstOperand === '0' && this.state.operation === null) {
          this.state.firstOperand = value;
        } else if (this.state.operation === null) {
          this.state.firstOperand += value;
        } else {
          this.state.secondOperand = null === this.state.secondOperand
            ? value
            : this.state.secondOperand + value
        }
    }

    this.updateView();
  }

  resetState() {
    this.state.firstOperand = '0';
    this.state.secondOperand = null;
    this.state.operation = null;
  }

  calculate() {
    if (this.state.operation === null) {
      return;
    }

    if (this.state.firstOperand !== '0' && this.state.secondOperand === null) {
      this.state.secondOperand = this.state.firstOperand;
    }

    const result = this.getResult();

    if ('Error' === result) {
      throw new Error('Error');
    }

    this.state.firstOperand = result.toString();
    this.state.secondOperand = null;
    this.state.operation = null;
  }

  getResult() {
    switch(this.state.operation) {
      case '+':
        return parseFloat(this.state.firstOperand) + parseFloat(this.state.secondOperand);
      case '-':
        return parseFloat(this.state.firstOperand) - parseFloat(this.state.secondOperand);
      case '*':
        return parseFloat(this.state.firstOperand) * parseFloat(this.state.secondOperand);
      case '/':
        return parseFloat(this.state.firstOperand) / parseFloat(this.state.secondOperand);
      default:
        return 'Get result error';
    }
  }

  updateView() {
    const secondOperand = this.state.secondOperand === null
      ? ''
      : this.state.secondOperand;

    let secondPartOfExpression = '';

    if (this.state.operation !== null) {
      const operatorToDisplay = Calculator.operatorsDisplayMap[this.state.operation]
        || this.state.operation;

      secondPartOfExpression = operatorToDisplay + secondOperand;
    }

    this.displayElement.innerText = this.state.firstOperand + secondPartOfExpression;
  }
}
