import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/persons/:id', {
      schema: {
        summary: "Get user",
        tags: ['User'],
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

      if(!id){
        throw new BadRequest("Id inválido")
      }

      const user = await prisma.person.findUnique({
        where: {
          id: Number(id)
        }, //include: {
        //address: true
        //}
      });

      const address = await prisma.address.findUnique({
        where: {
          personId: Number(id)
        }
      })

      if (!user) {
        throw new BadRequest("Usuário não existe");
      }

      if (!address) {
        throw new BadRequest("Endereço não existe");
      }

      console.log(address);
      return reply.status(200).send({ user, address });
    })
}
