import { Sequelize } from "sequelize";

// const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, defaultdb } = process.env;

const sequelize = new Sequelize({
  dialect: "mysql",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});

async function connectToDatabase(): Promise<void> {
  try {
    // So that every table can be created if doesn't exists
    await sequelize.sync();

    console.log(`\n🚅 defaultdb Database connected`);
  } catch (error: any) {
    console.error(`\nFailed to connect to the defaultdb database:`, error);

    process.exit(1);
  }
}

export { sequelize };
export default connectToDatabase;
