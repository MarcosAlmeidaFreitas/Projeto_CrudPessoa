import {
  errorHandler
} from "./chunk-NUBWJW2M.mjs";
import {
  createUser
} from "./chunk-V6MIEFLM.mjs";
import {
  deleteUser
} from "./chunk-LCX3OVXJ.mjs";
import {
  descriptionUserPDF
} from "./chunk-BJ25ZR6S.mjs";
import "./chunk-RY2YHED3.mjs";
import {
  getUser
} from "./chunk-UUL3NYWS.mjs";
import {
  getUsers
} from "./chunk-A456AA6K.mjs";
import "./chunk-YL2OXIAN.mjs";
import {
  updateUser
} from "./chunk-S5Z6WCFC.mjs";
import "./chunk-AYH3EIG7.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-JV6GRE7Y.mjs";
import "./chunk-Y6FXYEAI.mjs";

// src/server.ts
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import path from "path";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["aplication/json"],
    info: {
      title: "Cadastro de Pessoas",
      description: `Aplica\xE7\xE3o com o objetivo de gerir dados 
                    pessoais e endere\xE7o`,
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyStatic, {
  root: path.join(__dirname, "util/temp")
});
app.register(createUser);
app.register(updateUser);
app.register(deleteUser);
app.register(getUser);
app.register(getUsers);
app.register(descriptionUserPDF);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP SERVER RUNNING");
});
