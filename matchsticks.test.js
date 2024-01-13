const { Step } = require('./matchsticks.js');

test('expect Step class to exist with defaults', () => {
    const step1 = new Step();

    expect(step1).toBeDefined();
    expect(step1.processed).toBe(0);
    expect(step1.velocity).toBe(1);
    expect(step1.previousStep).toBe(null);
    expect(step1.tick).toBeDefined();
    
    const step2 = new Step(2);
    expect(step2.velocity).toBe(2);
    
    const step3 = new Step("string"); // bad initial value should force velocity to 1
    expect(step3.velocity).toBe(1);
    
    const step4 = new Step(2.5); // bad initial value should force velocity to 1
    expect(step4.velocity).toBe(1);
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