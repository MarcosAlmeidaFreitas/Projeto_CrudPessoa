import { FastifyInstance } from "fastify";
import { verifyFormatCPF } from "../util/CPF"
import { maskPhone } from "../util/Phone"
import { z } from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../lib/prisma"

export async function createUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/persons', {
      schema: {
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
            name: z.string()
          })
        }
      }
    }, async (request, reply) => {

      const data = request.body;

      const testCPF = await prisma.person.findUnique({
        where: {
          cpf: data.cpf
        }
      });

      if (testCPF === null) {
        if (verifyFormatCPF(data.cpf) !== null) {
          data.cpf = String(verifyFormatCPF(data.cpf));
        } else {
          throw new Error("Digite um CPF válido");
        }
      } else {
        throw new Error("CPF já cadastrado");
      }

      const person = await prisma.person.create({
        data: {
          name: data.name,
          cpf: data.cpf,
          email: data.email,
          phone: maskPhone(data.phone),
          image: data.image,
          dateBirth: new Date(data.dateBirth),
          address: {
            create: data.address
          }
        }
      })

      return reply.status(201).send({ name: person.name });
    })
}

