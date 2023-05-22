import { Grammar, ProductionRule } from "./definitions.js";

//functions

//function to remove commas from the input string and return an array that contains the elements of the string
const removeCommas = (str : string) : string[] => {
    //first remove all the spaces from the string
    str = str.replace(/\s/g, '');

    let arr : string[] = str.split(',');
    return arr;
}

//function to remove the input field of production rules
const removeInputField = (e : Event) : void => {
    e.preventDefault();
    const clickedBtn = e.currentTarget as HTMLButtonElement;    //as HTMLButtonElement is used to tell the compiler that the type of the currentTarget is HTMLButtonElement
    const parentDiv : HTMLElement | null = clickedBtn.parentElement;
    parentDiv?.remove();    //optional chaining
}

//function to add a new input field to enter the production rules
const addNewInputField = (e : Event) : void => {
    e.preventDefault();
    const inputContainer = document.querySelector('#production-rules-container');

    const newInputField = document.createElement('div');
    newInputField.classList.add('production-rule');

    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('placeholder', 'Enter production rule');
    newInput.setAttribute('required', '');
    newInput.classList.add('production-rule-input');

    //remove button to remove the input field
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.innerHTML = 'X';

    newInputField.appendChild(newInput);
    newInputField.appendChild(removeBtn);
    inputContainer?.appendChild(newInputField);

    removeBtn.addEventListener('click', removeInputField);
    newInput.addEventListener('change', inputValidation);   //add the event listener to the new input field
}

//function to check if the input field has spaces or not
const checkSpaces = (str : string) : boolean => {
    if(str.indexOf(' ') >= 0) {
        return true;
    }
    return false;
}

//the production rules input can have spaces to increase readability

//function to check if the input field has spaces or not for the terminal and non-terminal input fields,
//for production rules input field, the spaces are allowed, only check whether '->' is present or not (only one '->' is allowed)
const inputValidation = (e : Event) : void => { //added to input fields on change event
    const triggeredInput = e.currentTarget as HTMLInputElement;
    
    //check if the input field is a terminal input field or a non-terminal input field
    if(triggeredInput.id === 'non-terminals' || triggeredInput.id === 'terminals') {
        //check if the input field has spaces or not
        if(checkSpaces(triggeredInput.value)) {
            triggeredInput.classList.add('is-invalid');
            triggeredInput.classList.remove('is-valid');
        }
        else{
            //check whether non-terminals are in upper case or not and terminals are in lower case or not
            const arr : string[] = removeCommas(triggeredInput.value);
            let flag : boolean = true;
            for(let i = 0; i < arr.length; i++) {
                //at the same time, check if only one character separated by commas is present or not
                if(arr[i].length > 1) {
                    flag = false;
                    break;
                }

                if(triggeredInput.id === 'non-terminals') {
                    if(arr[i] !== arr[i].toUpperCase()) {
                        flag = false;
                        break;
                    }
                }
                else{
                    if(arr[i] !== arr[i].toLowerCase()) {
                        flag = false;
                        break;
                    }
                }
            }
            if(flag){
                triggeredInput.classList.remove('is-invalid');
                triggeredInput.classList.add('is-valid');
            }
            else{
                triggeredInput.classList.add('is-invalid');
                triggeredInput.classList.remove('is-valid');
            }
        }
    }
    else if(triggeredInput.classList.contains('production-rule-input')) {


        //check if the input field has '->' or not
        if(triggeredInput.value.indexOf('->') >= 0) {
            //check whether it has more than one '->' or not
            if(triggeredInput.value.indexOf('->') !== triggeredInput.value.lastIndexOf('->')) {
                triggeredInput.classList.add('is-invalid');
                triggeredInput.classList.remove('is-valid');
            }
            else{
                //check if only one non-terminal is present on the left side of '->' or not
                const arr : string[] = triggeredInput.value.split('->');
                const leftSide : string = arr[0].trim();   //trim() is used to remove the spaces from the left side of '->'

                if(leftSide.length > 1) {
                    triggeredInput.classList.add('is-invalid');
                    triggeredInput.classList.remove('is-valid');
                }
                else{
                    //check if the non-terminal is in upper case or not
                    if(leftSide !== leftSide.toUpperCase()) {
                        triggeredInput.classList.add('is-invalid');
                        triggeredInput.classList.remove('is-valid');
                    }
                    else{
                        triggeredInput.classList.remove('is-invalid');
                        triggeredInput.classList.add('is-valid');
                    }
                }
            }
        }
        else{
            triggeredInput.classList.add('is-invalid');
            triggeredInput.classList.remove('is-valid');
        }
    }
}

//function to create the production rules array
const createProductionRules = (productionRules : string[]) : ProductionRule[] => {
    let arr : ProductionRule[] = [];
    for(let i = 0; i < productionRules.length; i++) {
        arr[i] = new ProductionRule(productionRules[i]);
    }
    return arr;
}

//function to create the grammar object
const createGrammar = (nonTerminals : string, terminals : string, productionRules : string[]) : Grammar => {

    //create the production rules array
    const productionRulesArr : ProductionRule[] = createProductionRules(productionRules);

    const grammarTerminals = removeCommas(terminals);
    const grammarNonTerminals = removeCommas(nonTerminals);

    const grammar : Grammar = new Grammar(grammarTerminals, grammarNonTerminals, productionRulesArr);

    return grammar;
}


export { removeCommas, removeInputField, addNewInputField, inputValidation, createGrammar };