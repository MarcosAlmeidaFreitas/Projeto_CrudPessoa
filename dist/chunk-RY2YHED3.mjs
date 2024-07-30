import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";
import {
  __require
} from "./chunk-Y6FXYEAI.mjs";

// src/util/Pdf.ts
import { format } from "date-fns";
async function createPDF(id) {
  const PDFDocument = __require("pdfkit");
  const fs = __require("fs");
  const doc = new PDFDocument();
  await doc.pipe(fs.createWriteStream(__dirname + "/temp/output.pdf"));
  const user = await prisma.person.findUnique({
    where: {
      id
    },
    include: {
      address: true
    }
  });
  if (!user) {
    throw new Error("Usu\xE1rio n\xE3o encontrado!");
  }
  const dataBirth = format(user.dateBirth, "dd/MM/yyy");
  doc.fontSize(18);
  doc.text("Dados Cadastrais", { align: "center" });
  doc.text(`
`);
  doc.fontSize(14);
  doc.text(`Nome: ${user.name}`);
  doc.text(`CPF: ${user.cpf}`);
  doc.text(`Telefone: ${user.phone}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Data de Nascimento: ${dataBirth}`);
  doc.text(`
`);
  doc.fontSize(18);
  doc.text(`Endere\xE7o`, { align: "center" });
  doc.text(`
`);
  doc.fontSize(14);
  doc.text(`Rua: ${user.address?.street}`);
  doc.text(`Numero: ${user.address?.number}`);
  doc.text(`Complemento: ${user.address?.complement}`);
  doc.text(`Bairro: ${user.address?.district}`);
  doc.text(`CEP: ${user.address?.CEP}`);
  doc.text(`Cidade: ${user.address?.city}`);
  doc.text(`Estado: ${user.address?.state}`);
  doc.text(`Pa\xEDs: ${user.address?.country}`);
  doc.end();
}

export {
  createPDF
};
