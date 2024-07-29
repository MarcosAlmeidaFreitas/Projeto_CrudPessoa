import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../lib/prisma";

export async function getUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .get("/getUsers", {
      schema: {
        querystring: z.object({
          query: z.string()
        })
      }
    }, async (request, reply) => {
      const { query } = request.query;

      const listUsers = await prisma.person.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query
              }
            },
            {
              cpf: {
                contains: query
              }
            }
          ]
        }
      }
      );

      reply.status(200).send(listUsers);
    })
}