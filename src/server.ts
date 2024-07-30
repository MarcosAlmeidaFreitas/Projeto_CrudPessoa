import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import {createUser} from "./routes/create_user"
import { updateUser } from "./routes/update_user";
import { deleteUser } from "./routes/delete_user";
import { getUser } from "./routes/get_user";
import { descriptionUserPDF } from "./routes/get_descriptionUserPDF"
import { getUsers } from "./routes/get_users";
import path from "path";
import fastifyStatic from "@fastify/static";
import { errorHandler } from "./util/error-handler";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyStatic, {
  root: path.join(__dirname, 'util/temp'),
})

app.register(createUser);
app.register(updateUser);
app.register(deleteUser);
app.register(getUser);
app.register(getUsers);
app.register(descriptionUserPDF);

//classe de error que está dentro utils
app.setErrorHandler(errorHandler);

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP SERVER RUNNING');
})
