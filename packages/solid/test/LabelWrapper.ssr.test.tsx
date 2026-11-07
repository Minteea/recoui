import { renderToString } from "solid-js/web";
import { describe, expect, it } from "vitest";
import { Checkbox, LabelWrapper, Radio } from "~";

describe("LabelWrapper server rendering", () => {
  it("renders span wrappers with controls before their associated labels", () => {
    const html = renderToString(() => (
      <>
        <LabelWrapper label={<strong>Updates</strong>} labelProps={{ for: "updates" }}>
          <Checkbox id="updates" name="updates" />
        </LabelWrapper>
        <LabelWrapper.Root>
          <Radio id="email" name="channel" value="email" />
          <LabelWrapper.Label for="email">Email</LabelWrapper.Label>
        </LabelWrapper.Root>
      </>
    ));

    expect(html.match(/<span\b[^>]*class="ui-label-wrapper(?:\s|")/g)).toHaveLength(2);
    expect(html.match(/<label\b[^>]*class="ui-label(?:\s|")/g)).toHaveLength(2);
    expect(html.indexOf('id="updates"')).toBeLessThan(html.indexOf('for="updates"'));
    expect(html.indexOf('id="email"')).toBeLessThan(html.indexOf('for="email"'));
    expect(html).toContain("<strong>Updates</strong>");
    expect(html).toContain('name="channel"');
    expect(html).not.toMatch(/\slabel=/);
    expect(html).not.toContain("ui-field-content");
    expect(html).not.toContain("ui-field-description");
  });
});
