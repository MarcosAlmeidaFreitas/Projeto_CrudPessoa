import {
  verifyFormatCPF
} from "./chunk-YL2OXIAN.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get_users.ts
import { z } from "zod";
async function getUsers(app) {
  app.withTypeProvider().get("/getUsers", {
    schema: {
      summary: "Get users",
      tags: ["User"],
      querystring: z.object({
        query: z.string().optional(),
        pageIndex: z.string().optional()
      }),
      response: {
        200: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            cpf: z.string(),
            email: z.string(),
            phone: z.string(),
            image: z.string().nullable(),
            dateBirth: z.date(),
            createdAt: z.date()
          })
        )
      }
    }
  }, async (request, reply) => {
    const { query, pageIndex } = request.query;
    let page = Number(pageIndex ?? 0);
    let listUsers;
    if (!query) {
      listUsers = await prisma.person.findMany({
        take: 10,
        skip: page * 10,
        orderBy: {
          name: "asc"
        }
      });
    } else {
      listUsers = await prisma.person.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query
              }
            },
            {
              cpf: {
                contains: verifyFormatCPF(query)
              }
            }
          ]
        },
        take: 10,
        skip: page * 10,
        orderBy: {
          name: "asc"
        }
      });
    }
    reply.status(200).send(listUsers);
  });
}

export {
  getUsers
};
