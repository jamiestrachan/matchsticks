const { Step, System } = require('./matchsticks.js');

test('expect Step class to exist with defaults', () => {
    const step1 = new Step();

    expect(step1).toBeDefined();
    expect(step1.processed).toBe(0);
    expect(step1.velocity).toBe(1);
    expect(step1.previousStep).toBe(null);
    expect(step1.tick).toBeDefined();
    expect(step1.tickCount).toBe(0);
    
    const step2 = new Step(2);
    expect(step2.velocity).toBe(2);
    
    const step3 = new Step("string"); // bad initial value should force velocity to 1
    expect(step3.velocity).toBe(1);
    
    const step4 = new Step(2.5); // bad initial value should force velocity to 1
    expect(step4.velocity).toBe(1);
});

test('Step.tickCount should increment with each tick()', () => {
    const step1 = new Step();
    expect(step1.tickCount).toBe(0);
    
    step1.tick();
    expect(step1.tickCount).toBe(1);
    step1.tick();
    expect(step1.tickCount).toBe(2);
    step1.tick();
    expect(step1.tickCount).toBe(3);
    step1.tick();
    step1.tick();
    step1.tick();
    expect(step1.tickCount).toBe(6);
});

test('expect tick() to process items at velocity speed if there is no previous Step', () => {
    const step1 = new Step();
    expect(step1.velocity).toBe(1);
    expect(step1.processed).toBe(0);

    step1.tick();
    expect(step1.processed).toBe(1);
    step1.tick();
    expect(step1.processed).toBe(2);
    step1.tick();
    expect(step1.processed).toBe(3);

    const step2 = new Step(5);
    expect(step2.velocity).toBe(5);
    expect(step2.processed).toBe(0);

    step2.tick();
    expect(step2.processed).toBe(5);
    step2.tick();
    expect(step2.processed).toBe(10);
    step2.tick();
    expect(step2.processed).toBe(15);
});

test('pass an argument to Step.tick() to run multiple ticks', () => {
    const step1 = new Step();

    step1.tick(5);
    expect(step1.tickCount).toBe(5);
    expect(step1.processed).toBe(5);
});

test('expect pullForward() to reduce the available processed items', () => {
    const step1 = new Step(5);
    step1.tick();
    expect(step1.processed).toBe(5);

    expect(step1.pullForward(2)).toBe(2);
    expect(step1.processed).toBe(3);

    expect(step1.pullForward(2)).toBe(2);
    expect(step1.processed).toBe(1);

    expect(step1.pullForward(2)).toBe(1);
    expect(step1.processed).toBe(0);

    expect(step1.pullForward(2)).toBe(0);
    expect(step1.processed).toBe(0);

    step1.tick();
    expect(step1.processed).toBe(5);

    expect(step1.pullForward(4)).toBe(4);
    expect(step1.processed).toBe(1);

    expect(step1.pullForward(4)).toBe(1);
    expect(step1.processed).toBe(0);
});

test('expect tick() to process items based on items available from the previous step', () => {
    const step1 = new Step(1);
    const step2 = new Step(2, step1);

    step1.tick();
    expect(step1.processed).toBe(1);
    step1.tick();
    expect(step1.processed).toBe(2);
    step1.tick();
    expect(step1.processed).toBe(3);

    step2.tick();
    expect(step2.processed).toBe(2); // step2 processed at full velocity because enough units were available from step1
    expect(step1.processed).toBe(1); // step1 is now down the 2 units taken by step2

    step2.tick();
    expect(step2.processed).toBe(3); // step2 could only process what step1 had available
    expect(step1.processed).toBe(0); // step1 is now out of available units

    step2.tick();
    expect(step2.processed).toBe(3); // step2 can't process any more because step1 is out of units
    expect(step1.processed).toBe(0); // step1 remains at 0 units

    step1.tick();
    step1.tick();
    step2.tick();
    expect(step2.processed).toBe(5);
    expect(step1.processed).toBe(0);
});

