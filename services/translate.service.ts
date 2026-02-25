// services/translate.service.ts

export interface TranslateAudioResult {
  speaker: string;        // "paramedic" | "patient"
  source_text: string;    // 원문
  source_lang: string;    // 감지된 언어 코드
  translated_text: string; // 번역문
  target_lang: string;    // 대상 언어 코드
}

export interface SimplifyResult {
  original_text: string;
  simplified_text: string;
}

export const translateService = {
  /** 음성 파일을 /translate/audio 로 전송하여 번역 결과를 받는다 */
  async audio(
    audioBlob: Blob,
    options?: { targetLang?: string; sessionId?: string },
  ): Promise<TranslateAudioResult> {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    if (options?.targetLang) formData.append("target_lang", options.targetLang);
    if (options?.sessionId) formData.append("session_id", options.sessionId);

    const res = await fetch("/ai/translate/audio", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`번역 요청 실패 (${res.status}): ${text}`);
    }

    return res.json();
  },

  /** 텍스트를 쉬운 말로 변환한다 */
  async simplify(text: string): Promise<SimplifyResult> {
    const res = await fetch("/ai/translate/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`쉬운말 변환 실패 (${res.status}): ${body}`);
    }

    return res.json();
  },
};
