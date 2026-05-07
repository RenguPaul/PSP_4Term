<<<<<<< HEAD
let a = '', b = '', op = null, last = null;
const max = 12;
const display = document.getElementById('display');

function format(n) {
    if (n === '') return '0';
    let num = parseFloat(n);
    if (isNaN(num)) return '0';
    if (!isFinite(num)) return 'Error';

    let str = num.toString();
    if (str.includes('e')) return num.toExponential(max - 5);

    let [intPart, frac = ''] = str.split('.');
    if (intPart.length > max) return num.toExponential(max - 5);

    let maxFrac = Math.max(0, max - intPart.length - 1);
    if (frac.length > maxFrac) frac = frac.slice(0, maxFrac);

    str = intPart + (frac ? '.' + frac : '');
    str = str.replace(/\.?0+$/, '');
    return str.length > max ? num.toExponential(max - 5) : str;
}

function update(v, isError = false) {
    if (isError) {
        display.textContent = 'Error';
        display.style.transform = 'scale(0.99)';
        setTimeout(() => display.style.transform = '', 100);
        return;
    }
    let val = format(v);
    display.style.transform = 'scale(0.99)';
    setTimeout(() => display.style.transform = '', 100);
    display.textContent = val === 'Error' ? 'Error' : val;
}

function addDigit(d) {
    if (display.textContent === 'Error') {
        clearAll();
    }

    if (!op) {
        // Если текущее значение 0 или пустое, заменяем его на новую цифру
        if (a === '' || a === '0') {
            if (d === '.') {
                a = '0.';
            } else {
                a = d;
            }
        } else {
            if (d === '.' && a.includes('.')) return;
            if (a.replace(/[-.]/g, '').length >= max && d !== '.') return;
            a += d;
        }
        update(a || '0');
    } else {
        // Аналогично для b
        if (b === '' || b === '0') {
            if (d === '.') {
                b = '0.';
            } else {
                b = d;
            }
        } else {
            if (d === '.' && b.includes('.')) return;
            if (b.replace(/[-.]/g, '').length >= max && d !== '.') return;
            b += d;
        }
        update(b || '0');
    }
}

function backspace() {
    if (display.textContent === 'Error') {
        clearAll();
        return;
    }
    if (!op && a) {
        a = a.slice(0, -1);
        if (a === '' || a === '-') a = '';
    }
    else if (op && b) {
        b = b.slice(0, -1);
        if (b === '' || b === '-') b = '';
    }
    update(a || b || '0');
}

function clearAll() {
    a = b = '';
    op = last = null;
    update('0');
}

function changeSign() {
    if (display.textContent === 'Error') return;
    let val = !op && a ? a : (b ? b : null);
    if (!val || val === '') return;
    let num = parseFloat(val);
    let res = -num;
    if (!op) a = res.toString();
    else b = res.toString();
    update(!op ? a : b);
}

function calc() {
    if (display.textContent === 'Error') return;
    if ((!a || !b) && op !== '^') return;
    let x = parseFloat(a), y = parseFloat(b), res;
    switch(op) {
        case '+': res = x + y; break;
        case '-': res = x - y; break;
        case '*': res = x * y; break;
        case '/':
            if (y === 0) {
                update(null, true);
                a = b = '';
                op = null;
                return;
            }
            res = x / y;
            break;
        case '^': res = Math.pow(x, b ? y : 2); break;
        default: return;
    }
    if (!isFinite(res)) {
        update(null, true);
        a = b = '';
        op = null;
        return;
    }
    last = res;
    a = res.toString();
    b = '';
    op = null;
    update(a);
}

function unary(fn) {
    if (display.textContent === 'Error') return;
    let val = !op && a ? a : (b ? b : null);
    if (!val || val === '') return;
    let num = parseFloat(val);
    let res = fn(num);

    if (isNaN(res) || !isFinite(res)) {
        update(null, true);
        if (!op) a = '';
        else b = '';
        return;
    }

    if (!op) a = res.toString();
    else b = res.toString();
    update(!op ? a : b);
}

