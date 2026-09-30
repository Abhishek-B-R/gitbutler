import { codeContentToTokens, generateRows, parseHunk } from "$lib/utils/diffParsing";
import { describe, expect, test } from "vitest";

describe.concurrent("codeContentToTokens", () => {
	test("returns one token array per line", () => {
		const result = codeContentToTokens("line1\nline2\nline3", undefined);
		expect(result).toHaveLength(3);
	});

	test("sanitizes HTML entities in plain text fallback", () => {
		const result = codeContentToTokens('<script>alert("xss")</script>', undefined);
		const html = result[0].join("");
		expect(html).not.toContain("<script>");
		expect(html).toContain("&lt;script&gt;");
		expect(html).toContain("&quot;");
	});

	test("sanitizes ampersands", () => {
		const result = codeContentToTokens("a && b", undefined);
		const html = result[0].join("");
		expect(html).toContain("&amp;&amp;");
	});

	test("sanitizes single quotes", () => {
		const result = codeContentToTokens("it's", undefined);
		const html = result[0].join("");
		expect(html).toContain("&#39;");
	});

	test("wraps content in span with data-no-drag", () => {
		const result = codeContentToTokens("hello", undefined);
		const html = result[0].join("");
		expect(html).toContain("data-no-drag");
	});
});

describe.concurrent("generateRows word diff", () => {
	function rowsFor(hunk: string, inline: boolean) {
		const { contentSections } = parseHunk(hunk);
		return generateRows("file.txt", contentSections, inline, undefined, undefined, undefined);
	}

	test("highlights the changed part of a line that has spaces", () => {
		const html = rowsFor("@@ -1 +1 @@\n-foo = bar\n+foo = baz", false)
			.flatMap((row) => row.tokens)
			.join("");
		expect(html).toContain("token-inserted");
		expect(html).toContain("token-deleted");
	});

	test("highlights the changed part of a line without any spaces", () => {
		const html = rowsFor("@@ -1 +1 @@\n-FOO=bar\n+FOO=baz", false)
			.flatMap((row) => row.tokens)
			.join("");
		expect(html).toContain("token-inserted");
		expect(html).toContain("token-deleted");
	});

	test("highlights the changed part of a line without any spaces in inline mode", () => {
		const html = rowsFor("@@ -1 +1 @@\n-FOO=bar\n+FOO=baz", true)
			.flatMap((row) => row.tokens)
			.join("");
		expect(html).toContain("token-inserted");
	});

	test("does not word diff when the removed line is empty", () => {
		const html = rowsFor("@@ -1 +1 @@\n-\n+FOO=baz", false)
			.flatMap((row) => row.tokens)
			.join("");
		expect(html).not.toContain("token-inserted");
	});
});
