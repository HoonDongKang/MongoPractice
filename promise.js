const addSum = (a, b) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== 'number' || typeof b !== 'number') {
        reject('a,b must be numbers')
      }
      resolve(a + b)
    }, 3000)
  })
const subtract = (a, b) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== 'number' || typeof b !== 'number') {
        reject('a,b must be numbers')
      }
      resolve(a - b)
    }, 3000)
  })

console.time('promise all')
Promise.all([addSum(1, 2), subtract(3, 1)])
  .then(([add, subtract]) => {
    console.log(`add: ${add}, sbutract: ${subtract}`)
  })
  .catch((err) => console.error(err))
console.timeEnd('promise all')

console.time('promise then catch')
addSum(1, 2)
  .then((sum) => console.log({ sum }))
  .catch((error) => console.error({ error }))
subtract(3, 1)
  .then((subtract) => console.log({ subtract }))
  .catch((error) => console.error({ error }))
console.timeEnd('promise then catch')

console.time('promise async await')
;async () => {
  const add = await addSum(1, 2)
  const subtract = await subtract(3, 1)
  console.log({ add, subtract })
}
console.timeEnd('promise async await')

// const totalSum = async () => {
//   let sum = await addSum(10, 10)
//   console.log(sum)
// }

// totalSum()
