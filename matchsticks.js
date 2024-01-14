class Step {
    #proc = 0;
    #vel = 1;
    #prev = null;
    #tc = 0;

    constructor(velocity, previousStep) { // fixed velocity
        if (velocity && Number.isInteger(velocity)) {
            this.#vel = velocity;
        }

        if (previousStep && Object.getPrototypeOf(previousStep) === Step.prototype) {
            this.#prev = previousStep;
        }
    }

    get processed() { return this.#proc; }
    get velocity() { return this.#vel; }
    get previousStep() { return this.#prev; }
    get tickCount() { return this.#tc; }

    tick(count) {
        let iterations = 1;
        if (count && Number.isInteger(count) && count > 1) {
            iterations = count;
        }
        
        for (let i = 1; i <= iterations; i++) {
            this.oneTick();
        }
    }

    oneTick() {
        if (this.#prev) {
            this.#proc += this.#prev.pullForward(this.#vel);
        } else {
            this.#proc += this.#vel;
        }

        this.#tc += 1;

        return true;
    }

    pullForward(request) {
        if (!Number.isInteger(request)) return 0;

        let available = 0;

        if (request >= this.#proc) { // more requested than available, return everything
            available = this.#proc;
        } else { // less requested than available, return requested
            available = request;
        }

        this.#proc -= available;
        return available;
    }

    toString() {
        let retval = "+" + this.#vel + " (" + this.#proc + ")";
        return retval;
    }
}

class System {
    #steps = [];
    #tc = 0;

    get output() { 
        if (this.#steps.length > 0) {
            return this.#steps[this.#steps.length - 1].processed;
        } else {
            return 0;
        }
    }
    get steps() { return this.#steps; }
    get tickCount() { return this.#tc; }
    get throughput() {
        if (this.#tc === 0) {
            return 0;
        } else {
            return this.output / this.#tc;
        }
    }

    addStep(vel) {
        let newStep;

        if (this.#steps.length > 0) {
            newStep = new Step(vel, this.#steps[this.#steps.length - 1]);
        } else {
            newStep = new Step(vel);
        }

        this.#steps.push(newStep);

        return true;
    }

    tick(count) {
        let iterations = 1;
        if (count && Number.isInteger(count) && count > 1) {
            iterations = count;
        }
        
        for (let i = 1; i <= iterations; i++) {
            this.oneTick();
        }
    }

    oneTick() {
        for (let i = this.#steps.length - 1; i >= 0; i--) {
            this.#steps[i].tick();
        }

        this.#tc += 1;

        return true;
    }

    toString() {
        let retval = "";

        for (let i = 0; i < this.#steps.length; i++ ) {
            retval += "[" + this.#steps[i].toString() + "] ";
        }

        retval += "(" + this.output + ")";

        return retval;
    }
}

module.exports = {
    Step: Step,
    System: System
};