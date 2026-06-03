import ollama from "ollama";

export const generateLeadSummary = async (notes: string) => {
  const prompt = `
  Summarize these CRM notes.
  
  Return:
  1. Summary
  2. Intent
  3. Next Action
  
  Notes:
  ${notes}
  `;

  const response = await ollama.chat({
    model: "tinyllama",

    options: {
      num_predict: 80,
    },

    messages: [
      {
        role: "user",

        content: prompt,
      },
    ],
  });

  return response.message.content;
};

export const generateFollowUpSuggestion = async (notes: string) => {
  const prompt = `
  Based on these CRM notes,
  give:
  1. Next action
  2. Follow-up suggestion
  3. Sales advice
  
  Notes:
  ${notes}
  `;

  const response = await ollama.chat({
    model: "tinyllama",

    options: {
      num_predict: 80,
    },

    messages: [
      {
        role: "user",

        content: prompt,
      },
    ],
  });

  return response.message.content;
};
export const generateAssistantResponse = async (
  prompt: string,
  crmContext: string,
) => {
  const fullPrompt = `
You are an AI CRM assistant.

You help sales teams:
- prioritize leads
- analyze sales pipeline
- suggest next actions
- improve follow-ups

CRM Context:
${crmContext}

User Request:
${prompt}

Give concise business-focused advice.
`;

  const response = await ollama.chat({
    model: "tinyllama",

    options: {
      num_predict: 120,
    },

    messages: [
      {
        role: "user",

        content: fullPrompt,
      },
    ],
  });

  return response.message.content;
};
