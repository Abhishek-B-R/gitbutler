import { rejoinParagraphs } from "$lib/utils/string";
import { describe, expect, test } from "vitest";

describe("rejoinParagraphs", () => {
	test("joins hard wrapped lines into one paragraph", () => {
		expect(rejoinParagraphs("this line is wrapped\nhalfway through.")).toBe(
			"this line is wrapped halfway through.",
		);
	});

	test("keeps the blank line before a paragraph that starts with a capital", () => {
		expect(rejoinParagraphs("First paragraph.\n\nSecond paragraph.")).toBe(
			"First paragraph.\n\nSecond paragraph.",
		);
	});

	test("keeps the blank line before a paragraph that starts lowercase", () => {
		expect(
			rejoinParagraphs("first paragraph wraps\nhere.\n\nsecond one starts lowercase\nand wraps."),
		).toBe("first paragraph wraps here.\n\nsecond one starts lowercase and wraps.");
	});

	test("keeps the blank line before a list", () => {
		expect(rejoinParagraphs("Changes:\n\n- one\n- two")).toBe("Changes:\n\n- one\n- two");
	});

	test("collapses several blank lines into one paragraph break", () => {
		expect(rejoinParagraphs("one\n\n\n\ntwo")).toBe("one\n\ntwo");
	});
});
