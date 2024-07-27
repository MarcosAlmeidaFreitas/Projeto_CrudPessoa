import fastify from "fastify";
import { z } from "zod";
import { PrismaClient  } from "@prisma/client"

const prisma = new PrismaClient({
  log: ['query']
})

const app = fastify();

app.post('/persons', (request, reply) => {
  const createEventSchema = z.object({
    name: z.string(),
    cpf: z.string(), 
    email: z.string().email(), 
    image: z.string(),
  });
  
  const data = createEventSchema.parse(request.body);
  return 'hello nwl unite';
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP SERVER RUNNING');
})




