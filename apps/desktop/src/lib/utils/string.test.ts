import { rejoinParagraphs } from "$lib/utils/string";
import { describe, expect, test } from "vitest";

describe("rejoinParagraphs", () => {
	test("joins hard wrapped lines into one paragraph", () => {
		expect(rejoinParagraphs("this line is wrapped\nhalfway through.")).toBe(
			"this line is wrapped halfway through.",
		);
	});

	test("leaves lines inside a fenced code block alone", () => {
		const text = "Run this:\n```\nfoo --bar\n  baz\n```\nand that is it.";
		expect(rejoinParagraphs(text)).toBe(text);
	});

	test("leaves lines inside a tilde fenced code block alone", () => {
		const text = "Output:\n~~~\nerror: one\nerror: two\n~~~";
		expect(rejoinParagraphs(text)).toBe(text);
	});

	test("keeps blank lines inside a fenced code block", () => {
		const text = "```\nfirst\n\nsecond\n```";
		expect(rejoinParagraphs(text)).toBe(text);
	});

	test("rejoins wrapped lines again after a code block closes", () => {
		expect(rejoinParagraphs("```\ncode\n```\nthis wraps\nonto two lines")).toBe(
			"```\ncode\n```\nthis wraps onto two lines",
		);
	});
});
