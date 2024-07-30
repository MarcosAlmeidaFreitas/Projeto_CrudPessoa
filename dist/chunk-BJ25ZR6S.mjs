import {
  createPDF
} from "./chunk-RY2YHED3.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get_descriptionUserPDF.ts
import { z } from "zod";
async function descriptionUserPDF(app) {
  app.withTypeProvider().get("/save/:id", {
    schema: {
      summary: "Save user information in PDF",
      tags: ["User"],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    const { id } = request.params;
    if (!id) {
      throw new BadRequest("O id \xE9 necess\xE1rio");
    }
    const user = await prisma.person.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!user) {
      throw new BadRequest("Usu\xE1rio n\xE3o encontrado");
    }
    await createPDF(Number(id)).then(
      await reply.sendFile("output.pdf")
    );
  });
}

export {
  descriptionUserPDF
};
