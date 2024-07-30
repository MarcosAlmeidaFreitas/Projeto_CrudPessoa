import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get_user.ts
import { z } from "zod";
async function getUser(app) {
  app.withTypeProvider().get("/persons/:id", {
    schema: {
      summary: "Get user",
      tags: ["User"],
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
            createdAt: z.date()
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
        })
        //fecha o objeto
      }
      //fecha o response
    }
    //fecha o schema
  }, async (request, reply) => {
    const { id } = request.params;
    if (!id) {
      throw new BadRequest("Id inv\xE1lido");
    }
    const user = await prisma.person.findUnique({
      where: {
        id: Number(id)
      }
      //include: {
      //address: true
      //}
    });
    const address = await prisma.address.findUnique({
      where: {
        personId: Number(id)
      }
    });
    if (!user) {
      throw new BadRequest("Usu\xE1rio n\xE3o existe");
    }
    if (!address) {
      throw new BadRequest("Endere\xE7o n\xE3o existe");
    }
    console.log(address);
    return reply.status(200).send({ user, address });
  });
}

export {
  getUser
};
