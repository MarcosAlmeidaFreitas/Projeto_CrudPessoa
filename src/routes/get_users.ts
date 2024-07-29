import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function getUsers(app : FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .get("/getUsers/")
}