test('visualize Step', () => {
    const step1 = new Step();

    expect(step1.toString).toBeDefined();
    expect(step1.toString()).toBe("+1 (0)");

    step1.tick();
    expect(step1.toString()).toBe("+1 (1)");

    const step2 = new Step(4);
    expect(step2.toString()).toBe("+4 (0)");

    step2.tick();
    step2.tick();
    expect(step2.toString()).toBe("+4 (8)");
})

test('expect System class to exist with defaults', () => {
    const sys1 = new System();

    expect(sys1).toBeDefined();
    expect(sys1.output).toBe(0);
    expect(sys1.steps).toStrictEqual([]);
    expect(sys1.addStep).toBeDefined();
    expect(sys1.tick).toBeDefined();
    expect(sys1.tickCount).toBe(0);
});

test('add Steps to a System', () => {
    const sys1 = new System();

    sys1.addStep();
    sys1.addStep(3);
    sys1.addStep(5);
    
    expect(sys1.steps[0].velocity).toBe(1);
    expect(sys1.steps[1].velocity).toBe(3);
    expect(sys1.steps[2].velocity).toBe(5);
    expect(sys1.steps[1].previousStep).toStrictEqual(sys1.steps[0]);
    expect(sys1.steps[2].previousStep).toStrictEqual(sys1.steps[1]);
})

test('tick through a System', () => {
    const sys1 = new System();

    sys1.addStep();
    sys1.addStep();
    sys1.addStep();

    expect(sys1.steps[0].processed).toBe(0);
    expect(sys1.steps[1].processed).toBe(0);
    expect(sys1.steps[2].processed).toBe(0);
    expect(sys1.output).toBe(0);
    
    sys1.tick();
    expect(sys1.steps[0].processed).toBe(1);
    expect(sys1.steps[1].processed).toBe(0);
    expect(sys1.steps[2].processed).toBe(0);
    expect(sys1.output).toBe(0);
    
    sys1.tick();
    expect(sys1.steps[0].processed).toBe(1);
    expect(sys1.steps[1].processed).toBe(1);
    expect(sys1.steps[2].processed).toBe(0);
    expect(sys1.output).toBe(0);
    
    sys1.tick();
    expect(sys1.steps[0].processed).toBe(1);
    expect(sys1.steps[1].processed).toBe(1);
    expect(sys1.steps[2].processed).toBe(1);
    expect(sys1.output).toBe(1);
});

test('System.tickCount should increment with each tick()', () => {
    const sys1 = new System();
    expect(sys1.tickCount).toBe(0);
    
    sys1.tick();
    expect(sys1.tickCount).toBe(1);
    sys1.tick();
    expect(sys1.tickCount).toBe(2);
    sys1.tick();
    expect(sys1.tickCount).toBe(3);
    sys1.tick();
    sys1.tick();
    sys1.tick();
    expect(sys1.tickCount).toBe(6);
});

test('visualize System', () => {
    const sys1 = new System();

    expect(sys1.toString).toBeDefined();
    
    sys1.addStep(3);
    sys1.addStep(2);
    sys1.addStep(1);

    sys1.tick();
    expect(sys1.toString()).toBe("[+3 (3)] [+2 (0)] [+1 (0)] (0)");
    
    sys1.tick();
    expect(sys1.toString()).toBe("[+3 (4)] [+2 (2)] [+1 (0)] (0)");

    sys1.tick();
    expect(sys1.toString()).toBe("[+3 (5)] [+2 (3)] [+1 (1)] (1)");

    sys1.tick();
    expect(sys1.toString()).toBe("[+3 (6)] [+2 (4)] [+1 (2)] (2)");
});

test('calculate System throughput', () => {
    const sys1 = new System();

    sys1.addStep(3);
    sys1.addStep(2);
    sys1.addStep(1);

    sys1.tick();
    expect(sys1.throughput).toBe(0);
    sys1.tick();
    expect(sys1.throughput).toBe(0);
    sys1.tick();
    expect(sys1.throughput).toBeCloseTo(0.33);
    sys1.tick();
    expect(sys1.throughput).toBe(0.5);
});

test('pass an argument to System.tick() to run multiple ticks', () => {
    const sys1 = new System();

    sys1.tick(5);
    expect(sys1.tickCount).toBe(5);
    expect(sys1.output).toBe(0);
    expect(sys1.throughput).toBe(0);
});