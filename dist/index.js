import { addNewInputField, inputValidation, createGrammar } from "./functions.js";
const addBtn = document.querySelector('#add-btn');
const nonTerminalInput = document.querySelector('#non-terminals');
const terminalInput = document.querySelector('#terminals');
const userForm = document.querySelector('form');
let nonTerminals = [];
let terminals = [];
let productionRules = [];
nonTerminalInput === null || nonTerminalInput === void 0 ? void 0 : nonTerminalInput.addEventListener('change', inputValidation);
terminalInput === null || terminalInput === void 0 ? void 0 : terminalInput.addEventListener('change', inputValidation);
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', addNewInputField);
userForm === null || userForm === void 0 ? void 0 : userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputFields = document.querySelectorAll('input');
    let allValid = true;
    for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].classList.contains('is-invalid')) {
            allValid = false;
            break;
        }
    }
    if (!allValid) {
        alert('Please enter valid input');
        return;
    }
    const nonTerminalInputValue = nonTerminalInput === null || nonTerminalInput === void 0 ? void 0 : nonTerminalInput.value;
    const terminalInputValue = terminalInput === null || terminalInput === void 0 ? void 0 : terminalInput.value;
    const productionRulesInput = document.querySelectorAll('.production-rule-input');
    let productionRulesInputValues = [];
    productionRulesInput === null || productionRulesInput === void 0 ? void 0 : productionRulesInput.forEach((input) => {
        productionRulesInputValues.push(input.value);
    });
    const grammar = createGrammar(nonTerminalInputValue, terminalInputValue, productionRulesInputValues);
    grammar.removeEpsilonProductions();
    console.log(grammar);
});
