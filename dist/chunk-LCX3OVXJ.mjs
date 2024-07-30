import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/delete_user.ts
import { z } from "zod";
async function deleteUser(app) {
  app.withTypeProvider().delete("/persons/:id", {
    schema: {
      summary: "Delete user",
      tags: ["User"],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const user = await prisma.person.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!user) {
      throw new BadRequest("Usu\xE1rio n\xE3o existe");
    }
    await prisma.person.delete({
      where: {
        id: user.id
      }
    });
    return reply.status(204).send();
  });
}

export {
  deleteUser
};
