const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

const main = async () => {
  try {
    await database.category.createMany({
      data: [
        { name: "Software Development" },
        { name: "Data Science" },
        { name: "Design" },
        { name: "Marketing" },
        { name: "Sales" },
        { name: "Finance" },
        { name: "Human Resources" },
        { name: "Project Management" },
        { name: "Content Creation" },
        { name: "Cybersecurity" },
        { name: "Cloud Computing" },
        { name: "Artificial Intelligence" },
        { name: "Blockchain" },
        { name: "Mobile Development" },
        { name: "Game Development" },
        { name: "DevOps" },
        { name: "Business Analysis" },
        { name: "Legal" },
        { name: "Healthcare" },
        { name: "Education" },
        { name: "Consulting" },
        { name: "Real Estate" },
      ],
    });
    console.log("Success");
  } catch (error) {
    console.error(`Error while seeding the database: ${error}`);
  }
};
main();
