const input = document.getElementById('input');
var operation;
var buffer;
var op_changed = false;
const ERROR_MSG = 'Error';
const MULTIPLICATION_SIGN = '×';

class Button {


    constructor(text, callback, cssClasses = []) {
        this.element = document.createElement('button');
        this.element.innerText = text;
        this.element.addEventListener('click', callback);
        this.element.classList.add('button');

        if (Array.isArray(cssClasses)) cssClasses.forEach((cl) => this.element.classList.add(cl));
    }

    AppendTo(element) {
        element.appendChild(this.element);
    } 
}

function appendNumber(text) {
    if (op_changed) {
        if (text == '.') input.value = '0.';
        else input.value = text;
        op_changed = false;
        return;
    }

    if (input.value == '0' && text != '.') input.value = text;
    else if (input.value == ERROR_MSG) {
        if (text == '.') input.value = '0.';
        else input = text;
    } 
    else input.value += text;
}

class InputButton extends Button {
    constructor(text, input) {
        const callback = () => appendNumber(text);
        super(text, callback, ['num-button']);
    }
}

function compute() {
    let num1 = Number(buffer);
    let num2 = Number(input.value);
    let result;

    switch (operation) {
        case "-":
            result = num1 - num2;
            break;
        case "+":
            result = num1 + num2;
            break;
        case "/":
            result = num1 / num2;
            break;
        case MULTIPLICATION_SIGN:
            result = num1 * num2;
            break;
        default:
            result = num1;
            break;
    }

    input.value = isNaN(result) || !isFinite(result) ? ERROR_MSG : result.toString();
    operation = "";
    buffer = "";
    op_changed = true;
}


function setOperator(op) {
    operation = op;
    buffer = input.value;
    op_changed = true;
}

function changeSign() {
    let text = input.value;
    if (text === '0') return;

    if (text.startsWith('-')) text = text.slice(1);
    else text = '-' + text;
    input.value = text;
}


function clear() {
    input.value = '0';
    buffer = '';
    operation = '';
}

function rm() {
    if (input.value === '0') return;
    else if (input.value.length === 1) input.value = '0';
    else input.value = input.value.slice(0, input.value.length - 1);
}

function square() {
    let num = Number(input.value);
    input.value = String(num * num);
}

function createButtons() {
    let base = document.getElementById('buttons');

    let rows = [];

    rows.push([
        new Button('←', rm),
        new Button('C', clear), 
        new Button('x²', square, ['italics']),
        new Button('/', () => setOperator('/'))
    ]);

    let operators = [MULTIPLICATION_SIGN, "-", "+"];
    for (let i = 9; i > 0;) {
        let row = [];
        for (let j = 0; j < 3; j++) {
            row.push(new InputButton(String(i--), input));
        }
        row.push(new Button(operators[i / 3], () => setOperator(operators[i / 3])));
        rows.push(row);
    }

    rows.push([
        new Button('+/-', changeSign, ['num-button']), 
        new InputButton('0', input),
        new InputButton('.', input),
        new Button('=', compute, ['equals-button'])
    ]);

    rows.forEach((row) => {
        let div = document.createElement('div');
        row.forEach(button => {
            button.AppendTo(div);            
        });
        base.appendChild(div);
    });
}

createButtons();

function keydownCallback(event) {
    let key = event.key;
    if (key >= '0' && key <= '9' || key == '.') appendNumber(key);
    else if (['+', '/', MULTIPLICATION_SIGN, '-'].includes(key)) setOperator(key);
    else if (key == 'Backspace') rm();
    else if (key == 'Enter') compute();
}

document.addEventListener('keydown', keydownCallback);