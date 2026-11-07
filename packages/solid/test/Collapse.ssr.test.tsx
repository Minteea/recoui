import { renderToString } from "solid-js/web";
import { describe, expect, it } from "vitest";
import { Collapse } from "~";

describe("Collapse server rendering", () => {
  it.each([undefined, false, true])(
    "serializes expanded=%s with correct boolean attributes",
    (expanded) => {
      const html = renderToString(() => (
        <Collapse id="details" class="custom" expanded={expanded}>
          <input value="保留的内容" />
        </Collapse>
      ));
      const root = html.match(/<div\b[^>]*>/)![0];

      expect(html.match(/<div\b/g)).toHaveLength(1);
      expect(root).toContain("ui-collapse custom");
      expect(root).toContain('id="details"');
      expect(root).toContain(`aria-hidden="${!expanded}"`);
      expect(/\bdata-expanded(?:=|\s|>)/.test(root)).toBe(!!expanded);
      expect(/\binert(?:=|\s|>)/.test(root)).toBe(!expanded);
      expect(html).toContain('value="保留的内容"');
    },
  );
});
