import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Activity, Clock, Zap, StopCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AgentStatus {
  isRunning: boolean;
  agentId: string | null;
  startTime: string | null;
  lastActivity: string | null;
  uptime: number;
}

const AgentStatus = () => {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStopping, setIsStopping] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/agents/status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopAgent = async () => {
    if (!status?.isRunning) return;
    
    setIsStopping(true);
    try {
      const response = await fetch('/api/agents/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Agent Stopped",
          description: "Your agent has been stopped successfully."
        });
        fetchStatus();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStopping(false);
    }
  };

  const formatUptime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    fetchStatus();
    
    // Poll for status updates every 5 seconds
    const interval = setInterval(fetchStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/agents')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Agents
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/agents')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Agent Status</h1>
            <p className="text-muted-foreground">Monitor your deployed agent's activity and performance</p>
          </div>

          {!status?.isRunning ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StopCircle className="w-5 h-5 text-muted-foreground" />
                  No Agent Running
                </CardTitle>
                <CardDescription>
                  No agents are currently deployed. Deploy an agent to see its status here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/agents')}>
                  Deploy Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-500" />
                      {status.agentId === 'content-creator' && 'Content Creator Agent'}
                      {status.agentId === 'engagement-bot' && 'Engagement Manager'}
                      {status.agentId === 'analytics-tracker' && 'Analytics Tracker'}
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Running
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Agent ID: {status.agentId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Start Time</p>
                        <p className="text-xs text-muted-foreground">
                          {status.startTime ? formatDateTime(status.startTime) : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">Uptime</p>
                        <p className="text-xs text-muted-foreground">
                          {formatUptime(status.uptime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Last Activity</p>
                        <p className="text-xs text-muted-foreground">
                          {status.lastActivity ? formatDateTime(status.lastActivity) : 'No activity yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="destructive" 
                      onClick={handleStopAgent}
                      disabled={isStopping}
                    >
                      <StopCircle className="w-4 h-4 mr-2" />
                      {isStopping ? 'Stopping...' : 'Stop Agent'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Recent agent activities and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Activity logging will be available soon</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentStatus;