"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("../config/logger"));
const Instagram_1 = require("../client/Instagram");
const router = express_1.default.Router();
let agentStatus = {
    isRunning: false,
    agentId: null,
    startTime: null,
    lastActivity: null
};
// Get available agents
router.get('/list', (_req, res) => {
    const agents = [
        {
            id: 'content-creator',
            name: 'Content Creator Agent',
            description: 'Automatically generates and posts engaging content',
            status: 'Available'
        },
        {
            id: 'engagement-bot',
            name: 'Engagement Manager',
            description: 'Intelligently likes, comments, and follows accounts',
            status: 'Available'
        },
        {
            id: 'analytics-tracker',
            name: 'Analytics Tracker',
            description: 'Tracks performance metrics and provides insights',
            status: 'Premium'
        }
    ];
    res.json({
        success: true,
        data: agents
    });
});
// Deploy selected agent
router.post('/deploy', async (req, res) => {
    try {
        const { agentId } = req.body;
        if (!agentId) {
            res.status(400).json({
                success: false,
                message: 'Agent ID is required'
            });
            return;
        }
        if (agentStatus.isRunning) {
            res.status(409).json({
                success: false,
                message: 'Another agent is already running'
            });
            return;
        }
        logger_1.default.info(`Deploying agent: ${agentId}`);
        // Update agent status
        agentStatus = {
            isRunning: true,
            agentId,
            startTime: new Date(),
            lastActivity: new Date()
        };
        // Start Instagram agent in background (for engagement-bot)
        if (agentId === 'engagement-bot') {
            setTimeout(() => {
                (0, Instagram_1.runInstagram)().catch(error => {
                    logger_1.default.error('Instagram agent error:', error);
                    agentStatus.isRunning = false;
                });
            }, 1000);
        }
        res.json({
            success: true,
            message: `Agent ${agentId} deployed successfully`,
            data: {
                agentId,
                status: 'running',
                startTime: agentStatus.startTime
            }
        });
    }
    catch (error) {
        logger_1.default.error('Agent deployment error:', error);
        agentStatus.isRunning = false;
        res.status(500).json({
            success: false,
            message: 'Failed to deploy agent'
        });
    }
});
// Get agent status
router.get('/status', (_req, res) => {
    res.json({
        success: true,
        data: {
            ...agentStatus,
            uptime: agentStatus.startTime ? Date.now() - agentStatus.startTime.getTime() : 0
        }
    });
});
// Stop agent
router.post('/stop', (_req, res) => {
    logger_1.default.info('Stopping agent');
    agentStatus = {
        isRunning: false,
        agentId: null,
        startTime: null,
        lastActivity: null
    };
    res.json({
        success: true,
        message: 'Agent stopped successfully'
    });
});
exports.default = router;
