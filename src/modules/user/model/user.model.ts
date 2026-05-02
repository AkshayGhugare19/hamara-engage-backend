import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../../../config/db";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare first_name: string;
  declare last_name: string;
  declare username: CreationOptional<string | null>;
  declare email: string;
  declare mobile: string;
  declare password: string;
  declare role: CreationOptional<"USER" | "ADMIN">;
  declare status: CreationOptional<"ACTIVE" | "INACTIVE">;
  declare readonly created_at: CreationOptional<Date>;
  declare readonly updated_at: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    mobile: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: true,
    created_at: "created_at",
    updated_at: "updated_at",
    // Never return password in JSON responses
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      //@ts-ignore
      withPassword: { attributes: {} },
    },
  }
);

export default User;
