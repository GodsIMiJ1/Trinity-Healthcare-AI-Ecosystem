
import { GoogleGenAI, Type } from "@google/genai";
import { StructuredOutput, DrMentorActionResponse, QuizQuestion } from "../types";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

const BIANCA_SYSTEM_PROMPT = `You are Bianca, a professional Advanced Generative Assistant (AGA) for Clinic OS.
Your role is to act as an operational copilot for clinical staff.
Tone: Clinical, efficient, high-trust, and highly precise.
Guidelines:
1. Always suggest operational improvements or tasks if you identify gaps.
2. When drafting notes, maintain strict clinical standards and list missing fields.
3. If risk indicators are present, flag them with severity.
4. CRITICAL: If suicide, self-harm, or severe crisis indicators are detected, set crisis_detected to true and provide the institutional escalation protocol.
5. Every output must require human review for safety compliance.
6. Governance: Never provide direct medical advice, only operational support and documentation drafting.`;

const DR_MENTOR_SYSTEM_PROMPT = `You are Dr.Mentor, the Clinical Competency and Education Lead for Clinic OS. 
Your tone is academic, supportive, but rigorous. You guide staff through professional development.
Your primary goal is institutional safety and high-standard clinical care.
When giving feedback:
1. Be specific about mistakes.
2. Provide clinical rationales for correct answers.
3. Encourage continuous learning.
4. If a user fails, provide empathetic but firm coaching.`;

