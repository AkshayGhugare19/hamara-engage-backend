import sequelize from "./db";
import "../modules/user/model/user.model"; // import all models here

const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    // alter: true safely updates schema without dropping data
    await sequelize.sync({ alter: true });
    console.log("✅ All models synced");

    process.exit(0);
  } catch (error) {
    console.error("❌ DB sync failed:", error);
    process.exit(1);
  }
};

syncDb();
