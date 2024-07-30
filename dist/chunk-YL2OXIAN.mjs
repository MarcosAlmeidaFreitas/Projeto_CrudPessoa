// src/util/CPF.ts
import { cpf } from "cpf-cnpj-validator";
function verifyFormatCPF(content) {
  const retorno = cpf.isValid(content);
  if (retorno === true) {
    return cpf.format(content);
  }
}

export {
  verifyFormatCPF
};
