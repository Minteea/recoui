import { renderToString } from "solid-js/web";
import { describe, expect, it } from "vitest";
import { Checkbox, Input, NativeInput } from "~";

describe("Input and Checkbox server rendering", () => {
  it("renders native input attributes without serializing indeterminate", () => {
    const html = renderToString(() => (
      <>
        <NativeInput
          type="email"
          name="email"
          radius="rounded"
          width="12rem"
          value="hello@example.com"
        />
        <Checkbox name="selection" indeterminate checked />
      </>
    ));
    expect(html.match(/<input\b/g)).toHaveLength(2);
    expect(html).toContain('type="email"');
    expect(html).toContain('value="hello@example.com"');
    expect(html).toContain('data-radius="rounded"');
    expect(html).toContain('data-width="12rem"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("checked");
    expect(html).not.toContain("indeterminate=");
  });

  it("renders composite input appearance on its root and native attributes on its control", () => {
    const html = renderToString(() => (
      <Input
        id="email"
        type="email"
        name="email"
        placeholder="name@example.com"
        aria-describedby="email-help"
        value="hello@example.com"
        required
        color="success"
        variant="filled"
        radius="rounded"
        width="12rem"
        class="custom-input"
        leftSection={<strong>@</strong>}
        rightSection="mail"
      />
    ));
    const root = html.match(/<div\b[^>]*>/)![0];
    const control = html.match(/<input\b[^>]*>/)![0];
    expect(root).toContain('data-color="success"');
    expect(root).toContain('data-variant="filled"');
    expect(root).toContain('data-radius="rounded"');
    expect(root).toContain('data-width="12rem"');
    expect(root).toContain("ui-input custom-input");
    expect(root).not.toContain('id="email"');
    expect(root).not.toContain("placeholder=");
    expect(control).toContain('id="email"');
    expect(control).toContain('name="email"');
    expect(control).toContain('type="email"');
    expect(control).toContain('placeholder="name@example.com"');
    expect(control).toContain('aria-describedby="email-help"');
    expect(control).toContain('value="hello@example.com"');
    expect(control).toContain("required");
    expect(control).not.toContain("data-color=");
    expect(control).not.toContain("data-width=");
    expect(control).not.toContain("ui-input");
    expect(html.match(/<span\b/g)).toHaveLength(2);
    expect(html.indexOf("<strong>@</strong>")).toBeLessThan(html.indexOf("<input"));
    expect(html.indexOf("mail</span>")).toBeGreaterThan(html.indexOf("<input"));
    expect(html).not.toMatch(/\s(?:leftSection|rightSection|status)=/);
  });
});
