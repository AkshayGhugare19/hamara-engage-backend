import User from "../modules/user/model/user.model";
import UserLog from "../modules/user-log/model/user-log.model";
import Campaign from "../modules/campaign/model/campaign.model";
import CampaignAnalytics from "../modules/analytics/model/campaign-analytics.model";
import CampaignHistory from "../modules/analytics/model/campaign-history.model";

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

    // Campaign → Analytics (per-channel metrics)
    Campaign.hasMany(CampaignAnalytics, {
        foreignKey: "campaign_id",
        as: "analytics",
    });
    CampaignAnalytics.belongsTo(Campaign, {
        foreignKey: "campaign_id",
        as: "campaign",
    });

    // Campaign → History (per-player events)
    Campaign.hasMany(CampaignHistory, {
        foreignKey: "campaign_id",
        as: "history",
    });
    CampaignHistory.belongsTo(Campaign, {
        foreignKey: "campaign_id",
        as: "campaign",
    });

    console.log("✅ Associations initialized");
};