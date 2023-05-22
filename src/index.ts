import { Grammar, ProductionRule } from "./definitions.js";
import { removeCommas, removeInputField, addNewInputField, inputValidation, createGrammar } from "./functions.js";


//addBtn is to add a new input field to enter the production rules
const addBtn : HTMLButtonElement | null = document.querySelector('#add-btn');
//non-terminal input field
const nonTerminalInput : HTMLInputElement | null = document.querySelector('#non-terminals');
//terminal input field
const terminalInput : HTMLInputElement | null = document.querySelector('#terminals');
//user form
const userForm : HTMLFormElement | null = document.querySelector('form');

//variables to store the input values
let nonTerminals : string[] = [];
let terminals : string[] = [];
let productionRules : string[] = [];

//Event Listeners

//add the event listeners to the input fields
nonTerminalInput?.addEventListener('change', inputValidation);
terminalInput?.addEventListener('change', inputValidation);
//dynamically added input fields will have the event listener added to them in the addNewInputField function

//add the event listener to the add button
addBtn?.addEventListener('click', addNewInputField);

//add the event listener to the form
userForm?.addEventListener('submit', (e : Event) => {
    e.preventDefault();

    //get all the input fields
    const inputFields = document.querySelectorAll('input');

    //check if all the input fields are valid or not
    let allValid : boolean = true;
    for(let i = 0; i < inputFields.length; i++){
        if(inputFields[i].classList.contains('is-invalid')) {
            allValid = false;
            break;
        }
    }

    if(!allValid){
        alert('Please enter valid input');
        return;
    }

    //get the input values
    const nonTerminalInputValue : string = nonTerminalInput?.value as string;
    const terminalInputValue : string = terminalInput?.value as string;
    const productionRulesInput : NodeListOf<HTMLInputElement> | null = document.querySelectorAll('.production-rule-input');

    let productionRulesInputValues : string[] = [];
    productionRulesInput?.forEach((input : HTMLInputElement) => {
        productionRulesInputValues.push(input.value);
    });


    const grammar = createGrammar(nonTerminalInputValue, terminalInputValue, productionRulesInputValues);
    //console.log(grammar);

    //normalize the grammar

    //1st step -> remove epsilon productions
    grammar.removeEpsilonProductions();
    console.log(grammar);

    //2nd step -> remove unit productions
    //grammar.removeUnitProductions();

    //3rd step -> remove useless symbols
    //grammar.removeUselessSymbols();
});







