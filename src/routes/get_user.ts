import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../lib/prisma";

export async function getUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/persons/:id', {
      schema: {
        params: z.object({
          id: z.string()
        }),
        response: {
          200: z.object({
            name: z.string(),
            cpf: z.string(),
            email: z.string().email(),
            phone: z.string(),
            image: z.string().nullable(),
            dateBirth: z.string().date(),
            address: z.object({
              street: z.string(),
              number: z.string(),
              district: z.string(),
              complement: z.string(),
              CEP: z.string(),
              city: z.string(),
              state: z.string(),
              country: z.string(),
            })
          })
        }
      }
    }, async (request, reply) => {

      const { id } = request.params as {
        id: string
      }

      const user = await prisma.person.findUnique({
        where: {
          id: Number(id)
        }, include: {
          address: true
        }
      });

      if (!user) {
        throw new Error("Usuário não existe");
      }

      return reply.status(200).send(user);
    })
}

