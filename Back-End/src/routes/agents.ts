
import express, { Request, Response } from 'express';
import logger from '../config/logger';
import { runInstagram } from '../client/Instagram';

const router = express.Router();

interface DeployAgentRequest {
  agentId: string;
  username?: string;
  password?: string;
}

let agentStatus = {
  isRunning: false,
  agentId: null as string | null,
  startTime: null as Date | null,
  lastActivity: null as Date | null
};

// Get available agents
router.get('/list', (req: Request, res: Response) => {
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
router.post('/deploy', async (req: Request<{}, {}, DeployAgentRequest>, res: Response) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'Agent ID is required'
      });
    }

    if (agentStatus.isRunning) {
      return res.status(409).json({
        success: false,
        message: 'Another agent is already running'
      });
    }

    logger.info(`Deploying agent: ${agentId}`);

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
        runInstagram().catch(error => {
          logger.error('Instagram agent error:', error);
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

  } catch (error) {
    logger.error('Agent deployment error:', error);
    agentStatus.isRunning = false;
    res.status(500).json({
      success: false,
      message: 'Failed to deploy agent'
    });
  }
});

// Get agent status
router.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      ...agentStatus,
      uptime: agentStatus.startTime ? Date.now() - agentStatus.startTime.getTime() : 0
    }
  });
});

// Stop agent
router.post('/stop', (req: Request, res: Response) => {
  logger.info('Stopping agent');
  
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

export default router;
