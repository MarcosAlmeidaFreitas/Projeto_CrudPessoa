import { prisma } from "../lib/prisma";
import { format } from "date-fns"

export async function createPDF(id : number) {
  const PDFDocument = require('pdfkit');
  const fs = require('fs');

  // Create a document
  const doc = new PDFDocument();

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  await doc.pipe(fs.createWriteStream(__dirname + '/temp/output.pdf'));

  const user = await prisma.person.findUnique({
    where: {
      id
    },
    include:{
      address: true
    }
  });
  
  if(!user){
    throw new Error("Usuário não encontrado!");
  }

  const dataBirth = format(user.dateBirth, "dd/MM/yyy");
  doc.fontSize(18);
  doc.text("Dados Cadastrais", {align: 'center'});
  doc.text(`\n`);
  doc.fontSize(14);
  doc.text(`Nome: ${user.name}`);
  doc.text(`CPF: ${user.cpf}`);
  doc.text(`Telefone: ${user.phone}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Data de Nascimento: ${dataBirth}`);
  doc.text(`\n`);
  doc.fontSize(18);
  doc.text(`Endereço`, {align: 'center'});
  doc.text(`\n`);
  doc.fontSize(14);
  doc.text(`Rua: ${user.address?.street}`);
  doc.text(`Numero: ${user.address?.number}`);
  doc.text(`Complemento: ${user.address?.complement}`);
  doc.text(`Bairro: ${user.address?.district}`);
  doc.text(`CEP: ${user.address?.CEP}`);
  doc.text(`Cidade: ${user.address?.city}`);
  doc.text(`Estado: ${user.address?.state}`);
  doc.text(`País: ${user.address?.country}`);
  
  // Finalize PDF file
  doc.end();
}