import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod"
import {createUser} from "./routes/create_user"
import { updateUser } from "./routes/update_user";
import { deleteUser } from "./routes/delete_user";
import { getUser } from "./routes/get_user";
import { descriptionUserPDF } from "./routes/get_descriptionUserPDF"
import { getUsers } from "./routes/get_users";
import path from "path";
import fastifyStatic from "@fastify/static";
import { errorHandler } from "./util/error-handler";
import multipart from '@fastify/multipart'

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI, { fastifySwaggerUi } from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { upload } from "./routes/upload";


const app = fastify();

app.register(fastifyCors, {
  origin: '*',
})

//configurando o swagger para a documentação
app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['aplication/json'],
    info:{
      title: "Cadastro de Pessoas",
      description: `Aplicação com o objetivo de gerir dados 
                    pessoais e endereço`,
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform,
});

//registrando o multipart para trabalhar com imagens.
app.register(multipart)

//registrando a rota de documentação
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//mostrando a onde vai ficar a pasta para a criação do arquivo pdf
app.register(fastifyStatic, {
  root: path.join(__dirname, 'util/temp'),
})

app.register(createUser);
app.register(updateUser);
app.register(deleteUser);
app.register(getUser);
app.register(getUsers);
app.register(descriptionUserPDF);
app.register(upload)

//classe de tratamento de error que está dentro utils
app.setErrorHandler(errorHandler);

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP SERVER RUNNING');
})