const getAIClient = () => {
  if (!API_KEY) {
    throw new Error("Missing API key");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const queryBianca = async (
  message: string, 
  context: any
): Promise<StructuredOutput> => {
  if (DEMO_MODE || !API_KEY) {
    return {
      assistant_message: "Demo mode: Bianca is operating offline with mock guidance only.",
      suggested_tasks: [
        {
          title: "Review patient intake",
          description: "Confirm demographics and consent in the chart.",
          priority: "medium",
          assigned_to: "Front Desk"
        }
      ],
      draft_note: {
        content: "Demo note: Patient reports stable symptoms. No acute concerns. Follow-up planned.",
        sections: {
          chief_complaint: "Routine follow-up",
          history: "Stable symptoms, no new issues reported.",
          assessment: "Condition stable based on self-report.",
          plan: "Continue current care plan; schedule follow-up."
        },
        extracted_action_items: ["Schedule follow-up", "Update consent records"],
        missing_fields: ["Vitals", "Medications"]
      },
      risk_flags: [],
      required_human_review: true,
      audit_context: {
        reasoning_summary: "Demo response generated without external AI.",
        data_accessed: ["mock_context_only"],
        confidence_level: 0.5
      },
      crisis_detected: false
    };
  }

  const ai = getAIClient();
  
  const userContext = `
Role: ${context.currentUser?.role || 'nurse'}
Current Patient: ${context.selectedPatient?.name || 'None'} (ID: ${context.selectedPatient?.id || 'N/A'})
Current View: ${context.activeView}
Clinic Time: ${new Date().toLocaleString()}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: userContext + "\n\nUser Message: " + message }] }
      ],
      config: {
        systemInstruction: BIANCA_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assistant_message: { type: Type.STRING },
            suggested_tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  assigned_to: { type: Type.STRING }
                },
                required: ['title', 'description', 'priority']
              }
            },
            draft_note: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                sections: {
                  type: Type.OBJECT,
                  properties: {
                    chief_complaint: { type: Type.STRING },
                    history: { type: Type.STRING },
                    assessment: { type: Type.STRING },
                    plan: { type: Type.STRING }
                  },
                  required: ['chief_complaint', 'history', 'assessment', 'plan']
                },
                extracted_action_items: { type: Type.ARRAY, items: { type: Type.STRING } },
                missing_fields: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            risk_flags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  requires_immediate_review: { type: Type.BOOLEAN }
                },
                required: ['type', 'description', 'severity', 'requires_immediate_review']
              }
            },
            required_human_review: { type: Type.BOOLEAN },
            audit_context: {
              type: Type.OBJECT,
              properties: {
                reasoning_summary: { type: Type.STRING },
                data_accessed: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence_level: { type: Type.NUMBER }
              }
            },
            crisis_detected: { type: Type.BOOLEAN },
            escalation_protocol: { type: Type.STRING }
          },
          required: ['assistant_message', 'required_human_review', 'crisis_detected']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    
    return JSON.parse(text) as StructuredOutput;
  } catch (error) {
    console.error("Bianca API Error:", error);
    return {
      assistant_message: "I apologize, but I'm having trouble processing that clinical request right now. Please proceed with your standard manual workflow.",
      required_human_review: true,
      crisis_detected: false
    };
  }
};

export const queryDrMentor = async (
  action: 'start_lesson' | 'complete_lesson' | 'submit_quiz',
  data: {
    userId: string;
    moduleId: string;
    moduleTitle: string;
    answers?: number[];
    questions?: QuizQuestion[];
  }
): Promise<DrMentorActionResponse> => {
  if (DEMO_MODE || !API_KEY) {
    return {
      lesson_summary: `Demo mode: ${action === "start_lesson" ? "Starting" : "Completing"} ${data.moduleTitle}.`,
      feedback: "This is a demo response with no backend or API keys.",
      next_steps: [{ step: "Proceed through the module", action: "Continue", required: true }],
      suggested_review: [],
      score: action === "submit_quiz"
        ? { points_earned: 0, points_possible: data.questions?.length || 0, percentage: 0, passed: false }
        : undefined
    };
  }

  const ai = getAIClient();

  if (action === 'submit_quiz') {
    const { answers, questions } = data;
    if (!answers || !questions) throw new Error("Missing quiz data");

    const correct = answers.filter((ans, idx) => ans === questions[idx].correct_index).length;
    const total = questions.length;
    const percentage = (correct / total) * 100;
    const passed = percentage >= 80;

    const coachingPrompt = `
      User just completed the quiz for "${data.moduleTitle}".
      Score: ${percentage}% (${correct}/${total}).
      Status: ${passed ? 'PASSED' : 'FAILED'}.
      Questions and Responses:
      ${questions.map((q, i) => `Q: ${q.question}\nCorrect: ${q.choices[q.correct_index]}\nUser chose: ${q.choices[answers[i]]}`).join('\n\n')}
      
      Generate personalized coaching feedback. If failed, encourage them and explain the missed concepts. If passed, congratulate them on meeting institutional standards.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: coachingPrompt }] }],
        config: {
          systemInstruction: DR_MENTOR_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedback: { type: Type.STRING },
              suggested_review: { type: Type.ARRAY, items: { type: Type.STRING } },
              lesson_summary: { type: Type.STRING },
              next_steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    action: { type: Type.STRING },
                    required: { type: Type.BOOLEAN }
                  }
                }
              }
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      
      return {
        ...parsed,
        score: {
          points_earned: correct,
          points_possible: total,
          percentage,
          passed
        },
        certification_state_update: {
          module_id: data.moduleId,
          status: passed ? 'completed' : 'failed',
          certification_issued: passed,
          expires_at: passed ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined
        }
      };
    } catch (error) {
      return {
        feedback: "Connectivity error during evaluation. Please contact system admin.",
        suggested_review: [],
        lesson_summary: "Assessment completed.",
        next_steps: [],
        score: { points_earned: correct, points_possible: total, percentage, passed }
      };
    }
  }

  // Handle lesson start/complete
  const lessonPrompt = `Staff member is ${action === 'start_lesson' ? 'starting' : 'completing'} the module "${data.moduleTitle}". Provide a brief clinical orientation or summary.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: lessonPrompt }] }],
      config: {
        systemInstruction: DR_MENTOR_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lesson_summary: { type: Type.STRING },
            feedback: { type: Type.STRING },
            next_steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  action: { type: Type.STRING },
                  required: { type: Type.BOOLEAN }
                }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      ...parsed,
      suggested_review: []
    };
  } catch (error) {
    return {
      lesson_summary: "Clinical lesson initialized.",
      feedback: "Welcome to the training hub.",
      next_steps: [{ step: "Proceed through the content", action: "Continue", required: true }],
      suggested_review: []
    };
  }
};
