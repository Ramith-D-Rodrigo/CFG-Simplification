var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
userForm === null || userForm === void 0 ? void 0 : userForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
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
    const startingGrammar = grammar.copy();
    console.log("Starting Grammar");
    console.log(JSON.parse(JSON.stringify(startingGrammar)));
    while (grammar.hasEpsilonProductions()) {
        grammar.removeEpsilonProductions();
    }
    const epsilonRemovedGrammar = grammar.copy();
    console.log("Epsilon Removed Grammar");
    console.log(JSON.parse(JSON.stringify(epsilonRemovedGrammar)));
    while (grammar.hasUnitProductions()) {
        grammar.removeUnitProductions();
    }
    const unitRemovedGrammar = grammar.copy();
    console.log("Unit Removed Grammar");
    console.log(JSON.parse(JSON.stringify(unitRemovedGrammar)));
    while (grammar.hasUselessProductions()) {
        grammar.removeUselessProductions();
    }
    const finalGrammar = grammar;
    console.log("Final Grammar");
    console.log(JSON.parse(JSON.stringify(finalGrammar)));
}));
