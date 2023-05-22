class ProductionRule {
    constructor(userInput) {
        const arr = userInput.split('->');
        let rules = arr[1].split('|');
        for (let i = 0; i < rules.length; i++) {
            rules[i] = rules[i].trim();
        }
        this.nonTerminal = arr[0].trim();
        this.derivations = rules;
    }
    getNonTerminal() {
        return this.nonTerminal;
    }
    getDerivations() {
        return this.derivations;
    }
    addDerivation(derivation) {
        this.derivations.push(derivation);
    }
    removeDerivation(derivation) {
        let index = this.derivations.indexOf(derivation);
        if (index > -1) {
            this.derivations.splice(index, 1);
        }
    }
    removeDuplicateDerivations() {
        this.derivations = [...new Set(this.derivations)];
    }
}
class Grammar {
    constructor(terminals, nonTerminals, productionRules, startSymbol = 'S') {
        this.terminals = terminals;
        this.nonTerminals = nonTerminals;
        this.productionRules = productionRules;
        this.startSymbol = startSymbol;
    }
    getTerminals() {
        return this.terminals;
    }
    getNonTerminals() {
        return this.nonTerminals;
    }
    getProductionRules() {
        return this.productionRules;
    }
    getStartSymbol() {
        return this.startSymbol;
    }
    addProductionRule(productionRule) {
        this.productionRules.push(productionRule);
    }
    getProductionsForNonTerminal(nonTerminal) {
        for (let i = 0; i < this.productionRules.length; i++) {
            if (this.productionRules[i].getNonTerminal() === nonTerminal) {
                return this.productionRules[i];
            }
        }
        return null;
    }
    hasEpsilonProductions() {
        for (let i = 0; i < this.productionRules.length; i++) {
            if (this.productionRules[i].getDerivations().includes('e')) {
                return true;
            }
        }
        return false;
    }
    hasUnitProductions() {
        for (let i = 0; i < this.productionRules.length; i++) {
            if (this.productionRules[i].getDerivations().length === 1 && this.productionRules[i].getDerivations()[0].length === 1 && this.nonTerminals.includes(this.productionRules[i].getDerivations()[0])) {
                return true;
            }
        }
        return false;
    }
    removeEpsilonProductions() {
        let epsilonNonTerminals = [];
        for (let i = 0; i < this.productionRules.length; i++) {
            if (this.productionRules[i].getDerivations().includes('e')) {
                epsilonNonTerminals.push(this.productionRules[i].getNonTerminal());
            }
        }
        for (let i = 0; i < epsilonNonTerminals.length; i++) {
            for (let j = 0; j < this.productionRules.length; j++) {
                this.productionRules[j].getDerivations().forEach((derivation, index) => {
                    if (derivation.includes(epsilonNonTerminals[i])) {
                        let newDerivation = derivation;
                        if (newDerivation.length === 1) {
                            newDerivation = 'e';
                            this.productionRules[j].removeDerivation(derivation);
                            this.productionRules[j].addDerivation(newDerivation);
                        }
                        else {
                            let nonTerminalCount = derivation.split('').map((symbol, index) => {
                                if (symbol === epsilonNonTerminals[i]) {
                                    return index;
                                }
                            }).filter((index) => index !== undefined).length;
                            let k = 1;
                            let addingDerivations = [];
                            let queue = [];
                            queue.push(derivation);
                            while (k <= Math.pow(2, nonTerminalCount)) {
                                let currentDerivation = queue.shift();
                                let newDerivationArr = currentDerivation.split('');
                                let nonTerminalIndexes = newDerivationArr.map((symbol, index) => {
                                    if (symbol === epsilonNonTerminals[i]) {
                                        return index;
                                    }
                                }).filter((index) => index !== undefined);
                                for (let l = 0; l < nonTerminalIndexes.length; l++) {
                                    let tempArr = newDerivationArr.slice();
                                    tempArr.splice(nonTerminalIndexes[l], 1);
                                    let newDerivationStr = tempArr.join('');
                                    if (!addingDerivations.includes(newDerivationStr)) {
                                        addingDerivations.push(newDerivationStr);
                                        queue.push(newDerivationStr);
                                    }
                                }
                                queue.push(currentDerivation);
                                k++;
                            }
                            addingDerivations.forEach((derivation) => {
                                this.productionRules[j].addDerivation(derivation);
                            });
                            this.productionRules[j].removeDuplicateDerivations();
                        }
                    }
                });
            }
            const nonTerminalDerivations = this.getProductionsForNonTerminal(epsilonNonTerminals[i]);
            nonTerminalDerivations === null || nonTerminalDerivations === void 0 ? void 0 : nonTerminalDerivations.removeDerivation('e');
        }
        return this;
    }
    removeUnitProductions() {
        return this;
    }
    removeUselessSymbols() {
        return this;
    }
}
export { Grammar, ProductionRule };
