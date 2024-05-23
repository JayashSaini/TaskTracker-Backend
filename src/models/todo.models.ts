import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const Todo = sequelize.define(
  "Todo",
  {
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
  },
  {
    timestamps: true,
  }
);

export default Todo;