import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountryOptions } from "@/lib/crisis-resources";
import { Heart, Shield, Brain, Users, ChevronRight, Sparkles, Loader2 } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (data: { region: string; companionName: string }) => void;
}

const steps = [
  {
    id: "welcome",
    title: "Welcome",
    subtitle: "WithMe..Still",
  },
  {
    id: "boundaries",
    title: "What I Am",
    subtitle: "And what I'm not",
  },
  {
    id: "privacy",
    title: "Your Privacy",
    subtitle: "You own your memories",
  },
  {
    id: "naming",
    title: "Your Companion",
    subtitle: "Give me a name",
  },
  {
    id: "region",
    title: "Your Region",
    subtitle: "For local resources",
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("US");
  const [companionName, setCompanionName] = useState("Still");
  const countryOptions = getCountryOptions();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ region: selectedRegion, companionName });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-0 shadow-lg">
        <CardContent className="p-8">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && <WelcomeStep />}
              {currentStep === 1 && <BoundariesStep />}
              {currentStep === 2 && <PrivacyStep />}
              {currentStep === 3 && (
                <NamingStep
                  companionName={companionName}
                  onNameChange={setCompanionName}
                />
              )}
              {currentStep === 4 && (
                <RegionStep
                  selectedRegion={selectedRegion}
                  onRegionChange={setSelectedRegion}
                  countryOptions={countryOptions}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 ? (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button onClick={handleNext} className="gap-2">
              {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-breathe">
        <Heart className="h-10 w-10 text-primary" />
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
          WithMe..Still
        </h1>
        <p className="text-lg text-muted-foreground">
          A steady presence for your journey
        </p>
      </div>
      <p className="text-foreground/80 leading-relaxed">
        I'm here to walk alongside you — through the hard days and the quiet
        moments. Not as a therapist or doctor, but as a supportive presence
        that's always here when you need to talk.
      </p>
    </div>
  );
}

function BoundariesStep() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          What I Am
        </h2>
        <p className="text-muted-foreground">And what I'm not</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5">
          <div className="rounded-full bg-primary/10 p-2 mt-0.5">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">A supportive companion</h3>
            <p className="text-sm text-muted-foreground">
              I listen, reflect, and walk with you — never judge
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
          <div className="rounded-full bg-secondary p-2 mt-0.5">
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Not a replacement</h3>
            <p className="text-sm text-muted-foreground">
              I'm not a therapist, doctor, or clinician. For medical advice,
              please always consult healthcare professionals.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50">
          <div className="rounded-full bg-accent p-2 mt-0.5">
            <Brain className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">I remember</h3>
            <p className="text-sm text-muted-foreground">
              What you share helps me understand your journey — but you're
              always in control of your memories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyStep() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Your Privacy Matters
        </h2>
        <p className="text-muted-foreground">You own your memories</p>
      </div>

      <div className="space-y-4 text-foreground/80">
        <p>
          Everything you share with me is yours. I remember our conversations to
          better support you, but:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
            <span>You can view everything I remember about you</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
            <span>You can delete any memory, anytime</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
            <span>You can export all your data</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
            <span>I never share your information with anyone</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function NamingStep({
  companionName,
  onNameChange,
}: {
  companionName: string;
  onNameChange: (name: string) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [namingMode, setNamingMode] = useState<"choose" | "custom" | "ai">("choose");

  const suggestedNames = [
    { name: "Still", meaning: "A calm, steady presence" },
    { name: "Haven", meaning: "A safe place to land" },
    { name: "Ember", meaning: "A gentle, lasting warmth" },
    { name: "Sage", meaning: "Wise and grounding" },
    { name: "Echo", meaning: "Reflecting your voice back" },
    { name: "Harbor", meaning: "Shelter in the storm" },
  ];

  const handleAISuggest = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-name`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.name) {
          onNameChange(data.name);
          setNamingMode("ai");
        }
      }
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-accent-foreground" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Name Your Companion
        </h2>
        <p className="text-muted-foreground">
          What would you like to call me? This makes our conversations feel more personal.
        </p>
      </div>

      {namingMode === "choose" && (
        <div className="space-y-4">
          {/* Suggested names */}
          <div className="grid grid-cols-2 gap-2">
            {suggestedNames.map((suggestion) => (
              <button
                key={suggestion.name}
                onClick={() => {
                  onNameChange(suggestion.name);
                  setNamingMode("custom");
                }}
                className={`p-3 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-primary/5 ${
                  companionName === suggestion.name
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                <p className="font-medium text-foreground">{suggestion.name}</p>
                <p className="text-xs text-muted-foreground">{suggestion.meaning}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Custom name input */}
          <div className="space-y-3">
            <Input
              placeholder="Type your own name..."
              value={companionName}
              onChange={(e) => {
                onNameChange(e.target.value);
                setNamingMode("custom");
              }}
              className="text-center"
            />
            
            <Button
              variant="outline"
              onClick={handleAISuggest}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Let me choose my own name
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {(namingMode === "custom" || namingMode === "ai") && (
        <div className="text-center space-y-4">
          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">
              {namingMode === "ai" ? "I chose:" : "You chose:"}
            </p>
            <p className="font-display text-3xl font-semibold text-primary">
              {companionName}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNamingMode("choose")}
          >
            Choose a different name
          </Button>
        </div>
      )}
    </div>
  );
}

function RegionStep({
  selectedRegion,
  onRegionChange,
  countryOptions,
}: {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  countryOptions: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Your Region
        </h2>
        <p className="text-muted-foreground">
          This helps me show you local support resources if you ever need them
        </p>
      </div>

      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-sm text-muted-foreground text-center">
        You can change this later in settings
      </p>
    </div>
  );
}
