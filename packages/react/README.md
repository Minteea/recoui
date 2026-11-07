# @recoui/react

React components using `@recoui/style`. This package currently provides only `Button`.

Import the shared stylesheet once in your application:

```tsx
import "@recoui/style/style.css";
import { Button } from "@recoui/react";

<Button variant="filled" color="primary">
  Save
</Button>;
```

Run `pnpm --filter @recoui/react storybook` from the repository root to preview Button on port 36008.
