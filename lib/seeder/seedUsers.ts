import { auth } from "../auth";

async function seedUsers() {
  const faydaIds = ["FYD001234567", "FYD001234568", "FYD001234569"];

  const password = "demo123seed";

  for (const faydaId of faydaIds) {
    const email = `${faydaId}@fayda.gov.et`.toLowerCase();

    try {
      await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: `Citizen ${faydaId.slice(-3)}`,
          role: "user",
          fayda_id: faydaId,
        },
      });

      console.log(`✅ Created user: ${email}`);
    } catch (err) {
      if (err.code === "user_already_exists") {
        console.log(`⚠️ User already exists: ${email}`);
      } else {
        console.error(`❌ Error creating user ${email}:`, err);
      }
    }
  }
  await auth.api.signUpEmail({
    body: {
      email: "FYD001234572@fayda.gov.et".toLocaleLowerCase(),
      password,
      name: `Admin`,
      role: "admin",

      fayda_id: "FYD001234572",
    },
  });
}

seedUsers().then(() => {
  console.log("✅ Done seeding Fayda users");
  process.exit(0);
});
