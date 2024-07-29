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
    }, (request, reply) => {
      const { id } = request.params;
      createPDF(Number(id));
    });
}