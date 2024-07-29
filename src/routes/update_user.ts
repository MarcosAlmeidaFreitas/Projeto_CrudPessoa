import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../lib/prisma";
import { maskPhone } from "../util/Phone"
export async function updateUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/persons/:id', {
      schema: {
        params: z.object({
          id: z.string()
        }), 
        body: z.object({
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
        }),
        response: {
          201: z.object({
            userId: z.number()
          })
        }
      }
    }, async (request, reply) => {

      const data = request.body;

      const { id } = request.params as {
        id: string
      }

      const user = await prisma.person.findUnique({
        where: {
          id : Number(id)
        }
      });

      if (!user) {
        throw new Error("Usuário não existe");
      }

      const userUpdate = await prisma.person.update({
        where: {
          id: user.id
        },
        data: {
          name: data.name,
          email: data.email,
          phone: maskPhone(data.phone),
          image: data.image,
          address: {
            update: data.address
          }
        }
      })

      return reply.status(201).send({userId: userUpdate.id});
    })
}

