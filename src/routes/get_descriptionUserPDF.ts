import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createPDF } from "../util/Pdf";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";


export async function descriptionUserPDF(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>()
    .get("/save/:id", {
      schema: {
        summary: "Save user information in PDF",
        tags: ['User'],
        params: z.object({
          id: z.string()
        })
      }
    }, async (request, reply) => {
      const { id } = request.params;
      
      if(!id){
        throw new BadRequest("O id é necessário")
      }

      const user = await prisma.person.findUnique({
        where:{
          id: Number(id)
        }
      });

      if(!user){
        throw new BadRequest("Usuário não encontrado");
      }  
      
      await createPDF(Number(id)).then(
        await reply.sendFile('output.pdf')
      );
    });
}