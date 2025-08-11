######################################
# STAGE 1: DEVELOPMENT
# Prepara dependencias completas para desarrollo local y construcción
######################################
FROM node:22-alpine AS development

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos esenciales para la instalación de dependencias
COPY --chown=node:node package.json ./

# Instala TODAS las dependencias (incluidas las de desarrollo)
RUN yarn install

# Copia el resto del código fuente al contenedor
COPY --chown=node:node . .

# Usa el usuario node (ya incluido en la imagen base) para mayor seguridad
USER node

######################################
# STAGE 2: BUILD
# Genera Prisma Client y compila el proyecto Next.js
######################################
FROM node:22-alpine AS build

# Algunas librerías nativas como Prisma Client requieren libc6-compat
RUN apk add --no-cache libc6-compat

# Establece el directorio de trabajo
WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npx prisma generate

# Compila la aplicación Next.js
RUN yarn build

# Elimina dependencias para desarrollo
RUN rm -rf node_modules

# Reinstala solo dependencias de producción y limpia cache
RUN yarn install --production && yarn cache clean

# Cambia a usuario no privilegiado
USER node

######################################
# STAGE 3: PRODUCTION
# Imagen final mínima, solo con lo necesario para correr la app
######################################
FROM node:22-alpine AS production

# Establece el directorio de ejecución
WORKDIR /usr/src/app

# Copia node_modules, código compilado y package.json desde la etapa build
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/.next ./.next
COPY --chown=node:node --from=build /usr/src/app/public ./public
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

COPY --chown=node:node docker-entrypoint.sh /usr/src/app/
RUN chmod +x /usr/src/app/docker-entrypoint.sh



# Usa el usuario "node" para ejecutar la aplicación (seguridad)
USER node

# Comando por defecto para ejecutar la app Next.js en modo producción
# ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]
CMD ["/usr/src/app/docker-entrypoint.sh"]
