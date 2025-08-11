const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker")

async function validateImageUrl(url, generate) {
  try {
    const res = await fetch(url);
    if (res.ok) return url;
  } catch (error) { }
  return validateImageUrl(generate(), generate);
}

const load = async () => {

  if ((await prisma.user.count()) > 0) {
    console.log("Database already seeded");
    return;
  }

  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const businessEmailList = [
    "business1@gmail.com",
    "business2@gmail.com",
    "business3@gmail.com",
    "business4@gmail.com",
    "business5@gmail.com",
  ];

  for (const businessEmail of businessEmailList) {
    const email = businessEmail;
    const password = await bcrypt.hash("abcd1234", 10);
    const storeName = faker.company.name();

    // Imagen de usuario
    const userImage = await validateImageUrl(faker.image.personPortrait(), faker.image.personPortrait);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        image: userImage,
        email,
        password,
        roles: ["BUSINESS"],
      },
    });

    // Imagen de tienda
    const storeImage = await validateImageUrl(faker.image.url(), faker.image.url);

    // Crear tienda
    const store = await prisma.store.create({
      data: {
        name: storeName,
        description: faker.company.catchPhrase(),
        image: storeImage,
        businessId: user.id,
      },
    });

    // Crear productos
    for (let j = 0; j < 20; j++) {
      const productImage = await validateImageUrl(faker.image.url(), faker.image.url);
      await prisma.product.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price()),
          image: productImage,
          storeId: store.id,
        },
      });
    }
  }
}

load()