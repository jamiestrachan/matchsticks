class Step {
    #proc = 0;
    #vel = 1;
    #prev = null;

    constructor(velocity, previousStep) { // fixed velocity
        if (Number.isInteger(velocity)) {
            this.#vel = velocity;
        }

        if (previousStep && Object.getPrototypeOf(previousStep) === Step.prototype) {
            this.#prev = previousStep;
        }

    }

    get processed() { return this.#proc; }
    get velocity() { return this.#vel; }
    get previousStep() { return this.#prev; }

    tick() {
        if (this.#prev) {
            this.#proc += this.#prev.pullForward(this.#vel);
        } else {
            this.#proc += this.#vel;
        }
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
}

module.exports = {
    Step: Step,
};