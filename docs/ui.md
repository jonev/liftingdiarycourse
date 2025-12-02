# UI Coding Standards

This document outlines the strict UI coding standards and guidelines for the Lifting Diary Course project. **All contributors must adhere to these standards without exception.**

---

## Component Library

### shadcn/ui - The ONLY Allowed Component Library

**CRITICAL RULE**: This project uses **shadcn/ui** components exclusively for all UI elements.

#### Strict Guidelines:

1. **ONLY use shadcn/ui components** for all UI needs
2. **ABSOLUTELY NO custom components** should be created
3. **DO NOT** build custom buttons, inputs, cards, dialogs, or any other UI elements from scratch
4. **DO NOT** use any other UI libraries (Material-UI, Ant Design, Chakra UI, etc.)
5. **DO NOT** create wrapper components around shadcn/ui components unless absolutely necessary for business logic

#### Installing shadcn/ui Components:

When you need a new UI component, install it from shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

**Examples:**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add calendar
npx shadcn@latest add form
```

#### Available shadcn/ui Components:

Always check the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for the full list of available components before attempting to build anything custom.

Common components include:
- **Layout**: Card, Separator, Tabs, Accordion
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Calendar, Form
- **Buttons**: Button, Toggle
- **Overlays**: Dialog, Sheet, Popover, Dropdown Menu, Context Menu, Alert Dialog
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Data Display**: Table, Badge, Avatar, Tooltip
- **Navigation**: Navigation Menu, Breadcrumb, Pagination
- And many more...

#### Component Usage Rules:

**CORRECT ✅**
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function WorkoutForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Workout name" />
        <Button>Save</Button>
      </CardContent>
    </Card>
  );
}
```

**INCORRECT ❌**
```tsx
// DO NOT create custom button components
export function CustomButton() {
  return <button className="custom-styles">Click me</button>;
}

// DO NOT create custom card components
export function CustomCard() {
  return <div className="rounded border p-4">{children}</div>;
}

// DO NOT create custom input components
export function CustomInput() {
  return <input className="custom-input-styles" />;
}
```

---

## Date Formatting Standards

### date-fns - The Official Date Library

**REQUIRED**: All date formatting must be done using the `date-fns` library.

#### Installation:

```bash
npm install date-fns
```

#### Standard Date Format

**Required Format**: Ordinal day + Short month + Full year

**Examples:**
- `1st Sep 2025`
- `2nd Aug 2025`
- `3rd Jan 2026`
- `4th Jun 2024`
- `21st Dec 2025`
- `22nd Nov 2024`
- `23rd Mar 2026`

#### Implementation:

**CORRECT ✅**
```tsx
import { format } from 'date-fns';

// Create a utility function for consistent date formatting
export function formatDate(date: Date): string {
  return format(date, 'do MMM yyyy');
}

// Usage in components
const displayDate = formatDate(new Date('2025-09-01')); // "1st Sep 2025"
const workoutDate = formatDate(workout.date); // "2nd Aug 2025"
```

**Common date-fns Format Patterns:**

| Pattern | Output | Use Case |
|---------|--------|----------|
| `do MMM yyyy` | `1st Sep 2025` | **PRIMARY - Use this everywhere** |
| `EEEE, do MMM yyyy` | `Monday, 1st Sep 2025` | Long format with day of week |
| `do MMMM yyyy` | `1st September 2025` | Full month name |
| `yyyy-MM-dd` | `2025-09-01` | Database/API dates |
| `HH:mm` | `14:30` | Time only |

#### Date Utility Functions:

Create a shared utility file for consistent date handling:

**`lib/date-utils.ts`**
```typescript
import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date in the standard format: "1st Sep 2025"
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided');
  }

  return format(dateObj, 'do MMM yyyy');
}

/**
 * Format a date with day of week: "Monday, 1st Sep 2025"
 */
export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided');
  }

  return format(dateObj, 'EEEE, do MMM yyyy');
}

/**
 * Format time only: "14:30"
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided');
  }

  return format(dateObj, 'HH:mm');
}
```

**INCORRECT ❌**
```tsx
// DO NOT use built-in JavaScript date methods
const date = new Date().toLocaleDateString(); // ❌
const date = new Date().toDateString(); // ❌

// DO NOT use template strings for dates
const date = `${day}/${month}/${year}`; // ❌

// DO NOT create inconsistent date formats
const date = format(new Date(), 'MM/DD/YYYY'); // ❌ Wrong format
const date = format(new Date(), 'DD-MM-YYYY'); // ❌ Wrong format
```

---

## General UI Guidelines

### Styling

1. **Use Tailwind CSS** for all styling needs
2. **Use shadcn/ui component variants** (e.g., `variant="outline"`, `size="lg"`)
3. **DO NOT** write custom CSS files unless absolutely necessary
4. **Use CSS variables** defined in `globals.css` for theme colors

### Consistency

1. **Import from the same location**: Always import components from `@/components/ui/[component]`
2. **Follow shadcn/ui patterns**: Use the same props and patterns as shown in shadcn/ui docs
3. **Maintain component composition**: Use Card, CardHeader, CardTitle, CardContent as designed

### Accessibility

1. shadcn/ui components are built with accessibility in mind
2. Always provide proper labels for form inputs
3. Use semantic HTML (buttons for actions, links for navigation)
4. Ensure proper keyboard navigation

---

## Examples

### Complete Form Example

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/date-utils";

export function WorkoutForm() {
  const today = formatDate(new Date()); // "1st Sep 2025"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Workout - {today}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Workout Name</Label>
          <Input id="name" placeholder="e.g., Chest Day" />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input id="duration" type="number" placeholder="60" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Workout</Button>
      </CardFooter>
    </Card>
  );
}
```

### Data Display Example

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date-utils";

export function WorkoutCard({ workout }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{workout.name}</CardTitle>
          <Badge>{workout.muscleGroup}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {formatDate(workout.date)}
        </p>
      </CardContent>
    </Card>
  );
}
```

---

## Enforcement

**These standards are non-negotiable.** Any code that violates these standards should be:
1. Rejected in code review
2. Refactored immediately if already merged

**Questions or exceptions?** Discuss with the team lead before implementing any deviations.

---

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [date-fns Documentation](https://date-fns.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
