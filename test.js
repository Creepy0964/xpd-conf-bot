const input = "Пример строки";
const result = input.replace(/./g, "\\$&");
console.log(result);