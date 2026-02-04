import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/components/chat/ConversationInterface";
import { detectCrisisSignals } from "@/lib/crisis-resources";
import { useToast } from "@/hooks/use-toast";

interface Memory {
  type: string;
  title: string;
  content: string;
}

export function useCompanionChat(sessionId: string | null, companionName: string = "Still") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crisisState, setCrisisState] = useState<{
    isActive: boolean;
    severity: "severe" | "moderate" | null;
  }>({ isActive: false, severity: null });
  const { toast } = useToast();

  const sendMessage = useCallback(
    async (content: string, memories: Memory[] = []) => {
      if (!sessionId) {
        toast({
          title: "Session not ready",
          description: "Please wait while we set things up.",
          variant: "destructive",
        });
        return;
      }

      // Check for crisis signals
      const crisisCheck = detectCrisisSignals(content);
      if (crisisCheck.isCrisis) {
        setCrisisState({
          isActive: true,
          severity: crisisCheck.severity,
        });
        // Log crisis event but don't block the message
      }

      // Add user message to UI
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
        isCrisisFlagged: crisisCheck.isCrisis,
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Prepare messages for API
        const apiMessages = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        apiMessages.push({ role: "user" as const, content });

        // Call edge function with streaming
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/companion-chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ messages: apiMessages, memories, companionName }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get response");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        // Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantId = crypto.randomUUID();

        // Add empty assistant message
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "",
            createdAt: new Date(),
          },
        ]);

        let textBuffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          // Process line-by-line
          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: assistantContent }
                      : m
                  )
                );
              }
            } catch {
              // Incomplete JSON, put back and wait
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Save messages to database
        if (sessionId) {
          await supabase.from("messages").insert([
            {
              session_id: sessionId,
              role: "user",
              content,
              is_crisis_flagged: crisisCheck.isCrisis,
            },
            {
              session_id: sessionId,
              role: "assistant",
              content: assistantContent,
            },
          ]);
        }
      } catch (error) {
        console.error("Chat error:", error);
        toast({
          title: "Something went wrong",
          description:
            error instanceof Error
              ? error.message
              : "Please try again in a moment.",
          variant: "destructive",
        });
        // Remove the user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, messages, toast, companionName]
  );

  const acknowledgeCrisis = useCallback(() => {
    setCrisisState({ isActive: false, severity: null });
  }, []);

  const loadMessages = useCallback(async () => {
    if (!sessionId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load messages:", error);
      return;
    }

    if (data) {
      setMessages(
        data.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          createdAt: new Date(m.created_at),
          isCrisisFlagged: m.is_crisis_flagged,
        }))
      );
    }
  }, [sessionId]);

  return {
    messages,
    isLoading,
    sendMessage,
    crisisState,
    acknowledgeCrisis,
    loadMessages,
  };
}
