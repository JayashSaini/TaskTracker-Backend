import { Model, DataTypes } from "sequelize";
import bcryptjs from "bcryptjs";
import { sequelize } from "../db/index.js";

interface UserInstance extends Model {
  id: number;
  username: string;
  password: string;
  email: string;
  role: "USER" | "ADMIN";
  accessToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const User = sequelize.define<UserInstance>(
  "User",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    },
    accessToken: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: async (user: UserInstance) => {
        if (user.changed("password")) {
          const hashedPassword = await bcryptjs.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
    },
  }
);

export default User;
