'use strict'

const retry = require('../src').retry
jest.useFakeTimers();

describe('retry promises', () => {
  it('should pass working conditions', () => {
    const op = () => { return Promise.resolve({ message: 'success' }) }
    
    return retry(op)()
      .then((result) => {
        expect(result.message).toBe('success')
      })
  })

  it('should fail until max attempts', () => {
    const op = jest.fn(() => { return Promise.reject({ message: 'failure' }) })
    
    return retry(op)()
      .catch((err) => {
        expect(err.message).toBe('failure')
        expect(op).toHaveBeenCalledTimes(3)
      })
  })

  it('should not exceed max timeout', () => {
    const op = jest.fn(() => { 
      return Promise.reject({ message: 'failure' }) 
    })

    jest.runAllTimers()
    return retry(op, { maxTimeout: 100, minTimeout: 200, maxAttempts: 1 })()
      .catch((err) => {
        expect(err.message).toBe('failure')
        expect(op).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
      })
  })


})