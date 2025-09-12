import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Play, Pause, Square, Settings, Activity, Users, MessageSquare, TrendingUp } from "lucide-react";

interface AgentMetrics {
  postsGenerated: number;
  likesGiven: number;
  commentsPosted: number;
  followersGained: number;
  engagementRate: number;
  uptime: number;
}

const AgentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentId = searchParams.get('id');
  const [isRunning, setIsRunning] = useState(true);
  const [metrics, setMetrics] = useState<AgentMetrics>({
    postsGenerated: 12,
    likesGiven: 347,
    commentsPosted: 89,
    followersGained: 23,
    engagementRate: 4.7,
    uptime: 97.3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setMetrics(prev => ({
          ...prev,
          likesGiven: prev.likesGiven + Math.floor(Math.random() * 3),
          commentsPosted: prev.commentsPosted + Math.floor(Math.random() * 2),
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning]);

  if (!agentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Agent Selected</h1>
          <Button onClick={() => navigate('/agents')}>
            Select an Agent
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleStatus = () => {
    setIsRunning(!isRunning);
    toast({
      title: isRunning ? "Agent Paused" : "Agent Resumed",
      description: `Your agent has been ${isRunning ? 'paused' : 'resumed'} successfully.`,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    toast({
      title: "Agent Stopped",
      description: "Your agent has been stopped and will return to the selection page.",
    });
    setTimeout(() => navigate('/agents'), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/agents')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Agents
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Agent Status
              </h1>
              <p className="text-gray-600">Monitor your deployed agent performance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isRunning ? "default" : "secondary"} className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {isRunning ? "Running" : "Paused"}
            </Badge>
          </div>
        </div>

        {/* Agent Info & Controls */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Content Creator Agent</CardTitle>
                <CardDescription>Automatically generating and posting engaging content</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isRunning ? "secondary" : "default"}
                  size="sm"
                  onClick={handleToggleStatus}
                  className="flex items-center gap-2"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? "Pause" : "Resume"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleStop}
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configure
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Uptime</p>
                <div className="flex items-center gap-2">
                  <Progress value={metrics.uptime} className="flex-1" />
                  <span className="text-sm font-medium">{metrics.uptime}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Engagement Rate</p>
                <div className="flex items-center gap-2">
                  <Progress value={metrics.engagementRate * 20} className="flex-1" />
                  <span className="text-sm font-medium">{metrics.engagementRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Posts Generated</CardTitle>
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.postsGenerated}</div>
              <p className="text-xs text-gray-500 mt-1">Today</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Likes Given</CardTitle>
                <Activity className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.likesGiven}</div>
              <p className="text-xs text-gray-500 mt-1">+{Math.floor(Math.random() * 5) + 1} in last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Comments Posted</CardTitle>
                <MessageSquare className="w-4 h-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.commentsPosted}</div>
              <p className="text-xs text-gray-500 mt-1">Contextual & engaging</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Followers Gained</CardTitle>
                <Users className="w-4 h-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">+{metrics.followersGained}</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Live feed of your agent's actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Liked post from @fashion_blogger</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Posted new content: "Summer vibes ☀️"</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Commented on trending post</p>
                  <p className="text-xs text-gray-500">32 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New follower: @creative_artist</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentStatus;