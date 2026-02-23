// services/stt.service.ts

export interface SttSegment {
  start: number;
  end: number;
  text: string;
}

export interface SttResult {
  text: string;
  segments?: SttSegment[];
}

export const sttService = {
  /** WAV Blob을 /ai/stt/clova 에 전송하여 STT 결과를 받는다 */
  async recognize(audioBlob: Blob): Promise<SttResult> {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    const res = await fetch("/ai/stt/clova", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`STT 요청 실패 (${res.status}): ${text}`);
    }

    return res.json();
  },
};
