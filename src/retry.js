'use strict'

const createDefaults = (options) => {
  const defaults = {
    attempts: 0,
    maxAttempts: 3,
    minTimeout: 100,
    maxTimeout: 1000,
    factor: 2
  }

  return {...defaults, ...options}
}

const calculateDuration = (options) => {
  const nextTimeout =  Math.min(options.minTimeout * Math.pow(options.factor, options.attempts), options.maxTimeout)
  return nextTimeout > options.maxTimeout ? options.maxTimeout : nextTimeout
}

const delay = (time, val) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve.bind(null, val), time)
  });
}

const isInfinite = (attempts) => {
  if (typeof attempts === 'string') {
    const la = attempts.toLowerCase()
    return (la === 'inf' || la === 'infinite')
  }
  return false
}

const attempt = (operation, options) => {
  const mutOptions = { ...options }
  return function() {
    const args = Array.from(arguments)

    return operation.apply(null, args)
      .then((result) => { return Promise.resolve(result) })
      .catch((err) => {
        if (isInfinite(mutOptions.maxAttempts) || mutOptions.attempts < mutOptions.maxAttempts -1) {
          const delayTimeout = calculateDuration(mutOptions) 

          if (!isInfinite(mutOptions.maxAttempts) && delayTimeout <= mutOptions.maxTimeout) {
            // stop increasing the attempts, its wasting computational logic
            mutOptions.attempts++
          }
        
          return delay(delayTimeout).then(() => { return attempt(operation, mutOptions)(...arguments) })
        }
       
        return Promise.reject(err)
      })
  }
}

/**
 * The retry mechanism that will return a native promise at the end of it all, 
 * you can set the maxAttempts, timeout, maxTimeout and factor () the increase 
 * in time between attempts
 * @param {*} operation - the function that you want to attempt
 * @param {*} options - the object containing the options for the retry
 */
const retry  = (operation, options) => {
  const retryOptions = createDefaults(options)
  return attempt(operation, retryOptions)
} 

module.exports = {
  retry,
  calculateDuration,
  delay,
  isInfinite
}

