const { PrismaClient } = require("@prisma/client");
const posts = require("./posts.js");
const mataKuliahs = require("./mataKuliahs.js");

const prisma = new PrismaClient();

async function main() {
  await posts(prisma);
  await mataKuliahs(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
