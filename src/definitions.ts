class ProductionRule {
    private nonTerminal : string;
    private derivations : string[];

    constructor(userInput: string) {    //userInput is the input entered by the user in the production rules input field (that is validated)
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
}

class Grammar {
    private terminals : string[];
    private nonTerminals : string[];
    private productionRules : ProductionRule[];
    private startSymbol : string;

    constructor(terminals: string[], nonTerminals: string[], productionRules: ProductionRule[], startSymbol: string = 'S') {
        this.terminals = terminals;
        this.nonTerminals = nonTerminals;
        this.productionRules = productionRules;
        this.startSymbol = startSymbol;
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

    hasUnitProductions() : boolean { //returns true if the grammar has unit productions
        for(let i = 0; i < this.productionRules.length; i++) {
            if(this.productionRules[i].getDerivations().length === 1 && this.productionRules[i].getDerivations()[0].length === 1 && this.nonTerminals.includes(this.productionRules[i].getDerivations()[0])) {
                return true;
            }
        }
        return false;
    }


    //step 1 -> remove epsilon productions (e productions)
    removeEpsilonProductions() : Grammar{
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
                        if(newDerivation.length === 1){    //if the non-terminal is the only symbol in the production
                            newDerivation = 'e';  //replace it with epsilon
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
        return this;
    }

    //step 2 -> remove unit productions
    removeUnitProductions() : Grammar{
        return this;
    }

    //step 3 -> remove useless symbols
    removeUselessSymbols() : Grammar{
        return this;
    }

}

export { Grammar, ProductionRule };