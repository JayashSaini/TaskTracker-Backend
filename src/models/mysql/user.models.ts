// Import necessary modules from Sequelize
import { Model, DataTypes, Optional } from "sequelize";
import bcryptjs from "bcryptjs";
import { sequelize } from "../../db/mysql.js"; // Adjust the import path as needed

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  email: string;
  role?: "USER" | "ADMIN";
  accessToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "accessToken"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  // You can define additional custom methods for your model here
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
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
