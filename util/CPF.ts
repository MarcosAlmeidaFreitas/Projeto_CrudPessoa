import { cpf } from 'cpf-cnpj-validator';

export function verifyFormatCPF( content : string ){
  const retorno = cpf.isValid(content);
  if(retorno === true){
    return cpf.format(content);
  }else{
    console.log('Digite um CPF Válido'); 
  }
}

