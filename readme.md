# Overview
The premise behind the library is to be able to make retry calls with minimal fuss using native promises. The library will retry with increasing timeouts until your max timeout is reached and then the maximum number of attempts is also reached.

## Usage
When creating a retry, it will take a function that you wish to retry, and optional parameters and then a function will be returned to you. Once you are ready to execute you can invoke the function and the retry will begin.

The basic usage is that we should be able to make a simple retry

```
const retry = require('easy-retry-promise-native')

const myFunction = () => {
  // do something
  return Promise.resolve('yay')
}

retry(myFunction)()
  .then((result) => {
    console.log(result)
  })
```

### Options
There are a few options that can be set

| name	| type	| default	| description |
|-------|-------|---------|-------------|
| maxAttemtps	| int	| 3	| the maximum number of attempts that the library will make |
| minTimeout	| int	| 100	| The smallest amount of time a delay will occur between attempts |
| maxTimeout	| int	| 1000	| The max amount of time a delay will occur between attempts |

`NOTE: you can set the maxAttempts to either 'inf' or 'infinite' to have it retry forever`

you can pass options as an object when creating the retry 

```
const func = retry(myFunction, { maxAttempts: 10 })
func()
```
