"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../Agent/schema"));
const client_1 = require("../client/X-bot/client");
const utils_1 = require("../utils");
const download_1 = require("../utils/download");
const tweets_1 = require("./tweets");
const SendtweetWithImage = async () => {
    const canSend = await (0, utils_1.canSendTweet)();
    if (!canSend)
        return; // If we cannot send tweet, exit the function
    const urls = [
        "https://th.bing.com/th/id/R.ae6f69f96681689598d25c19fb2f6b8c?rik=pep5uJzjHTlqxQ&pid=ImgRaw&r=0",
    ];
    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];
    const uri = randomUrl;
    const filename = "image.png";
    // Retry logic for downloading and sending tweet with image
    (0, download_1.download)(uri, filename, async function () {
        try {
            // Retry logic for image upload
            const mediaId = await client_1.twitterClient.v1.uploadMedia("./image.png");
            const tweetText = tweets_1.excitingTweets[Math.floor(Math.random() * tweets_1.excitingTweets.length)];
            // Retry logic for tweeting
            const send = await client_1.twitterClient.v2.tweet({
                text: tweetText,
                media: {
                    media_ids: [mediaId],
                },
            });
            // Store tweet data in the database
            const newTweet = new schema_1.default({
                tweetContent: tweetText,
                imageUrl: uri,
                timeTweeted: new Date(),
            });
            await newTweet.save();
            console.log("Tweeted: ", tweetText);
            console.log("Tweeted Data: ", send);
        }
        catch (e) {
            console.error("Error tweeting:", e);
        }
    });
};
