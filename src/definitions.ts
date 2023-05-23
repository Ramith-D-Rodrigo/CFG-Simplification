const ALPHABET_LOWER : string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const ALPHABET_UPPER : string[] = ALPHABET_LOWER.map((letter) => letter.toUpperCase());
const MAX_EXECUTION_TIME_USELESS_PRODUCTION_FIND : number = 3000; //in milliseconds
const MAX_EXECUTION_TIME_ALGORITHM : number = 5000; //in milliseconds
const START_SYMBOL : string = 'S';

type uselessReturnObj = {
    nonReachableNonTerminals : string[],
    uselessProductions : ProductionRule[]
}

class ProductionRule extends Object {
    private nonTerminal : string;
    private derivations : string[];

    constructor(userInput: string) {    //userInput is the input entered by the user in the production rules input field (that is validated)
        super();
        const arr : string[] = userInput.split('->');

        //arr[0] contains the non-terminal
        //arr[1] contains the production rules
    
        //split the production rules by '|' and trim the spaces
        let rules : string[] = arr[1].split('|');
        for(let i = 0; i < rules.length; i++) {
            rules[i] = rules[i].trim();
        }

        this.nonTerminal = arr[0].trim();
        this.derivations = rules;
    }

    getNonTerminal() : string {
        return this.nonTerminal;
    }

    getDerivations() : string[] {
        return this.derivations;
    }

    addDerivation(derivation: string) : void {
        this.derivations.push(derivation);
    }

    removeDerivation(derivation: string) : void {
        let index = this.derivations.indexOf(derivation);
        if(index > -1) {
            this.derivations.splice(index, 1);
        }
    }

    removeDuplicateDerivations() : void {
        this.derivations = [...new Set(this.derivations)];
    }

    isEqual(productionRule: ProductionRule) : boolean {
        if(this.nonTerminal !== productionRule.getNonTerminal()) {
            return false;
        }

        let derivations1 : string[] = this.derivations;
        let derivations2 : string[] = productionRule.getDerivations();

        if(derivations1.length !== derivations2.length) {
            return false;
        }

        for(let i = 0; i < derivations1.length; i++) {
            if(derivations1[i] !== derivations2[i]) {
                return false;
            }
        }

        return true;
    }

    override toString() : string {
        let str : string = this.nonTerminal + ' -> ';
        for(let i = 0; i < this.derivations.length; i++) {
            str += this.derivations[i];
            if(i !== this.derivations.length - 1) {
                str += ' | ';
            }
        }
        return str;
    }
}

class Grammar {
    private terminals : string[];
    private nonTerminals : string[];
    private productionRules : ProductionRule[];
    private startSymbol : string;

    constructor(terminals: string[], nonTerminals: string[], productionRules: ProductionRule[], startSymbol: string = START_SYMBOL) {
        this.terminals = terminals;
        this.nonTerminals = nonTerminals;
        this.productionRules = productionRules;
        this.startSymbol = startSymbol;
    }

    removeNonTerminal(nonTerminal: string) : void {
        let index = this.nonTerminals.indexOf(nonTerminal);
        if(index > -1) {
            this.nonTerminals.splice(index, 1);
        }
    }

    removeTerminal(terminal: string) : void {
        let index = this.terminals.indexOf(terminal);
        if(index > -1) {
            this.terminals.splice(index, 1);
        }
    }

    removeProductionRule(productionRule: ProductionRule) : void {
        let index = this.productionRules.indexOf(productionRule);
        if(index > -1) {
            this.productionRules.splice(index, 1);
        }
    }

    getTerminals() : string[] {
        return this.terminals;
    }

    getNonTerminals() : string[] {
        return this.nonTerminals;
    }

    getProductionRules() : ProductionRule[] {
        return this.productionRules;
    }

    getStartSymbol() : string {
        return this.startSymbol;
    }

    //add a new production rule
    addProductionRule(productionRule: ProductionRule) : void {
        this.productionRules.push(productionRule);
    }

    //get the production rules for a particular non-terminal
    getProductionsForNonTerminal(nonTerminal: string) : ProductionRule | null {
        for(let i = 0; i < this.productionRules.length; i++) {
            if(this.productionRules[i].getNonTerminal() === nonTerminal) {
                return this.productionRules[i];
            }
        }
        return null;
    }

