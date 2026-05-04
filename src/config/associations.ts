import User from "../modules/user/model/user.model";
import UserLog from "../modules/user-log/model/user-log.model";

export const initAssociations = () => {

    // User → Logs
    User.hasMany(UserLog, {
        foreignKey: "user_id",
        as: "logs",
    });

    // Log → User
    UserLog.belongsTo(User, {
        foreignKey: "user_id",
        as: "user",
    });

    console.log("✅ Associations initialized");
};