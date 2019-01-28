/**
 * Value of divider for task 1
 * @type {number}
 */
const devider = 3;

/**
 * Array of questions for task 2
 * @type {*[]}
 */
const arrQuestions = [
    {'question': 'Javascript functions can take an unlimited number of arguments?', 'answer': true},
    {'question': 'In Javascript: \'baseball\' > \'football\'?', 'answer': true},
    {'question': 'It\'s true in Javascript? \'3\' + 2 === \'32\'', 'answer': true},
    {'question': 'In Javascript:\'true\' = true', 'answer': false},
    {'question': 'In Javascript: true % 1 === 0?', 'answer': true},
];

window.onload = function () {
    const btn1 = document.getElementById('btnTask1');
    const btnClear1 = document.getElementById('btnClear1');
    const result1 = document.getElementById('result1');
    const btn2 = document.getElementById('btnTask2');
    const result2 = document.getElementById('result2');

    /**
     * Handler for Button Task 1
     */
    btn1.onclick = function () {
        const num = parseInt(prompt('Enter the number (must be a positive):'));

        if (isNaN(num)) {
            alert('Value must be a number!');
        }
        else if (num < 0) {
            alert('Number should be a positive!');
        }
        else {
            let result = 0;
            for (let i = 0; i < num; i++) {
                if (!(i % devider))
                    result += i;
            }
            alert('Result = ' + result);
            result1.innerHTML = 'Amount from 0 to ' + num + ' = ' + result;
        }
    };

    /**
     * Handler for Button Clear in Task 1
     */
    btnClear1.onclick = function () {
        result1.innerHTML = '';
    };

    /**
     * Handler for Button Task 2
     */
    btn2.onclick = function () {
        let testPoints = 0;

        arrQuestions.forEach(function (item, i) {
            if (confirm((i + 1) + '. ' + item.question) === item.answer)
                testPoints++;
        });

        alert('Result = ' + testPoints);
        result2.innerHTML = 'Your result is ' + testPoints + ' points';
    };

};