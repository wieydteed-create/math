import { GoogleGenAI } from "@google/genai";

export async function analyzeFormula(grade: string, formula: string): Promise<string> {
  // Create a new instance for each call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    너는 한국 학생들을 위한 친절하고 전문적인 수학 선생님이야.
    현재 '${grade}' 학생이 다음 공식에 대해 질문했어:

    \`${formula}\`

    아래 구조에 맞춰 한국어로, 마크다운 형식으로 답변해줘. 각 섹션 제목 앞에는 이모지를 꼭 붙여줘.

    ### 📝 공식 이름
    이 공식의 정확한 이름을 알려줘. (예: 피타고라스의 정리)

    ### 📖 설명
    이 공식이 무엇을 의미하는지, 어떤 상황에서 사용되는지 '${grade}' 학생이 이해하기 쉽게 설명해줘.

    ### 🧮 예시
    이 공식을 사용하여 문제를 해결하는 간단하고 단계별 예시를 보여줘. 숫자와 과정을 명확하게 보여줘.

    ### 🔗 관련 개념
    학생이 함께 배우면 좋을 다른 관련 수학 개념들을 간략하게 언급해줘.

    전체적으로 학생에게 용기를 주는 친절한 말투를 사용해줘. 예를 들어, "이 공식은 처음엔 어려워 보일 수 있지만, 함께 차근차근 알아보면 금방 익숙해질 거예요!" 같은 문장으로 시작해봐.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Re-throw the error so the UI component can handle it (e.g., for key selection)
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("API 호출 중 알 수 없는 오류가 발생했습니다.");
  }
}
