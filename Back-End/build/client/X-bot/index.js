"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const schema_1 = __importDefault(require("../../Agent/schema"));
async function canSendTweet() {
    const twentyFourHoursAgo = (0, moment_1.default)().subtract(24, "hours").toDate(); // Get the timestamp of 24 hours ago
    // Check how many tweets were sent in the last 24 hours
    const tweetCount = await schema_1.default.countDocuments({
        timeTweeted: { $gte: twentyFourHoursAgo }, // Tweets sent within the last 24 hours
    });
    if (tweetCount >= 17) {
        console.log("Rate limit reached for the last 24 hours. Cannot send tweet.");
        return false; // Exceeded tweet limit for the last 24 hours
    }
    console.log(`Tweets sent in the last 24 hours: ${tweetCount}. You can send another tweet.`);
    return true; // Can send tweet
}
