import { useState } from "react";
import { useListMentors, useConnectMentor, getListMentorsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { Users, Search, Loader2, Building, GraduationCap, MessageSquare, CheckCircle } from "lucide-react";

export default function Alumni() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState<number | null>(null);

  const { data: mentors, isLoading } = useListMentors({ query: { queryKey: getListMentorsQueryKey() } });
  const connectMutation = useConnectMentor();

  const filtered = mentors?.filter(m =>
    search === "" ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.company.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleConnect = (id: number) => {
    setConnecting(id);
    connectMutation.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListMentorsQueryKey() });
          toast({ title: "Connection request sent!", description: "The mentor will receive your request shortly." });
          setConnecting(null);
        },
        onError: (err: any) => {
          toast({ title: "Request failed", description: err?.data?.error ?? "Please try again.", variant: "destructive" });
          setConnecting(null);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-500" />
            Alumni Mentor Network
          </h1>
          <p className="text-muted-foreground mt-1">Connect with alumni at top companies who've been where you are</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, or role..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-mentor-search"
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No mentors found{search ? ` for "${search}"` : ""}.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mentor) => (
            <Card key={mentor.id} className="p-6 border-border bg-card card-hover" data-testid={`card-mentor-${mentor.id}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold flex-shrink-0">
                  {mentor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold" data-testid={`text-mentor-name-${mentor.id}`}>{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{mentor.role}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-medium text-primary">{mentor.company}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-3 text-sm text-muted-foreground">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{mentor.college}</span>
              </div>

              {mentor.bio && (
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{mentor.bio}</p>
              )}

              {mentor.expertise && mentor.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mentor.expertise.slice(0, 3).map((exp) => (
                    <Badge key={exp} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">{exp}</Badge>
                  ))}
                </div>
              )}

              {mentor.isConnected ? (
                <Button variant="outline" size="sm" className="w-full border-emerald-500/30 text-emerald-600" disabled data-testid={`button-connected-${mentor.id}`}>
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Connected
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full gradient-bg hover:opacity-90"
                  onClick={() => handleConnect(mentor.id)}
                  disabled={connecting === mentor.id}
                  data-testid={`button-connect-mentor-${mentor.id}`}
                >
                  {connecting === mentor.id ? (
                    <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Connecting...</>
                  ) : (
                    <><MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Connect</>
                  )}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
