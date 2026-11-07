import { renderToString } from "solid-js/web";
import { describe, expect, it } from "vitest";
import { Radio, RadioGroup } from "~";

describe("RadioGroup server rendering", () => {
  it("renders native names, defaults and required state while exposing group semantics", () => {
    const html = renderToString(() => (
      <>
        <RadioGroup defaultValue="basic" orientation="vertical" required aria-label="Plan">
          <Radio value="basic" />
          <Radio value="pro" />
        </RadioGroup>
        <RadioGroup defaultValue="email" disabled aria-label="Channel">
          <Radio value="email" />
          <Radio value="push" />
        </RadioGroup>
      </>
    ));
    const groups = html.match(/<div\b[^>]*role="radiogroup"[^>]*>/g)!;
    const controls = html.match(/<input\b[^>]*>/g)!;
    const names = controls.map((input) => input.match(/\sname="([^"]+)"/)![1]);

    expect(groups).toHaveLength(2);
    expect(controls).toHaveLength(4);
    expect(names[0]).toBeTruthy();
    expect(names[0]).toBe(names[1]);
    expect(names[2]).toBe(names[3]);
    expect(names[0]).not.toBe(names[2]);
    expect(groups[0]).toContain('data-orientation="vertical"');
    expect(groups[0]).toContain('aria-orientation="vertical"');
    expect(groups[0]).toContain('aria-required="true"');
    expect(groups[1]).toContain('aria-disabled="true"');
    expect(controls[0]).toMatch(/\schecked(?:[\s=>]|$)/);
    expect(controls[1]).not.toMatch(/\schecked(?:[\s=>]|$)/);
    expect(controls[0]).toMatch(/\srequired(?:[\s=>]|$)/);
    expect(controls[2]).toMatch(/\sdisabled(?:[\s=>]|$)/);
    expect(controls[3]).toMatch(/\sdisabled(?:[\s=>]|$)/);
    expect(
      groups.every(
        (tag) => !/\s(?:name|value|defaultValue|disabled|required)(?:[\s=>]|$)/i.test(tag),
      ),
    ).toBe(true);
  });
});
