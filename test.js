const input = "тест_";
const result = input.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")
console.log(result);