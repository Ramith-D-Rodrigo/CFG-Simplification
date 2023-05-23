const ALPHABET_LOWER = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const ALPHABET_UPPER = ALPHABET_LOWER.map((letter) => letter.toUpperCase());
const MAX_EXECUTION_TIME_USELESS_PRODUCTION_FIND = 3000;
const MAX_EXECUTION_TIME_ALGORITHM = 5000;
const START_SYMBOL = 'S';
class ProductionRule extends Object {
    constructor(userInput) {
        super();
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
    isEqual(productionRule) {
        if (this.nonTerminal !== productionRule.getNonTerminal()) {
            return false;
        }
        let derivations1 = this.derivations;
        let derivations2 = productionRule.getDerivations();
        if (derivations1.length !== derivations2.length) {
            return false;
        }
        for (let i = 0; i < derivations1.length; i++) {
            if (derivations1[i] !== derivations2[i]) {
                return false;
            }
        }
        return true;
    }
    toString() {
        let str = this.nonTerminal + ' -> ';
        for (let i = 0; i < this.derivations.length; i++) {
            str += this.derivations[i];
            if (i !== this.derivations.length - 1) {
                str += ' | ';
            }
        }
        return str;
    }
}
class Grammar {
    constructor(terminals, nonTerminals, productionRules, startSymbol = START_SYMBOL) {
        this.terminals = terminals;
        this.nonTerminals = nonTerminals;
        this.productionRules = productionRules;
        this.startSymbol = startSymbol;
    }
    removeNonTerminal(nonTerminal) {
        let index = this.nonTerminals.indexOf(nonTerminal);
        if (index > -1) {
            this.nonTerminals.splice(index, 1);
        }
    }
    removeTerminal(terminal) {
        let index = this.terminals.indexOf(terminal);
        if (index > -1) {
            this.terminals.splice(index, 1);
        }
    }
    removeProductionRule(productionRule) {
        let index = this.productionRules.indexOf(productionRule);
        if (index > -1) {
            this.productionRules.splice(index, 1);
        }
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
    getUnitProductions() {
        let unitProductions = [];
        for (let i = 0; i < this.productionRules.length; i++) {
            const unitProduction = this.productionRules[i].getDerivations().filter(derivation => this.getNonTerminals().includes(derivation));
            if (unitProduction.length > 0) {
                let tempProduction = new ProductionRule(this.productionRules[i].getNonTerminal() + '->' + unitProduction.join('|'));
                unitProductions.push(tempProduction);
            }
        }
        return unitProductions;
    }
    hasUnitProductions() {
        if (this.getUnitProductions().length > 0) {
            return true;
        }
        return false;
    }
    getUselessProductions() {
        var _a;
        let nonReachableNonTerminals = this.getNonTerminals().map(i => i);
        nonReachableNonTerminals.splice(nonReachableNonTerminals.indexOf(this.getStartSymbol()), 1);
        let queue = [this.getStartSymbol()];
        while (queue.length > 0) {
            let currentNonTerminal = queue.shift();
            const currentProduction = (_a = this.getProductionsForNonTerminal(currentNonTerminal)) === null || _a === void 0 ? void 0 : _a.getDerivations();
            currentProduction === null || currentProduction === void 0 ? void 0 : currentProduction.forEach((derivation) => {
                for (let j = 0; j < this.getNonTerminals().length; j++) {
                    if (derivation.includes(this.getNonTerminals()[j])) {
                        if (nonReachableNonTerminals.includes(this.getNonTerminals()[j])) {
                            nonReachableNonTerminals.splice(nonReachableNonTerminals.indexOf(this.getNonTerminals()[j]), 1);
                            queue.push(this.getNonTerminals()[j]);
                        }
                    }
                }
            });
        }
        let markedProductions = [];
        let allProductions = [];
        let nonTerminalsThatDeriveTerminals = [];
        for (let i = 0; i < this.productionRules.length; i++) {
            const derivations = this.productionRules[i].getDerivations();
            for (let j = 0; j < derivations.length; j++) {
                const derivationArray = derivations[j].split('');
                if (derivationArray.every((element) => this.getTerminals().includes(element))) {
                    const tempProduction = new ProductionRule(this.productionRules[i].getNonTerminal() + '->' + derivations[j]);
                    markedProductions.push(tempProduction);
                    nonTerminalsThatDeriveTerminals.push(this.productionRules[i].getNonTerminal());
                }
                const tempProduction = new ProductionRule(this.productionRules[i].getNonTerminal() + '->' + derivations[j]);
                allProductions.push(tempProduction);
            }
        }
        let uselessProductions = [];
        for (let i = 0; i < allProductions.length; i++) {
            for (let j = 0; j < markedProductions.length; j++) {
                if (allProductions[i].isEqual(markedProductions[j])) {
                    break;
                }
                const derivationArray = allProductions[i].getDerivations()[0].split('');
                let isMarked = false;
                for (let k = 0; k < derivationArray.length; k++) {
                    if (nonTerminalsThatDeriveTerminals.includes(derivationArray[k])) {
                        isMarked = true;
                        break;
                    }
                }
                if (isMarked) {
                    break;
                }
                if (j === markedProductions.length - 1) {
                    uselessProductions.push(allProductions[i]);
                }
            }
        }
        return { nonReachableNonTerminals: nonReachableNonTerminals, uselessProductions: uselessProductions };
    }
    hasUselessProductions() {
        if (this.getUselessProductions().nonReachableNonTerminals.length > 0 || this.getUselessProductions().uselessProductions.length > 0) {
            return true;
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
                    var _a;
                    if (derivation.includes(epsilonNonTerminals[i])) {
                        let newDerivation = derivation;
                        let epsilonNonTerminalDerivations = (_a = this.getProductionsForNonTerminal(epsilonNonTerminals[i])) === null || _a === void 0 ? void 0 : _a.getDerivations();
                        if (newDerivation.length === 1 && (epsilonNonTerminalDerivations === null || epsilonNonTerminalDerivations === void 0 ? void 0 : epsilonNonTerminalDerivations.length) === 1 && epsilonNonTerminalDerivations[0] === 'e') {
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
                                    if (newDerivationStr === '')
                                        newDerivationStr = 'e';
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
    }
    removeUnitProductions() {
        let unitProductions = this.getUnitProductions();
        for (let i = 0; i < unitProductions.length; i++) {
            const nonTerminalDerivations = this.getProductionsForNonTerminal(unitProductions[i].getDerivations()[0]).getDerivations();
            const addingNonTerminal = unitProductions[i].getNonTerminal();
            for (let j = 0; j < nonTerminalDerivations.length; j++) {
                this.getProductionsForNonTerminal(addingNonTerminal).addDerivation(nonTerminalDerivations[j]);
            }
            this.getProductionsForNonTerminal(addingNonTerminal).removeDerivation(unitProductions[i].getDerivations()[0]);
        }
    }
    removeUselessProductions() {
        const uselessOnes = this.getUselessProductions();
        if (uselessOnes.nonReachableNonTerminals.length > 0) {
            for (let i = 0; i < uselessOnes.nonReachableNonTerminals.length; i++) {
                const removingRules = this.getProductionsForNonTerminal(uselessOnes.nonReachableNonTerminals[i]);
                this.removeProductionRule(removingRules);
                this.removeNonTerminal(uselessOnes.nonReachableNonTerminals[i]);
            }
        }
        if (uselessOnes.uselessProductions.length > 0) {
            for (let i = 0; i < uselessOnes.uselessProductions.length; i++) {
                const nonTerminal = uselessOnes.uselessProductions[i].getNonTerminal();
                const allRules = this.getProductionsForNonTerminal(nonTerminal);
                for (let j = 0; j < allRules.getDerivations().length; j++) {
                    if (allRules.getDerivations()[j] === uselessOnes.uselessProductions[i].getDerivations()[0]) {
                        allRules.removeDerivation(uselessOnes.uselessProductions[i].getDerivations()[0]);
                        break;
                    }
                }
            }
        }
    }
    copy() {
        let newGrammar = new Grammar(this.terminals, this.nonTerminals, this.productionRules);
        return newGrammar;
    }
    printGrammar() {
        console.log('Non-terminals: ', this.nonTerminals);
        console.log('Terminals: ', this.terminals);
        console.log('Start symbol: ', this.startSymbol);
        console.log('Production rules: ');
        console.log(this.productionRules);
    }
}
export { Grammar, ProductionRule, ALPHABET_LOWER, ALPHABET_UPPER, START_SYMBOL };
