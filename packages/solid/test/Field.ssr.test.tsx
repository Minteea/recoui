import { renderToString } from "solid-js/web";
import { describe, expect, it } from "vitest";
import { Checkbox, Field, Input } from "~";

describe("Field server rendering", () => {
  it("renders the vertical field structure for existing lowercase content props", () => {
    const html = renderToString(() => (
      <Field
        label="Name"
        description="Your display name"
        labelProps={{ for: "name" }}
        descriptionProps={{ id: "name-description" }}
      >
        <Input id="name" name="name" aria-describedby="name-description" />
      </Field>
    ));

    expect(html.indexOf("ui-field-label")).toBeLessThan(html.indexOf("<input"));
    expect(html.indexOf("<input")).toBeLessThan(html.indexOf("ui-field-description"));
    expect(html).toContain('for="name"');
    expect(html).toContain('aria-describedby="name-description"');
    expect(html).not.toContain("ui-field-content");
    expect(html).not.toContain("data-orientation=");
  });

  it("renders horizontal controls before grouped JSX labels and descriptions", () => {
    const html = renderToString(() => (
      <Field
        horizontal
        Label={<strong>Updates</strong>}
        Description={
          <span>
            Read <a href="#help">help</a>
          </span>
        }
        labelProps={{ for: "updates" }}
        descriptionProps={{ id: "updates-description" }}
      >
        <Checkbox id="updates" name="updates" checked aria-describedby="updates-description" />
      </Field>
    ));

    expect(html).toContain('data-orientation="horizontal"');
    expect(html.indexOf("<input")).toBeLessThan(html.indexOf("ui-field-content"));
    expect(html.indexOf("ui-field-content")).toBeLessThan(html.indexOf("ui-field-label"));
    expect(html.indexOf("ui-field-label")).toBeLessThan(html.indexOf("ui-field-description"));
    expect(html).toContain("<strong>Updates</strong>");
    expect(html).toContain('<a href="#help">help</a>');
    expect(html).toContain('for="updates"');
    expect(html).toContain('id="updates-description"');
    expect(html).not.toMatch(/\s(?:horizontal|orientation|Label|Description)=/i);
  });
});
