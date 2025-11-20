import { GoogleGenAI, Type } from "@google/genai";
import { AIChallengeResponse } from "../types";
import { LOCAL_TRUTHS, LOCAL_DARES, LOCAL_CHALLENGES } from "../constants";

const API_KEY = process.env.API_KEY || '';

// Use a robust fallback if API key is missing or fails
const FALLBACK_CHALLENGE: AIChallengeResponse = {
  title: "系统离线",
  description: "AI 暂时连接不上，请直接罚酒一杯！",
  intensity: "Low"
};

/**
 * Gets a random item from a local array
 */
const getRandomLocal = (arr: string[] | AIChallengeResponse[]): AIChallengeResponse => {
  const item = arr[Math.floor(Math.random() * arr.length)];
  
  if (typeof item === 'string') {
    return {
      title: "本地精选",
      description: item,
      intensity: "Medium"
    };
  }
  return item;
};

export const generatePartyChallenge = async (mode: 'general' | 'truth' | 'dare' = 'general'): Promise<AIChallengeResponse> => {
  
  // 1. Immediate fallback if no key
  if (!API_KEY) {
    if (mode === 'truth') return getRandomLocal(LOCAL_TRUTHS);
    if (mode === 'dare') return getRandomLocal(LOCAL_DARES);
    return getRandomLocal(LOCAL_CHALLENGES);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    let promptText = "为聚会生成一个简短、有趣且富有创意的饮酒游戏挑战。说明保持在20个字以内。使用中文输出。";
    
    if (mode === 'truth') {
      promptText = "生成一个犀利、深入灵魂的“真心话”问题，适合聚会。中文输出，20字以内。";
    } else if (mode === 'dare') {
      promptText = "生成一个有趣、搞怪但安全的“大冒险”挑战。中文输出，20字以内。";
    }

    // 2. Race Condition: API Call vs Timeout
    // If API takes longer than 2.5 seconds, we return a local fallback to keep the game flowing.
    const timeoutPromise = new Promise<AIChallengeResponse>((resolve) => {
        setTimeout(() => {
            console.warn("AI timeout, using local backup");
            if (mode === 'truth') resolve(getRandomLocal(LOCAL_TRUTHS));
            else if (mode === 'dare') resolve(getRandomLocal(LOCAL_DARES));
            else resolve(getRandomLocal(LOCAL_CHALLENGES));
        }, 2500); // 2.5s Max Wait
    });

    const apiPromise = (async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptText,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  intensity: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
                },
                required: ["title", "description", "intensity"]
              }
            }
          });
      
          if (response.text) {
            return JSON.parse(response.text) as AIChallengeResponse;
          }
          throw new Error("Empty response");
    })();

    // Race them
    return await Promise.race([apiPromise, timeoutPromise]);

  } catch (error) {
    console.error("Error generating challenge:", error);
    // 3. Error Fallback
    if (mode === 'truth') return getRandomLocal(LOCAL_TRUTHS);
    if (mode === 'dare') return getRandomLocal(LOCAL_DARES);
    return getRandomLocal(LOCAL_CHALLENGES);
  }
};