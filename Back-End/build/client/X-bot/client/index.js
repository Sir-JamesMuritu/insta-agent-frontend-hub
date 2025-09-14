"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterBearer = exports.twitterClient = void 0;
const twitter_api_v2_1 = __importDefault(require("twitter-api-v2"));
const secret_1 = require("../../../secret");
// Instantiate a new Twitter API client
const client = new twitter_api_v2_1.default({
    appKey: secret_1.TWITTER_API_CREDENTIALS.appKey,
    appSecret: secret_1.TWITTER_API_CREDENTIALS.appSecret,
    accessToken: secret_1.TWITTER_API_CREDENTIALS.accessToken,
    accessSecret: secret_1.TWITTER_API_CREDENTIALS.accessTokenSecret,
});
const bearer = new twitter_api_v2_1.default(secret_1.TWITTER_API_CREDENTIALS.bearerToken);
exports.twitterClient = client.readWrite;
exports.twitterBearer = bearer.readOnly;