    hasEpsilonProductions() : boolean { //returns true if the grammar has epsilon productions
        for(let i = 0; i < this.productionRules.length; i++) {
            if(this.productionRules[i].getDerivations().includes('e')) {
                return true;
            }
        }
        return false;
    }

    getUnitProductions() : ProductionRule[] { //returns an array of non-terminals that have unit productions
        let unitProductions : ProductionRule[] = [];
        for(let i = 0; i < this.productionRules.length; i++) {
            const unitProduction : string[] = this.productionRules[i].getDerivations().filter(derivation => this.getNonTerminals().includes(derivation));
            if(unitProduction.length > 0){
                let tempProduction = new ProductionRule(this.productionRules[i].getNonTerminal() + '->' + unitProduction.join('|'));
                unitProductions.push(tempProduction);
            }
        }
        return unitProductions;
    }

    hasUnitProductions() : boolean { //returns true if the grammar has unit productions
        if(this.getUnitProductions().length > 0){
            return true;
        }
        return false;
    }

    getUselessProductions() : uselessReturnObj{ //returns an array of non-terminals that have useless productions
        //first check for productions that are unreachable
        let nonReachableNonTerminals : string[] = this.getNonTerminals().map(i => i); //at first, all the non-terminals are unreachable
        nonReachableNonTerminals.splice(nonReachableNonTerminals.indexOf(this.getStartSymbol()), 1);    //ignore start symbol from nonReachableNonTerminals as it is reachable by default

        //start with start symbol
        let queue : string[] = [this.getStartSymbol()]; //queue for BFS
        while(queue.length > 0) {
            let currentNonTerminal : string = queue.shift()!; //get the first element from the queue
            const currentProduction : string[] | undefined = this.getProductionsForNonTerminal(currentNonTerminal)?.getDerivations(); //get the production rules for the current non-terminal
            currentProduction?.forEach((derivation) => { //go through all the derivations
                //console.log("checking ", derivation, " for ", currentNonTerminal);
                for(let j = 0; j < this.getNonTerminals().length; j++) { //go through all the non-terminals
                    if(derivation.includes(this.getNonTerminals()[j])) { //if the derivation contains a non-terminal
                        if(nonReachableNonTerminals.includes(this.getNonTerminals()[j])) { //if the non-terminal is in the nonReachableNonTerminals array
                            //console.log("Before splice" ,JSON.parse(JSON.stringify(nonReachableNonTerminals)));
                            nonReachableNonTerminals.splice(nonReachableNonTerminals.indexOf(this.getNonTerminals()[j]), 1); //remove the non-terminal from the nonReachableNonTerminals array
                            queue.push(this.getNonTerminals()[j]); //add the non-terminal to the queue
                            //console.log("After splice" ,JSON.parse(JSON.stringify(nonReachableNonTerminals)));
                        }
                    }
                }
            });
        }
        //check for infinite derivations (productions that derive to themselves so they are useless)
        //mark the productions that derive a terminal
        let markedProductions : ProductionRule[] = [];
        let allProductions : ProductionRule[] = []; //this is to divide all the productions individually (for example, A->B|C will be divided into A->B and A->C)
        let nonTerminalsThatDeriveTerminals: string[] = []; //this is to store the non-terminals that derive terminals
        for(let i = 0; i < this.productionRules.length; i++) {
            const derivations = this.productionRules[i].getDerivations();
            for(let j = 0; j < derivations.length; j++){    //go through all the derivations of the current production
                //check if the current checking derivation contains only terminals
                const derivationArray = derivations[j].split('');
                if(derivationArray.every((element) => this.getTerminals().includes(element))){ //if the derivation contains only terminals
                    const tempProduction = new ProductionRule(this.productionRules[i].getNonTerminal() + '->' + derivations[j]);
                    markedProductions.push(tempProduction);
                    nonTerminalsThatDeriveTerminals.push(this.productionRules[i].getNonTerminal());
                }

                //add the production to the allProductions array
                const tempProduction = new ProductionRule(this.productionRules[i].getNonTerminal() + '->' + derivations[j]);
                allProductions.push(tempProduction);
            }
        }

        //console.log('markedProductions: ', markedProductions);
        //console.log('allProductions: ', allProductions);
        //console.log('non terminals that derive terminals: ', nonTerminalsThatDeriveTerminals);

        let uselessProductions : ProductionRule[] = [];
        //go through all the productions
        for(let i = 0; i < allProductions.length; i++){
            //check if the production is marked
            for(let j = 0; j < markedProductions.length; j++){
                if(allProductions[i].isEqual(markedProductions[j])){
                    //the production is marked
                    //no need to check further
                    break;
                }

                const derivationArray = allProductions[i].getDerivations()[0].split('');
                let isMarked : boolean = false;
                //console.log('derivationArray: ', derivationArray);
                for(let k = 0; k < derivationArray.length; k++){    //go through all the elements of the derivation ( to check if it contains a non-terminal that derives a terminal)
                    if(nonTerminalsThatDeriveTerminals.includes(derivationArray[k])){   //if the derivation contains a non-terminal that derives a terminal
                        //the production is marked
                        //no need to check further
                        //console.log('derivationArray[k]: ', derivationArray[k]);
                        //console.log('nonTerminalsThatDeriveTerminals: ', nonTerminalsThatDeriveTerminals);
                        isMarked = true;
                        break;
                    }
                }

                if(isMarked){
                    break;
                }

                if(j === markedProductions.length - 1){
                    //the production is not marked
                    //add it to the uselessProductions array
                    uselessProductions.push(allProductions[i]);
                }
            }
        }
        //console.log('uselessProductions: ', uselessProductions);
        //now we have the productions that don't derive a terminal
        return {nonReachableNonTerminals : nonReachableNonTerminals, uselessProductions : uselessProductions};
    }

