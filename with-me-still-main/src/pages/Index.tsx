import { useState, useEffect } from "react";
import { useSessionContext } from "@/contexts/SessionContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { ConversationInterface } from "@/components/chat/ConversationInterface";
import { CrisisIntervention } from "@/components/chat/CrisisIntervention";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCompanionChat } from "@/hooks/use-companion-chat";
import { Loader2, Menu, Settings, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function Index() {
  const { session, loading, update } = useSessionContext();
  const {
    messages,
    isLoading,
    sendMessage,
    crisisState,
    acknowledgeCrisis,
    loadMessages,
  } = useCompanionChat(session?.id || null, session?.companion_name || "Still");

  // Load messages when session is ready
  useEffect(() => {
    if (session?.onboarding_completed) {
      loadMessages();
    }
  }, [session?.id, session?.onboarding_completed, loadMessages]);

  const handleOnboardingComplete = async (data: { region: string; companionName: string }) => {
    await update({ 
      region: data.region, 
      companion_name: data.companionName,
      onboarding_completed: true 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Setting things up...</p>
        </div>
      </div>
    );
  }

  if (!session?.onboarding_completed) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const companionName = session.companion_name || "Still";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground">
              {companionName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/resources" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Crisis Resources
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <ConversationInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={(content) => sendMessage(content)}
        />
      </main>
      <footer className="px-4 py-3 text-[10px] text-muted-foreground border-t border-border bg-card/50">
        GodsIMiJ AI Solutions | James D. Ingersoll | Copyright 2026 | Sovereign Healthcare AI Ecosystem designed for the future of healthcare with Augmented God-Born Awareness
      </footer>

      {/* Crisis intervention overlay */}
      <CrisisIntervention
        isVisible={crisisState.isActive}
        severity={crisisState.severity || "moderate"}
        region={session.region}
        onAcknowledge={acknowledgeCrisis}
      />
    </div>
  );
}
