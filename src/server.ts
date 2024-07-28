import fastify from "fastify";
import { z } from "zod";
import { serializerCompiler, validatorCompiler, ZodTypeProvider} from "fastify-type-provider-zod"
import { PrismaClient } from "@prisma/client"
import { verifyFormatCPF } from "../util/CPF"
import { maskPhone } from "../util/Phone"

const prisma = new PrismaClient({
  log: ['query']
})


const app = fastify();

app.post('/persons', async (request, reply) => {
  const createPersonSchema = z.object({
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
  });

  const data = createPersonSchema.parse(request.body);
  
  const testCPF = await prisma.person.findUnique({
    where: {
      cpf: data.cpf
    }
  });

  if(testCPF !== null){
    throw new Error("CPF já cadastrado.")
  }else{ 
    if(verifyFormatCPF(data.cpf) !== null){
      data.cpf = String(verifyFormatCPF(data.cpf));
    }else{
      throw new Error("Digite um CPF válido")
    }
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

  return reply.status(201).send({ personId: person.id });
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP SERVER RUNNING');
})