    hasUselessProductions() : boolean{
        if(this.getUselessProductions().nonReachableNonTerminals.length > 0 || this.getUselessProductions().uselessProductions.length > 0){
            return true;
        }
        return false;
    }

    //step 1 -> remove epsilon productions (e productions)
    removeEpsilonProductions() : void{
        //find a non-terminal with epsilon production
        let epsilonNonTerminals : string[] = [];

        for(let i = 0; i < this.productionRules.length; i++){
            if(this.productionRules[i].getDerivations().includes('e')){    //if epsilon production is found
                epsilonNonTerminals.push(this.productionRules[i].getNonTerminal());
            }
        }

        //now we have the non-terminals with epsilon productions
        //replace these non-terminals with epsilon on all the productions
        for(let i = 0; i < epsilonNonTerminals.length; i++){
            for(let j = 0; j < this.productionRules.length; j++){   //go through all the productions to find that has the non-terminal with epsilon production
                this.productionRules[j].getDerivations().forEach((derivation, index) => {
                    if(derivation.includes(epsilonNonTerminals[i])){    //if the production contains the non-terminal that produces epsilon
                        //replace the non-terminal with epsilon
                        let newDerivation : string | string[] = derivation;
                        let epsilonNonTerminalDerivations = this.getProductionsForNonTerminal(epsilonNonTerminals[i])?.getDerivations();
                        //check whether this epsilon production is the only production of the non-terminal
                        if(newDerivation.length === 1 && epsilonNonTerminalDerivations?.length === 1 && epsilonNonTerminalDerivations[0] === 'e'){   
                            this.productionRules[j].removeDerivation(derivation);    //remove the old production
                            this.productionRules[j].addDerivation(newDerivation as string);    //add the new production
                        }
                        else{
                            //have to check all the possible combinations
                            //for example, if A has epsilon production and B -> ABAC, then we have to add B -> ABC, B -> AC, B -> BC 
                            let nonTerminalCount : number = derivation.split('').map((symbol, index) => {
                                if(symbol === epsilonNonTerminals[i]){
                                    return index;
                                }
                            }).filter((index) => index !== undefined).length;
                            
                            let k = 1;
                            let addingDerivations : string[] = [];

                            //create a queue
                            let queue : string[] = [];
                            queue.push(derivation as string);
                            while(k <= Math.pow(2, nonTerminalCount)){
                                //dequeue the first element
                                //console.log(queue);
                                let currentDerivation : string = queue.shift()!;
                                let newDerivationArr : string[] = currentDerivation.split('');

                                let nonTerminalIndexes = newDerivationArr.map((symbol, index) => {
                                    if(symbol === epsilonNonTerminals[i]){
                                        return index;
                                    }
                                }).filter((index) => index !== undefined);

                                //console.log(nonTerminalIndexes);
                                for(let l = 0; l < nonTerminalIndexes.length; l++){
                                    //create a copy of the newDerivationArr
                                    let tempArr : string[] = newDerivationArr.slice();
                                    //console.log(tempArr);
                                    //remove the non-terminal at index nonTerminalIndexes[j]
                                    tempArr.splice(nonTerminalIndexes[l]!, 1);
                                    let newDerivationStr : string = tempArr.join('');
                                    if(newDerivationStr === '') newDerivationStr = 'e'; //if the derivation is empty, replace it with epsilon
                                    //console.log(newDerivationStr);
                                    if(!addingDerivations.includes(newDerivationStr)){
                                        addingDerivations.push(newDerivationStr);
                                        queue.push(newDerivationStr);
                                    }
                                }
                                //enqueue back the current derivation
                                queue.push(currentDerivation);
                                k++;
                            }
                            //console.log(addingDerivations);

                            //add the new derivations to the production rules
                            addingDerivations.forEach((derivation) => {
                                this.productionRules[j].addDerivation(derivation);
                            });

                            //remove the duplicate derivations
                            this.productionRules[j].removeDuplicateDerivations();
                        }
                    }
                });
            }

            //remove the epsilon production
            const nonTerminalDerivations : ProductionRule | null = this.getProductionsForNonTerminal(epsilonNonTerminals[i]);
            nonTerminalDerivations?.removeDerivation('e');
        }
    }

