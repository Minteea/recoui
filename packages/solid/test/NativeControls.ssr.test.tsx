import { renderToString } from "solid-js/web";
import { describe, expect, it } from "vitest";
import { Checkbox, Meter, Progress, Radio, Range, Select } from "~";

describe("native controls server rendering", () => {
  it("renders native elements, caller-provided options and fallback content without wrappers", () => {
    const html = renderToString(() => (
      <>
        <Checkbox name="active" checked />
        <Radio name="plan" value="basic" />
        <Range min="0" max="20" value="10" style={{ "--ui-slider-position": "50%" }} />
        <Select name="team" variant="filled" radius="rounded" width="block">
          <optgroup label="团队">
            <option value="design">设计</option>
            <option value="engineering">研发</option>
          </optgroup>
        </Select>
        <Progress max={100}>上传中</Progress>
        <Meter min={0} max={100} value={40} low={30} high={80} optimum={60}>
          40%
        </Meter>
      </>
    ));

    expect(html.match(/<input\b/g)).toHaveLength(3);
    expect(html.match(/<select\b/g)).toHaveLength(1);
    expect(html.match(/<option\b/g)).toHaveLength(2);
    expect(html.match(/<optgroup\b/g)).toHaveLength(1);
    expect(html.match(/<progress\b/g)).toHaveLength(1);
    expect(html.match(/<meter\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/<(?:div|span|button)\b/);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('type="radio"');
    expect(html).toContain('type="range"');
    expect(html).toContain('data-radius="rounded"');
    expect(html).toContain('data-width="block"');
    expect(html).toContain("--ui-slider-position:50%");
    expect(html).toContain("上传中");
    expect(html).toContain("40%");
    expect(html.match(/<progress\b[^>]*>/)?.[0]).not.toContain("value=");
    expect(html.match(/<meter\b[^>]*>/)?.[0]).toContain('value="40"');
    expect(html).not.toContain("attr:");
  });
});
