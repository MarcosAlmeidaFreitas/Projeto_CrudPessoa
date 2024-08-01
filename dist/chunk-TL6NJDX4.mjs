import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/upload.ts
import z from "zod";
import util from "util";
import { pipeline } from "stream";
import { createWriteStream } from "fs";
import path from "path";
async function upload(app) {
  app.withTypeProvider().post("/upload-image/:id", {
    schema: {
      summary: "Update Imagem",
      tags: ["User"],
      params: z.object({
        id: z.string()
      }),
      response: {
        200: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const data = await request.file();
    if (!data) {
      throw new BadRequest("Erro, arquivo n\xE3o selecionado");
    }
    const pump = util.promisify(pipeline);
    try {
      const filePath = path.resolve("public", "upload", "images", `${data.filename}`);
      await pump(data.file, createWriteStream(filePath));
      const location = await prisma.person.findUnique({
        where: {
          id: Number(id)
        }
      });
      if (!location) {
        throw new BadRequest("Usu\xE1rio n\xE3o encontrado");
      }
      await prisma.person.update({
        where: {
          id: Number(id)
        },
        data: {
          image: filePath
        }
      });
      return reply.code(200).send({ message: "Imagem carregada com sucesso" });
    } catch (erro) {
      console.log(erro);
    }
  });
}

export {
  upload
};
