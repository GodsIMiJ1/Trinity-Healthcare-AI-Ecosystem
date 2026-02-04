import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResourcesByCountry, CrisisResource } from "@/lib/crisis-resources";

interface CrisisInterventionProps {
  isVisible: boolean;
  severity: "severe" | "moderate";
  region: string;
  onAcknowledge: () => void;
}

export function CrisisIntervention({
  isVisible,
  severity,
  region,
  onAcknowledge,
}: CrisisInterventionProps) {
  const resources = getResourcesByCountry(region);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className="max-w-lg w-full border-crisis/50 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-crisis/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-crisis" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="font-display text-xl text-foreground">
                      I want to make sure you're safe
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      What you're going through sounds really difficult. This is
                      beyond what I can help with alone.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">
                  Please reach out to someone who can really help right now:
                </p>

                <div className="space-y-3">
                  {resources.hotlines.slice(0, 2).map((hotline, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">
                            {hotline.name}
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {hotline.phone}
                          </p>
                          {hotline.hours && (
                            <p className="text-xs text-muted-foreground">
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
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-between p-4 rounded-lg bg-crisis/10 border border-crisis/30">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-crisis" />
                      <div>
                        <p className="font-medium text-foreground">Emergency</p>
                        <p className="text-lg font-semibold text-crisis">
                          {resources.emergencyNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have to go through this alone. There are people
                    trained to help, and they want to hear from you.
                  </p>
                  <Button
                    variant="outline"
                    onClick={onAcknowledge}
                    className="w-full"
                  >
                    I understand — continue conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
