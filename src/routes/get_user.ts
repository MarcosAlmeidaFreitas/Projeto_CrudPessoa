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
            user: z.object({
              id: z.number(),
              name: z.string(),
              cpf: z.string(),
              email: z.string(),
              phone: z.string(),
              image: z.string().nullable(),
              dateBirth: z.date(),
              createdAt: z.date(),
            }),

            address: z.object({
              id: z.number().int(),
              street: z.string(),
              number: z.string(),
              district: z.string(),
              complement: z.string(),
              CEP: z.string(),
              city: z.string(),
              state: z.string(),
              country: z.string(),
              personId: z.number().int()
            })
          })//fecha o objeto
        }//fecha o response
      }//fecha o schema
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

      const address = await prisma.address.findUnique({
        where: {
          personId: Number(id)
        }
      })

      if (!user) {
        throw new Error("Usuário não existe");
      }
      
      if (!address) {
        throw new Error("Usuário não existe");
      }

      console.log(address);
      return reply.status(200).send({ user, address });
})}
