export function maskPhone(number : string){
  number = number.replace(/\D/g,""); //Remove tudo o que não é dígito
    number = number.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    number = number.replace(/(\d)(\d{4})$/,"$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return number;
}

console.log(maskPhone("229888090282"));