const SooronbaiPromise = require('./promise');

describe('Sooronbai Promise', () => {

    let promise;
    let executorSpy;

    const successResult = 42;
    const errorResult = 'i ma error';

    beforeEach(() => {
        executorSpy = jest.fn(resolve => setTimeout(() => resolve(successResult), 150));
        promise = new SooronbaiPromise(executorSpy);
    });

    test('should exists and to be type of function', () => {
        expect(SooronbaiPromise).toBeDefined();
        expect(typeof SooronbaiPromise).toBe('function');
    });

    test('instance should have methods: then, catch, finally', () => {
        expect(promise.then).toBeDefined();
        expect(promise.catch).toBeDefined();
        expect(promise.finally).not.toBeUndefined();
    });

    test('should call executor function', () => {
        expect(executorSpy).toHaveBeenCalled();
    });

    test('should get data from then block and chain them', async () => {
        const result = await promise.then(data => data).then(data => data * 2);
        expect(result).toBe(successResult * 2);
    });

    test('should catch error', () => {
        const errorExecutor = (_, reject) => setTimeout(() => reject(errorResult), 150);
        const errorPromise = new SooronbaiPromise(errorExecutor);

        return new Promise(resolve => {
            errorPromise.catch(error => {
                expect(error).toBe(errorResult);
                resolve();
            })
        });
    });

    test('should call finally method', async () => {
        const finallySpy = jest.fn(() => {
        });
        await promise.finally(finallySpy);

        expect(finallySpy).toHaveBeenCalled();
    });
});