import prisma from "../src/prismaClient";
import bcrypt from "bcrypt";

async function main() {
  const salt = 10;
  const adminPassword = await bcrypt.hash("Admin123!", salt);
  const trainerPassword = await bcrypt.hash("Trainer123!", salt);

  // upsert admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN"
    }
  });

  // upsert trainer
  const trainer = await prisma.user.upsert({
    where: { email: "trainer@example.com" },
    update: {},
    create: {
      email: "trainer@example.com",
      password: trainerPassword,
      name: "Trainer User",
      role: "TRAINER"
    }
  });

  console.log("Seed complete:", { adminId: admin.id, trainerId: trainer.id });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
