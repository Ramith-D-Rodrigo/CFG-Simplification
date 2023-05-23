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
userForm?.addEventListener('submit', async (e : Event) => {
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
    //simplify the grammar

    //first copy the grammar
    const startingGrammar = grammar.copy();
    console.log("Starting Grammar");
    console.log(JSON.parse(JSON.stringify(startingGrammar)));    //to avoid circular reference error
    //1st step -> remove epsilon productions
    while(grammar.hasEpsilonProductions()){
        grammar.removeEpsilonProductions();
    }

    //2nd step -> remove unit productions
    const epsilonRemovedGrammar = grammar.copy();
    console.log("Epsilon Removed Grammar");
    console.log(JSON.parse(JSON.stringify(epsilonRemovedGrammar)));    //to avoid circular reference error
    while(grammar.hasUnitProductions()){
        grammar.removeUnitProductions();
    }

    //3rd step -> remove useless symbols
    const unitRemovedGrammar = grammar.copy();
    console.log("Unit Removed Grammar");
    console.log(JSON.parse(JSON.stringify(unitRemovedGrammar)));    //to avoid circular reference error
    while(grammar.hasUselessProductions()){
        grammar.removeUselessProductions();
    }
    const finalGrammar = grammar;
    console.log("Final Grammar");
    console.log(JSON.parse(JSON.stringify(finalGrammar)));    //to avoid circular reference error

    //display the final grammar
    const finalGrammarDiv : HTMLDivElement | null = document.querySelector('#final-grammar');
    finalGrammarDiv?.classList.remove('d-none');

    const productionsDiv : HTMLDivElement | null = finalGrammarDiv!.querySelector('#new-production-rules');
    productionsDiv!.innerHTML = ''; //clear the div
    
    const prodRules = finalGrammar.getProductionRules();

    for(let i = 0; i < prodRules.length; i++){
        const div = document.createElement('div');
        div.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mb-2');
        div.innerHTML = prodRules[i].toString();
        productionsDiv?.appendChild(div);   
    }
});







