const retry = require('../src/retry')

jest.useFakeTimers()

describe('retry', () => {
  it('should acknowledge infinite', () => {
    expect(retry.isInfinite('inf')).toBe(true)
    expect(retry.isInfinite('infinite')).toBe(true)
    expect(retry.isInfinite(5)).toBe(false)
  })

  it('should delay', () => {
    retry.delay(100)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100)
  })

  it('should calculate the next duration', () => {
    const options = {
      minTimeout: 100,
      factor: 2,
      attempts: 2, 
      maxTimeout: 1000
    }
    
    expect(retry.calculateDuration(options)).toBe(400)

    options.attempts = 5
    expect(retry.calculateDuration(options)).toBe(1000)
  })
})