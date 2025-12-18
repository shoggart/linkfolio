# UI Components

Production-ready, reusable UI components built with TypeScript, Tailwind CSS, and class-variance-authority.

## Components

### Button

Versatile button component with multiple variants and loading state.

```tsx
import { Button } from '@/components/ui/button'

// Default variant
<Button>Click me</Button>

// Variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Input

Input field with label, error states, and helper text support.

```tsx
import { Input } from '@/components/ui/input'

// Basic usage
<Input label="Email" type="email" placeholder="you@example.com" />

// With error
<Input
  label="Password"
  type="password"
  error="Password is required"
/>

// With helper text
<Input
  label="Username"
  helperText="Only lowercase letters and numbers"
/>
```

### Card

Flexible card component with subcomponents for better composition.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

// Basic usage
<Card>
  <p>Card content</p>
</Card>

// With padding variants
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding (default)</Card>
<Card padding="lg">Large padding</Card>

// With subcomponents
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Modal

Animated modal dialog with framer-motion.

```tsx
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="Optional description"
      >
        <p>Modal content goes here</p>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

Features:
- Animated entrance/exit with framer-motion
- Backdrop overlay with blur effect
- Close on ESC key
- Click outside to close
- Prevents body scroll when open
- Accessible with ARIA attributes

### Skeleton

Loading skeleton for content placeholders.

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Basic usage
<Skeleton className="h-4 w-48" />
<Skeleton className="h-10 w-full" />
<Skeleton className="h-24 w-24 rounded-full" />

// Card skeleton example
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

## Loading States

Each dashboard page has a corresponding `loading.tsx` file that automatically displays while the page is loading:

- `/dashboard` - Main dashboard skeleton
- `/dashboard/links` - Links page skeleton
- `/dashboard/analytics` - Analytics page skeleton
- `/dashboard/settings` - Settings page skeleton
- `/dashboard/appearance` - Appearance page skeleton
- `/dashboard/billing` - Billing page skeleton

## Usage Tips

1. **Import from index**: Use the barrel export for cleaner imports
   ```tsx
   import { Button, Input, Card } from '@/components/ui'
   ```

2. **Combine with Tailwind**: All components accept `className` prop for custom styling
   ```tsx
   <Button className="mt-4 w-full">Custom Button</Button>
   ```

3. **Type Safety**: All components are fully typed with TypeScript
   ```tsx
   import type { ButtonProps } from '@/components/ui'
   ```

4. **Accessibility**: Components include proper ARIA attributes and keyboard support

## Dependencies

- `class-variance-authority` - For variant management
- `clsx` & `tailwind-merge` - For className handling
- `framer-motion` - For Modal animations
- `lucide-react` - For icons
