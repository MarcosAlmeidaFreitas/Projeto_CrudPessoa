import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createPDF } from "../util/Pdf";


export async function descriptionUserPDF(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>()
    .get("/save/:id", {
      schema: {
        params: z.object({
          id: z.string()
        })
      }
    }, async (request, reply) => {
      const { id } = request.params;
      await createPDF(Number(id)).then(
        await reply.sendFile('output.pdf')
      );
    });
}