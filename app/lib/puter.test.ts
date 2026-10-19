import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePuterStore } from "./puter";

describe("usePuterStore.ai.feedback", () => {
    beforeEach(() => {
        (window as any).puter = {
            ai: { chat: vi.fn() },
        };
    });

    it("retries with the current Puter Claude Sonnet model, then the legacy model, and finally the default Puter model", async () => {
        const chat = vi
            .fn()
            .mockRejectedValueOnce(new Error("Model not found: claude-sonnet-4-5"))
            .mockRejectedValueOnce(new Error("Model not found: claude-sonnet-4-20250514"))
            .mockResolvedValueOnce({ message: { content: "ok" } });

        (window as any).puter = {
            ai: { chat },
        };

        const response = await usePuterStore.getState().ai.feedback(
            "/files/resume.pdf",
            "Analyze this resume"
        );

        expect(chat).toHaveBeenCalledTimes(3);
        expect(chat).toHaveBeenNthCalledWith(
            1,
            expect.any(Array),
            expect.objectContaining({
                model: "claude-sonnet-4-5",
                max_tokens: 4500,
            })
        );
        expect(chat).toHaveBeenNthCalledWith(
            2,
            expect.any(Array),
            expect.objectContaining({
                model: "claude-sonnet-4-20250514",
                max_tokens: 4500,
            })
        );
        expect(chat).toHaveBeenNthCalledWith(
            3,
            expect.any(Array),
            expect.objectContaining({
                max_tokens: 4500,
            })
        );
        expect(response).toEqual({ message: { content: "ok" } });
    });
});