function fact(n) {
    if (!Number.isInteger(n) || n < 0 || n > 170) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function sqrt(n) {
    if (n < 0) return NaN;
    return Math.sqrt(n);
}

// обработчики
document.querySelectorAll('[data-digit]').forEach(btn => {
    btn.onclick = () => addDigit(btn.dataset.digit);
});

document.querySelector('[data-backspace]').onclick = backspace;
document.querySelector('[data-clear]').onclick = clearAll;
document.querySelector('[data-equal]').onclick = calc;
document.querySelector('[data-sign]').onclick = changeSign;
document.querySelector('[data-percent]').onclick = () => unary(x => x / 100);
document.querySelector('[data-reciprocal]').onclick = () => unary(x => 1 / x);
document.querySelector('[data-factorial]').onclick = () => unary(x => fact(x));
document.querySelector('[data-sqrt]').onclick = () => unary(x => sqrt(x));
document.querySelector('[data-power]').onclick = () => unary(x => x * x);

document.querySelectorAll('[data-op]').forEach(btn => {
    btn.onclick = () => {
        if (display.textContent === 'Error') return;
        if (!a && last) a = last.toString();
        if (a && a !== '') op = btn.dataset.op;
    };
});

// клавиатура
document.addEventListener('keydown', e => {
    if (display.textContent === 'Error') {
        if (e.key === 'Escape') clearAll();
        return;
    }
    if (e.key >= '0' && e.key <= '9') addDigit(e.key);
    if (e.key === '.') addDigit('.');
    if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
    if (e.key === 'Escape') clearAll();
    if (e.key === 'Enter') calc();
    if (e.key === '+' && a) op = '+';
    if (e.key === '-' && a) op = '-';
    if (e.key === '*' && a) op = '*';
    if (e.key === '/' && a) op = '/';
});

update('0');ч
=======
let a = '', b = '', op = null, last = null;
const max = 12;
const display = document.getElementById('display');

function format(n) {
    if (n === '') return '0';
    let num = parseFloat(n);
    if (isNaN(num)) return '0';
    if (!isFinite(num)) return 'Error';

    let str = num.toString();
    if (str.includes('e')) return num.toExponential(max - 5);

    let [intPart, frac = ''] = str.split('.');
    if (intPart.length > max) return num.toExponential(max - 5);

    let maxFrac = Math.max(0, max - intPart.length - 1);
    if (frac.length > maxFrac) frac = frac.slice(0, maxFrac);

    str = intPart + (frac ? '.' + frac : '');
    str = str.replace(/\.?0+$/, '');
    return str.length > max ? num.toExponential(max - 5) : str;
}

function update(v, isError = false) {
    if (isError) {
        display.textContent = 'Error';
        display.style.transform = 'scale(0.99)';
        setTimeout(() => display.style.transform = '', 100);
        return;
    }
    let val = format(v);
    display.style.transform = 'scale(0.99)';
    setTimeout(() => display.style.transform = '', 100);
    display.textContent = val === 'Error' ? 'Error' : val;
}

function addDigit(d) {
    if (display.textContent === 'Error') {
        clearAll();
    }

    if (!op) {
        // Если текущее значение 0 или пустое, заменяем его на новую цифру
        if (a === '' || a === '0') {
            if (d === '.') {
                a = '0.';
            } else {
                a = d;
            }
        } else {
            if (d === '.' && a.includes('.')) return;
            if (a.replace(/[-.]/g, '').length >= max && d !== '.') return;
            a += d;
        }
        update(a || '0');
    } else {
        // Аналогично для b
        if (b === '' || b === '0') {
            if (d === '.') {
                b = '0.';
            } else {
                b = d;
            }
        } else {
            if (d === '.' && b.includes('.')) return;
            if (b.replace(/[-.]/g, '').length >= max && d !== '.') return;
            b += d;
        }
        update(b || '0');
    }
}

function backspace() {
    if (display.textContent === 'Error') {
        clearAll();
        return;
    }
    if (!op && a) {
        a = a.slice(0, -1);
        if (a === '' || a === '-') a = '';
    }
    else if (op && b) {
        b = b.slice(0, -1);
        if (b === '' || b === '-') b = '';
    }
    update(a || b || '0');
}

function clearAll() {
    a = b = '';
    op = last = null;
    update('0');
}

function changeSign() {
    if (display.textContent === 'Error') return;
    let val = !op && a ? a : (b ? b : null);
    if (!val || val === '') return;
    let num = parseFloat(val);
    let res = -num;
    if (!op) a = res.toString();
    else b = res.toString();
    update(!op ? a : b);
}

function calc() {
    if (display.textContent === 'Error') return;
    if ((!a || !b) && op !== '^') return;
    let x = parseFloat(a), y = parseFloat(b), res;
    switch(op) {
        case '+': res = x + y; break;
        case '-': res = x - y; break;
        case '*': res = x * y; break;
        case '/':
            if (y === 0) {
                update(null, true);
                a = b = '';
                op = null;
                return;
            }
            res = x / y;
            break;
        case '^': res = Math.pow(x, b ? y : 2); break;
        default: return;
    }
    if (!isFinite(res)) {
        update(null, true);
        a = b = '';
        op = null;
        return;
    }
    last = res;
    a = res.toString();
    b = '';
    op = null;
    update(a);
}

function unary(fn) {
    if (display.textContent === 'Error') return;
    let val = !op && a ? a : (b ? b : null);
    if (!val || val === '') return;
    let num = parseFloat(val);
    let res = fn(num);

    if (isNaN(res) || !isFinite(res)) {
        update(null, true);
        if (!op) a = '';
        else b = '';
        return;
    }

    if (!op) a = res.toString();
    else b = res.toString();
    update(!op ? a : b);
}

function fact(n) {
    if (!Number.isInteger(n) || n < 0 || n > 170) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function sqrt(n) {
    if (n < 0) return NaN;
    return Math.sqrt(n);
}

// обработчики
document.querySelectorAll('[data-digit]').forEach(btn => {
    btn.onclick = () => addDigit(btn.dataset.digit);
});

document.querySelector('[data-backspace]').onclick = backspace;
document.querySelector('[data-clear]').onclick = clearAll;
document.querySelector('[data-equal]').onclick = calc;
document.querySelector('[data-sign]').onclick = changeSign;
document.querySelector('[data-percent]').onclick = () => unary(x => x / 100);
document.querySelector('[data-reciprocal]').onclick = () => unary(x => 1 / x);
document.querySelector('[data-factorial]').onclick = () => unary(x => fact(x));
document.querySelector('[data-sqrt]').onclick = () => unary(x => sqrt(x));
document.querySelector('[data-power]').onclick = () => unary(x => x * x);

document.querySelectorAll('[data-op]').forEach(btn => {
    btn.onclick = () => {
        if (display.textContent === 'Error') return;
        if (!a && last) a = last.toString();
        if (a && a !== '') op = btn.dataset.op;
    };
});

// клавиатура
document.addEventListener('keydown', e => {
    if (display.textContent === 'Error') {
        if (e.key === 'Escape') clearAll();
        return;
    }
    if (e.key >= '0' && e.key <= '9') addDigit(e.key);
    if (e.key === '.') addDigit('.');
    if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
    if (e.key === 'Escape') clearAll();
    if (e.key === 'Enter') calc();
    if (e.key === '+' && a) op = '+';
    if (e.key === '-' && a) op = '-';
    if (e.key === '*' && a) op = '*';
    if (e.key === '/' && a) op = '/';
});

update('0');ч
>>>>>>> 8cde14a13e30d51f4186dbd8ea73b1fecdfd8041
