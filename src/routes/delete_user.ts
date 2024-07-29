import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../lib/prisma";

export async function deleteUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/persons/:id', {
      schema: {
        params: z.object({
          id: z.string()
        })
      }
    }, async (request, reply) => {

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

      await prisma.person.delete({
        where: {
          id: user.id
        }
      })

      return reply.status(204).send();
    })
}

