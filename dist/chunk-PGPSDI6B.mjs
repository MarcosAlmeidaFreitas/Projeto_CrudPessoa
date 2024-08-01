import {
  verifyFormatCPF
} from "./chunk-YL2OXIAN.mjs";
import {
  maskPhone
} from "./chunk-AYH3EIG7.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create_user.ts
import { z } from "zod";
async function createUser(app) {
  app.withTypeProvider().post("/persons", {
    schema: {
      summary: "create user",
      tags: ["User"],
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
          country: z.string()
        })
      }),
      response: {
        201: z.object({
          id: z.number()
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
        throw new BadRequest("Digite um CPF v\xE1lido");
      }
    } else {
      throw new BadRequest("CPF j\xE1 cadastrado");
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
    });
    return reply.status(201).send({ id: person.id });
  });
}

export {
  createUser
};
