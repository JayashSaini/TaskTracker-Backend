import { DataTypes } from "sequelize";
import { sequelize } from "../../db/mysql.js";
import User from "./user.models.js";

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "No description",
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED, // Ensure this matches the User model's id type
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

// Update the association
User.hasOne(Todo, { foreignKey: "userId" });
Todo.belongsTo(User, { foreignKey: "userId" });

export default Todo;
