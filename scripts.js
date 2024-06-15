const display = document.querySelector('.display-window');
const buttons = document.querySelectorAll('.btn-calc');

const calculator = new Calculator(display, buttons);

calculator.init();
