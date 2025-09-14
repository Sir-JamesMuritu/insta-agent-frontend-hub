"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
exports.chooseCharacter = chooseCharacter;
exports.initAgent = initAgent;
const generative_ai_1 = require("@google/generative-ai");
const logger_1 = __importDefault(require("../config/logger"));
const secret_1 = require("../secret");
const utils_1 = require("../utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readlineSync = __importStar(require("readline-sync"));
async function runAgent(schema, prompt) {
    let currentApiKeyIndex = 0;
    let geminiApiKey = secret_1.geminiApiKeys[currentApiKeyIndex];
    if (!geminiApiKey) {
        logger_1.default.error("No Gemini API key available.");
        return "No API key available.";
    }
    const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema,
    };
    const googleAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
    const model = googleAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig,
    });
    try {
        const result = await model.generateContent(prompt);
        if (!result || !result.response) {
            logger_1.default.info("No response received from the AI model. || Service Unavailable");
            return "Service unavailable!";
        }
        const responseText = result.response.text();
        const data = JSON.parse(responseText);
        return data;
    }
    catch (error) {
        await (0, utils_1.handleError)(error, currentApiKeyIndex, schema, prompt, runAgent);
    }
}
function chooseCharacter() {
    const charactersDir = (() => {
        const buildPath = path_1.default.join(__dirname, "characters");
        if (fs_1.default.existsSync(buildPath)) {
            return buildPath;
        }
        else {
            // Fallback to source directory
            return path_1.default.join(process.cwd(), "src", "Agent", "characters");
        }
    })();
    const files = fs_1.default.readdirSync(charactersDir);
    const jsonFiles = files.filter(file => file.endsWith(".json"));
    if (jsonFiles.length === 0) {
        throw new Error("No character JSON files found");
    }
    console.log("Select a character:");
    jsonFiles.forEach((file, index) => {
        console.log(`${index + 1}: ${file}`);
    });
    const answer = readlineSync.question("Enter the number of your choice: ");
    const selection = parseInt(answer);
    if (isNaN(selection) || selection < 1 || selection > jsonFiles.length) {
        throw new Error("Invalid selection");
    }
    const chosenFile = path_1.default.join(charactersDir, jsonFiles[selection - 1]);
    const data = fs_1.default.readFileSync(chosenFile, "utf8");
    const characterConfig = JSON.parse(data);
    return characterConfig;
}
function initAgent() {
    try {
        const character = chooseCharacter();
        console.log("Character selected:", character);
        return character;
    }
    catch (error) {
        console.error("Error selecting character:", error);
        process.exit(1);
    }
}
if (require.main === module) {
    (() => {
        initAgent();
    })();
}
