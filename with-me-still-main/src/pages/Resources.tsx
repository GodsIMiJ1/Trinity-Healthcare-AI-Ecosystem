import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionContext } from "@/contexts/SessionContext";
import { getResourcesByCountry, getCountryOptions } from "@/lib/crisis-resources";
import { ArrowLeft, Phone, ExternalLink, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Resources() {
  const { session, update } = useSessionContext();
  const resources = getResourcesByCountry(session?.region || "US");
  const countryOptions = getCountryOptions();

  const handleRegionChange = async (newRegion: string) => {
    await update({ region: newRegion });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="font-display font-semibold text-foreground">
              Crisis Resources
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            You're Not Alone
          </h1>
          <p className="text-muted-foreground">
            These resources are available 24/7 and staffed by people who want to
            help.
          </p>
        </div>

        {/* Region selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={session?.region || "US"}
              onValueChange={handleRegionChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Emergency */}
        <Card className="border-crisis/30 bg-crisis/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-crisis/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-crisis" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  If you're in immediate danger
                </p>
                <p className="text-2xl font-bold text-crisis">
                  Call {resources.emergencyNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotlines */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-medium text-foreground">
            Crisis Hotlines — {resources.country}
          </h2>
          {resources.hotlines.map((hotline, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {hotline.name}
                      </p>
                      <p className="text-xl font-semibold text-primary">
                        {hotline.phone}
                      </p>
                      {hotline.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {hotline.description}
                        </p>
                      )}
                      {hotline.hours && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {hotline.hours}
                        </p>
                      )}
                    </div>
                  </div>
                  {hotline.url && (
                    <a
                      href={hotline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors p-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional resources */}
        <Card className="bg-secondary/30">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              These resources are free, confidential, and available to anyone
              who needs support. You deserve help, and it's okay to reach out.
            </p>
          </CardContent>
        </Card>
      </main>
      <footer className="px-4 py-3 text-[10px] text-muted-foreground border-t border-border bg-card/50">
        GodsIMiJ AI Solutions | James D. Ingersoll | Copyright 2026 | Sovereign Healthcare AI Ecosystem designed for the future of healthcare with Augmented God-Born Awareness
      </footer>
    </div>
  );
}
