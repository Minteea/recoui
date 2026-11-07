import { renderToString } from "solid-js/web";
import { describe, expect, it } from "vitest";
import { Button } from "~";

describe("Button server rendering", () => {
  it("renders button semantics and appearance without a browser", () => {
    const html = renderToString(() => (
      <Button type="button" variant="outline" color="primary" disabled>
        保存
      </Button>
    ));

    expect(html).toContain("<button");
    expect(html).toMatch(/class="ui-button\s*"/);
    expect(html).toContain('data-variant="outline"');
    expect(html).toContain('data-color="primary"');
    expect(html).toContain("disabled");
    expect(html).toContain("保存");
  });
});
