import filterOut from "./Constants/filterOut"

export const sanitizeData = (array) => {
  let lower = array.map((word) => word.toLowerCase())
  console.log("initial values")
  console.log(lower)
  let res = lower.filter((item) => !filterOut.includes(item))
  console.log(res)
  return res
}
