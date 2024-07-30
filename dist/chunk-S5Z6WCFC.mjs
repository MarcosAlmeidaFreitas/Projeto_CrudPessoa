import {
  maskPhone
} from "./chunk-AYH3EIG7.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/update_user.ts
import { z } from "zod";
async function updateUser(app) {
  app.withTypeProvider().put("/persons/:id", {
    schema: {
      summary: "Upload user",
      tags: ["User"],
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
          country: z.string()
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
    const { id } = request.params;
    const user = await prisma.person.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!user) {
      throw new BadRequest("Usu\xE1rio n\xE3o existe");
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
    });
    return reply.status(201).send({ userId: userUpdate.id });
  });
}

export {
  updateUser
};
