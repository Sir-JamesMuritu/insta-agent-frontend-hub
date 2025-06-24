import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  features: string[];
  category: "Content" | "Engagement" | "Analytics" | "Growth";
  status: "Available" | "Premium" | "Coming Soon";
}

const staticFeatures = {
  "content-creator": ["Auto-post scheduling", "Caption generation", "Hashtag optimization", "Story creation"],
  "engagement-bot": ["Smart liking", "Contextual comments", "Follow/unfollow strategy", "DM automation"],
  "analytics-tracker": ["Performance tracking", "Competitor analysis", "Growth insights", "Report generation"]
};

const staticCategories = {
  "content-creator": "Content" as const,
  "engagement-bot": "Engagement" as const,
  "analytics-tracker": "Analytics" as const
};

const AgentSelection = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents/list');
      const data = await response.json();
      
      if (data.success) {
        const enrichedAgents = data.data.map((agent: any) => ({
          ...agent,
          features: staticFeatures[agent.id as keyof typeof staticFeatures] || [],
          category: staticCategories[agent.id as keyof typeof staticCategories] || "Growth"
        }));
        setAgents(enrichedAgents);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      toast({
        title: "Connection Error",
        description: "Failed to load agents. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!selectedAgent) {
      toast({
        title: "No Agent Selected",
        description: "Please select an agent to deploy.",
        variant: "destructive",
      });
      return;
    }

    const agent = agents.find(a => a.id === selectedAgent);
    if (agent?.status !== "Available") {
      toast({
        title: "Agent Unavailable",
        description: `This agent is currently ${agent?.status.toLowerCase()}.`,
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    
    try {
      const response = await fetch('/api/agents/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          agentId: selectedAgent,
          username: localStorage.getItem('ig_username'),
          password: localStorage.getItem('ig_password')
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Agent Deployed Successfully!",
          description: `${agent?.name} is now active and running.`,
        });
      } else {
        toast({
          title: "Deployment Failed",
          description: data.message || "Failed to deploy agent",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Content": return "bg-blue-100 text-blue-800";
      case "Engagement": return "bg-green-100 text-green-800";
      case "Analytics": return "bg-purple-100 text-purple-800";
      case "Growth": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Premium": return "bg-yellow-100 text-yellow-800";
      case "Coming Soon": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instagram-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-instagram-gradient bg-clip-text text-transparent mb-2">
            AI Agent Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Select and deploy your Instagram automation agents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {agents.map((agent, index) => (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                selectedAgent === agent.id
                  ? "ring-2 ring-instagram-purple shadow-lg scale-105"
                  : "hover:shadow-lg"
              } animate-slide-up bg-white/80 backdrop-blur-sm`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedAgent(agent.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <Badge className={getStatusColor(agent.status)} variant="secondary">
                    {agent.status}
                  </Badge>
                </div>
                <Badge className={getCategoryColor(agent.category)} variant="secondary">
                  {agent.category}
                </Badge>
                <CardDescription className="text-sm leading-relaxed">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedAgent(expandedAgent === agent.id ? null : agent.id);
                    }}
                    className="p-0 h-auto font-semibold text-instagram-purple hover:text-instagram-pink"
                  >
                    Features {expandedAgent === agent.id ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                  </Button>
                </div>
                
                {expandedAgent === agent.id && (
                  <ul className="space-y-1 text-sm text-gray-600 animate-fade-in">
                    {agent.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-instagram-purple rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleDeploy}
            disabled={!selectedAgent || isDeploying}
            className="bg-instagram-gradient hover:bg-instagram-hover text-white font-semibold px-8 py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            size="lg"
          >
            {isDeploying ? "Deploying Agent..." : "Deploy Selected Agent"}
          </Button>
          
          {selectedAgent && (
            <p className="mt-4 text-gray-600 animate-fade-in">
              Ready to deploy: <span className="font-semibold text-instagram-purple">
                {agents.find(a => a.id === selectedAgent)?.name}
              </span>
            </p>
          )}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p className="mb-2">🤖 AI-powered automation at your fingertips</p>
          <p>All agents comply with Instagram's terms of service</p>
        </div>
      </div>
    </div>
  );
};

export default AgentSelection;
