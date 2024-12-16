import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing users to avoid duplicates
  await prisma.user.deleteMany();

  // Create initial users
  const users = await prisma.user.createMany({
    data: [
      {
        email: "john.doe@example.com",
        name: "John Doe",
      },
      {
        email: "jane.smith@example.com",
        name: "Jane Smith",
      },
      {
        email: "bob.johnson@example.com",
        name: "Bob Johnson",
      },
    ],
  });

  console.log("Seeded 3 users");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
