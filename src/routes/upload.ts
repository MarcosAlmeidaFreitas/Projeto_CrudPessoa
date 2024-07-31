import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";
import util from "node:util"
import { pipeline } from "node:stream";
import { createWriteStream } from "fs";
import path from "path";

export async function upload( app : FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .post("/upload-image/:id", {
    schema:{
      summary: "Update Imagem",
        tags: ['User'],
      params: z.object({
        id: z.string()
      }),
      response: {
        200: z.object({
          message: z.string()
        })
      },
    }
  },  async (request, reply) => {
    const { id } = request.params;
    const data = await request.file(); 
    if(!data){
      throw new BadRequest("Erro, arquivo não selecionado")
    }
    const pump = util.promisify(pipeline)
    try{
      const filePath = path.resolve("public", "upload", "images", `${data.filename}`)
      await pump(data.file, createWriteStream(filePath));
      
      const location = await prisma.person.findUnique({
        where:{
          id: Number(id)
        }
      });
      
      if(!location){
        throw new BadRequest("Usuário não encontrado")
      }

      await prisma.person.update({
        where: {
          id: Number(id)
        },
        data:{
          image: filePath
        }
      })

      return reply.code(200).send({message: "Imagem carregada com sucesso"});
    }catch(erro){
      console.log(erro);
    }
  });
}