# UX/UI Guidelines: Error Handling & Loading State Standards

**Date:** 2026-08-12  
**Scope:** `ssc-client` and `ssc-admin-web`  
**Supersedes:** Earlier sections in `2026-08-03-ux-architecture-and-standards/ux-ui-guidelines.md`

---

## 1. The Three States Every Data-Fetching Page Must Handle

Every page or section that makes an API call **must** handle all three states. This is non-negotiable for production quality.

| State | Rule |
|---|---|
| **Loading** | Render an animated `<Skeleton />` that matches the page's layout |
| **Error** | Render `<ErrorState />` with a retry button — **never** a plain text string |
| **Empty** | Render `<EmptyState />` with an icon, title, and optional CTA |

---

## 2. `<Skeleton />` — Loading States

**File:** `components/ui/skeleton.tsx` (both repos)

### Rules
- **Never** render plain text like `"Loading..."` or `"Loading data..."`.
- Skeletons must mirror the **shape and grid** of the actual loaded content.
- Example — a 4-column stat card grid should show 4 skeleton cards.

### Pattern (ssc-client, `useEffect` pages)
```tsx
if (loading) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}
```

### Pattern (ssc-admin-web, React Query pages)
```tsx
const { data, isLoading, isError, refetch } = useQuery({ ... });
if (isLoading) return <PageSkeleton />;
```

---

## 3. `<ErrorState />` — API Failure States

**File:** `components/ui/error-state.tsx` (both repos)  
**Status:** 🔴 To Be Created

### Props Interface
```ts
interface ErrorStateProps {
  icon?: LucideIcon;         // Default: ServerCrash
  title?: string;            // Default: "Something went wrong"
  description?: string;      // Default: "Please check your connection and try again."
  onRetry?: () => void;      // Shows "Try Again" button when provided
  fullPage?: boolean;        // Centers vertically in full-screen when true
}
```

### Design Spec (Client — "Floating Bento" Paradigm)
- Soft `bg-destructive/5` background tint
- `rounded-3xl` container
- Large centered `ServerCrash` or `WifiOff` icon in `text-destructive bg-destructive/10 rounded-full`
- Clear human-friendly title (`text-foreground`, bold)
- Short description (`text-muted-foreground`, max 2 lines)
- Animated "Try Again" button — triggers `onRetry` callback (re-calls the API)

### Design Spec (Admin — "Great Flattening" Paradigm)
- Flat `bg-destructive/5` card, `rounded-xl`, `border border-destructive/20`
- No glow/blur effects
- Same icon, title, description, retry button structure

### Pattern (ssc-client pages)
```tsx
const [error, setError] = useState(false);

// In catch:
} catch (e) {
  console.error(e);
  setError(true);
} finally {
  setLoading(false);
}

// In JSX:
if (error) return (
  <ErrorState
    title="Couldn't load your dashboard"
    description="There was a problem connecting to our servers."
    onRetry={() => { setError(false); setLoading(true); fetchData(); }}
  />
);
```

### Pattern (ssc-admin-web React Query pages)
```tsx
if (isError) return (
  <ErrorState
    title="Failed to load questions"
    onRetry={() => refetch()}
  />
);
```

---

## 4. `<EmptyState />` — Zero-Data States

**File:** `components/ui/empty-state.tsx` (ssc-client)  
**Status:** ✅ Complete and deployed

### Props Interface
```ts
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### When to Use
- API returned `[]` or `data.length === 0`
- Page has no content to display
- **Never** render raw text like `"No data found"` or `"Nothing here yet"`

---

## 5. Toast Notifications — Action Feedback

**Library:** `sonner` (already installed in both repos via `<Toaster />` in root layout)

### Rules
| Scenario | Correct Approach |
|---|---|
| Form submission success | `toast.success("Profile updated!")` |
| Form submission failure | `toast.error(error.response?.data?.message \|\| "Something went wrong.")` |
| Page-level GET failure | `<ErrorState />` component — NOT a toast |
| Payment/checkout error | `toast.error(...)` — user stays on page |
| `alert()` for errors | ❌ **Banned** in production. Always use `toast.error()` |

### Mutation pattern (correct)
```tsx
try {
  await api.post('/some-action', payload);
  toast.success("Action completed successfully!");
} catch (e: unknown) {
  const msg = (e as AxiosError<{ message: string }>)?.response?.data?.message;
  toast.error(msg || "Something went wrong. Please try again.");
}
```

---

## 6. Global Error Boundaries (ssc-client)

### `app/global-error.tsx`
Catches catastrophic root-level React render crashes. Renders a full-page fallback with a hard-reload button. **Required** for all Next.js production apps.

### `app/error.tsx`
Top-level route error boundary for all non-dashboard routes.

### `app/dashboard/error.tsx`
Already exists — catches render-level crashes in the dashboard segment.

### `app/not-found.tsx`
Branded 404 page. Shown for unmatched routes. Must match brand design (not the Next.js default).

---

## 7. Axios Interceptor Standard

**File:** `lib/axios.ts` (ssc-client)

The response interceptor **must** handle:
1. **401 Unauthorized** → Clear auth store and redirect to `/login`
2. **POST/PUT/DELETE failures** → Auto-fire `toast.error()` with server message or generic fallback
3. **503 Service Unavailable** → `toast.error("Server is temporarily unavailable. Please try again shortly.")`
4. **GET failures** → Do NOT toast — let the page's `<ErrorState />` handle it inline
