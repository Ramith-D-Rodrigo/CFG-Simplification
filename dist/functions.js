import { Grammar, ProductionRule, ALPHABET_LOWER, ALPHABET_UPPER, START_SYMBOL } from "./definitions.js";
const removeCommas = (str) => {
    str = str.replace(/\s/g, '');
    let arr = str.split(',');
    return arr;
};
const removeInputField = (e) => {
    e.preventDefault();
    const clickedBtn = e.currentTarget;
    const parentDiv = clickedBtn.parentElement;
    parentDiv === null || parentDiv === void 0 ? void 0 : parentDiv.remove();
};
const addNewInputField = (e) => {
    e.preventDefault();
    const inputContainer = document.querySelector('#production-rules-container');
    const newInputField = document.createElement('div');
    newInputField.classList.add('production-rule');
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('placeholder', 'Enter The Production Rule');
    newInput.setAttribute('required', '');
    newInput.classList.add('production-rule-input');
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.innerHTML = 'X';
    newInputField.appendChild(newInput);
    newInputField.appendChild(removeBtn);
    inputContainer === null || inputContainer === void 0 ? void 0 : inputContainer.appendChild(newInputField);
    removeBtn.addEventListener('click', removeInputField);
    newInput.addEventListener('change', inputValidation);
};
const checkSpaces = (str) => {
    if (str.indexOf(' ') >= 0) {
        return true;
    }
    return false;
};
const inputValidation = (e) => {
    const triggeredInput = e.currentTarget;
    if (triggeredInput.id === 'non-terminals' || triggeredInput.id === 'terminals') {
        if (checkSpaces(triggeredInput.value)) {
            triggeredInput.classList.add('is-invalid');
            triggeredInput.classList.remove('is-valid');
        }
        else {
            const arr = removeCommas(triggeredInput.value);
            let flag = true;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].length > 1) {
                    flag = false;
                    break;
                }
                if (triggeredInput.id === 'non-terminals') {
                    if (arr[i] !== arr[i].toUpperCase()) {
                        flag = false;
                        break;
                    }
                    else if (!ALPHABET_UPPER.includes(arr[i])) {
                        flag = false;
                        break;
                    }
                }
                else {
                    if (arr[i] !== arr[i].toLowerCase()) {
                        flag = false;
                        break;
                    }
                    else if (!ALPHABET_LOWER.includes(arr[i])) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag) {
                triggeredInput.classList.remove('is-invalid');
                triggeredInput.classList.add('is-valid');
            }
            else {
                triggeredInput.classList.add('is-invalid');
                triggeredInput.classList.remove('is-valid');
            }
        }
    }
    else if (triggeredInput.classList.contains('production-rule-input')) {
        if (triggeredInput.value.indexOf('->') >= 0) {
            if (triggeredInput.value.indexOf('->') !== triggeredInput.value.lastIndexOf('->')) {
                triggeredInput.classList.add('is-invalid');
                triggeredInput.classList.remove('is-valid');
            }
            else {
                const arr = triggeredInput.value.split('->');
                const leftSide = arr[0].trim();
                if (leftSide.length > 1) {
                    triggeredInput.classList.add('is-invalid');
                    triggeredInput.classList.remove('is-valid');
                }
                else {
                    if (leftSide !== leftSide.toUpperCase()) {
                        triggeredInput.classList.add('is-invalid');
                        triggeredInput.classList.remove('is-valid');
                    }
                    else if (!ALPHABET_UPPER.includes(leftSide)) {
                        triggeredInput.classList.add('is-invalid');
                        triggeredInput.classList.remove('is-valid');
                    }
                    else {
                        triggeredInput.classList.remove('is-invalid');
                        triggeredInput.classList.add('is-valid');
                    }
                }
            }
        }
        else {
            triggeredInput.classList.add('is-invalid');
            triggeredInput.classList.remove('is-valid');
        }
    }
};
const createProductionRules = (productionRules) => {
    let arr = [];
    for (let i = 0; i < productionRules.length; i++) {
        arr[i] = new ProductionRule(productionRules[i]);
    }
    return arr;
};
const createGrammar = (nonTerminals, terminals, productionRules) => {
    const productionRulesArr = createProductionRules(productionRules);
    const grammarTerminalsIt = new Set(removeCommas(terminals)).values();
    const grammarNonTerminalsIt = new Set(removeCommas(nonTerminals)).values();
    const grammarNonTerminals = Array.from(grammarNonTerminalsIt);
    grammarNonTerminals.unshift(START_SYMBOL);
    const grammarTerminals = Array.from(grammarTerminalsIt);
    const grammar = new Grammar(grammarTerminals, grammarNonTerminals, productionRulesArr);
    return grammar;
};
export { removeCommas, removeInputField, addNewInputField, inputValidation, createGrammar };