    //step 2 -> remove unit productions
    removeUnitProductions() : void{
        //find the unit productions
        let unitProductions : ProductionRule[] = this.getUnitProductions();

        //replace the unit productions
        for(let i = 0; i < unitProductions.length; i++){
            //find the productions for the non-terminal
            //unit productions have only one derivation (A -> B)
            //so we can just get the first derivation
            //unitProductions[i].getDerivations()[0] is B (for A -> B)
            //we need to get all derivations of B to replace A -> B and add them to A
            const nonTerminalDerivations : string[] = this.getProductionsForNonTerminal(unitProductions[i].getDerivations()[0])!.getDerivations();
            const addingNonTerminal : string = unitProductions[i].getNonTerminal();
            for(let j = 0; j < nonTerminalDerivations.length; j++){
                //add the new production
                this.getProductionsForNonTerminal(addingNonTerminal)!.addDerivation(nonTerminalDerivations[j]);
            }
            //remove the unit production
            this.getProductionsForNonTerminal(addingNonTerminal)!.removeDerivation(unitProductions[i].getDerivations()[0]);
        }
    }

    //step 3 -> remove useless symbols
    removeUselessProductions() : void{
        const uselessOnes : uselessReturnObj = this.getUselessProductions();
        //console.log(uselessOnes);


        if(uselessOnes.nonReachableNonTerminals.length > 0){    //has non-reachable non-terminals
            //remove the non-reachable non-terminals
            for(let i = 0; i < uselessOnes.nonReachableNonTerminals.length; i++){
                //first remove the production rules for the non-terminal
                const removingRules = this.getProductionsForNonTerminal(uselessOnes.nonReachableNonTerminals[i]);
                this.removeProductionRule(removingRules!);

                //now remove the non-terminal from the alphabet
                this.removeNonTerminal(uselessOnes.nonReachableNonTerminals[i]);
            }
        }

        if(uselessOnes.uselessProductions.length > 0){   //has useless productions (that don't produce terminals)
            for(let i = 0; i < uselessOnes.uselessProductions.length; i++){
                const nonTerminal = uselessOnes.uselessProductions[i].getNonTerminal();
                //find the production rules for the non-terminal
                const allRules = this.getProductionsForNonTerminal(nonTerminal);

                for(let j = 0; j < allRules!.getDerivations().length; j++){
                    if(allRules!.getDerivations()[j] === uselessOnes.uselessProductions[i].getDerivations()[0]){
                        //remove the production rule (uselessOnes.uselessProductions[i].getDerivations()[0] is the derivation that is useless)
                        allRules!.removeDerivation(uselessOnes.uselessProductions[i].getDerivations()[0]);
                        break; //break out of the loop because we found the production rule that we want to remove
                    }
                }
            }
        }
    }

    //copy constructor
    copy() : Grammar{
        let newGrammar : Grammar = new Grammar(this.terminals, this.nonTerminals, this.productionRules);
        return newGrammar;
    }
    
    printGrammar() : void{
        console.log('Non-terminals: ', this.nonTerminals);
        console.log('Terminals: ', this.terminals);
        console.log('Start symbol: ', this.startSymbol);
        console.log('Production rules: ');
        console.log(this.productionRules);
    }
}

export { Grammar, ProductionRule, ALPHABET_LOWER, ALPHABET_UPPER, START_SYMBOL };