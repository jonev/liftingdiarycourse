# Data Fetching Guidelines

## 🚨 CRITICAL RULES

**These rules are MANDATORY and MUST be followed without exception:**

1. **ALL data fetching MUST be done in Server Components** - Never in route handlers, never in client components
2. **ALL database queries MUST use helper functions in `/data` directory** - These functions use Drizzle ORM
3. **NO RAW SQL** - Always use Drizzle ORM query builder
4. **User data isolation is CRITICAL** - Users can ONLY access their own data, never another user's data

Violating these rules creates security vulnerabilities and architectural inconsistencies.

---

## Architecture Overview

### Server Components for Data Fetching

All data fetching happens in **React Server Components** (RSC). This provides:
- **Security**: Server-side authentication checks before data access
- **Performance**: Data fetching happens on the server, closer to the database
- **Type Safety**: Full TypeScript support with Drizzle ORM
- **Simplicity**: No need for API routes or client-side state management

### Data Layer Structure

```
/data
  ├── workouts.ts       # Workout-related queries
  ├── exercises.ts      # Exercise-related queries
  └── user-profile.ts   # User profile queries
```

Each file exports async functions that:
1. Authenticate the current user via Clerk
2. Query the database using Drizzle ORM
3. Filter results to only the authenticated user's data
4. Return type-safe results

---

## ✅ CORRECT Pattern: Server Component Data Fetching

### Example Server Component

```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  // 1. Authenticate the user
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Fetch user's data via helper function
  const workouts = await getWorkouts(userId);

  // 3. Render the data
  return (
    <div>
      <h1>My Workouts</h1>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>{workout.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example Data Helper Function

```typescript
// data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  // CRITICAL: Always filter by userId to ensure data isolation
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

export async function getWorkoutById(workoutId: string, userId: string) {
  // CRITICAL: Always verify the workout belongs to the user
  const result = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId))
    .where(eq(workouts.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function createWorkout(
  userId: string,
  data: { name: string; description?: string }
) {
  // CRITICAL: Always set userId when creating records
  const result = await db
    .insert(workouts)
    .values({
      ...data,
      userId, // MUST include userId
    })
    .returning();

  return result[0];
}

export async function deleteWorkout(workoutId: string, userId: string) {
  // CRITICAL: Always verify ownership before deletion
  return await db
    .delete(workouts)
    .where(eq(workouts.id, workoutId))
    .where(eq(workouts.userId, userId));
}
```

---

## ❌ INCORRECT Patterns (NEVER DO THIS)

### ❌ WRONG: Fetching Data in Client Components

```typescript
// ❌ NEVER DO THIS
"use client";

import { useEffect, useState } from "react";

export default function WorkoutsList() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // ❌ This is wrong - no data fetching in client components
    fetch("/api/workouts")
      .then((res) => res.json())
      .then(setWorkouts);
  }, []);

  return <div>{/* ... */}</div>;
}
```

**Why this is wrong:**
- Violates the server-only data fetching rule
- Creates unnecessary API route
- Adds complexity with client state management
- Potential security issues with client-side auth

### ❌ WRONG: Creating API Route Handlers for Data

```typescript
// ❌ NEVER DO THIS
// app/api/workouts/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  // ❌ This is wrong - use server components instead
  const workouts = await db.select().from(workouts);
  return NextResponse.json(workouts);
}
```

**Why this is wrong:**
- Unnecessary route handler when server components can fetch directly
- Adds extra HTTP roundtrip
- More code to maintain
- No benefit over server component approach

### ❌ WRONG: Using Raw SQL

```typescript
// ❌ NEVER DO THIS
// data/workouts.ts
import { db } from "@/lib/db";

export async function getWorkouts(userId: string) {
  // ❌ NO RAW SQL - use Drizzle ORM
  const result = await db.execute(
    `SELECT * FROM workouts WHERE user_id = '${userId}'`
  );
  return result.rows;
}
```

**Why this is wrong:**
- SQL injection vulnerability
- No type safety
- Loses benefits of Drizzle ORM
- Harder to maintain

### ❌ WRONG: Missing User Data Isolation

```typescript
// ❌ NEVER DO THIS
// data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutById(workoutId: string) {
  // ❌ CRITICAL SECURITY FLAW: No userId check!
  // Any user could access any workout by ID
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId))
    .limit(1);
}
```

**Why this is wrong:**
- **CRITICAL SECURITY VULNERABILITY**: Users can access other users' data
- Violates data isolation requirement
- Potential data breach

---

## Security Checklist for Data Helper Functions

Every data helper function MUST:

- [ ] Accept `userId` as a parameter (usually first parameter)
- [ ] Filter queries by `userId` using `eq(table.userId, userId)`
- [ ] For updates/deletes, verify ownership with `where(eq(table.userId, userId))`
- [ ] For inserts, always include `userId` in the values
- [ ] Use Drizzle ORM - NO raw SQL
- [ ] Return type-safe results (inferred from Drizzle schema)

---

## Passing Data to Client Components

When you need interactivity (like forms or buttons), **fetch data in the Server Component** and pass it as props to Client Components:

```typescript
// app/workouts/[id]/page.tsx (Server Component)
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { WorkoutEditor } from "@/components/workout-editor";

export default async function WorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch in server component
  const workout = await getWorkoutById(params.id, userId);

  if (!workout) {
    redirect("/dashboard");
  }

  // Pass data to client component as props
  return <WorkoutEditor workout={workout} />;
}
```

```typescript
// components/workout-editor.tsx (Client Component)
"use client";

import { useState } from "react";

type Workout = {
  id: string;
  name: string;
  description: string | null;
};

export function WorkoutEditor({ workout }: { workout: Workout }) {
  const [name, setName] = useState(workout.name);

  // Client component handles UI interactivity
  // Server component handled data fetching

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* ... */}
    </form>
  );
}
```

---

## Server Actions for Mutations

For data mutations (create, update, delete), use **Server Actions** called from Client Components:

```typescript
// app/actions/workouts.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createWorkout, deleteWorkout } from "@/data/workouts";

export async function createWorkoutAction(formData: FormData) {
  // 1. Authenticate
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 2. Validate input
  const name = formData.get("name") as string;
  if (!name) {
    throw new Error("Name is required");
  }

  // 3. Call data helper
  const workout = await createWorkout(userId, { name });

  // 4. Revalidate cache
  revalidatePath("/dashboard");

  return workout;
}

export async function deleteWorkoutAction(workoutId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // CRITICAL: userId ensures user can only delete their own workouts
  await deleteWorkout(workoutId, userId);

  revalidatePath("/dashboard");
}
```

```typescript
// components/workout-form.tsx
"use client";

import { createWorkoutAction } from "@/app/actions/workouts";

export function WorkoutForm() {
  return (
    <form action={createWorkoutAction}>
      <input name="name" required />
      <button type="submit">Create Workout</button>
    </form>
  );
}
```

---

## Summary

| Task | Where | How |
|------|-------|-----|
| **Read data** | Server Component | Call `/data` helper functions |
| **Display data** | Server Component | Render directly, or pass props to Client Components |
| **Mutate data** | Server Action | Called from Client Component forms/buttons |
| **Database queries** | `/data` helpers | Drizzle ORM only, always filter by `userId` |

**Remember:**
- ✅ Server Components for data fetching
- ✅ `/data` helpers with Drizzle ORM
- ✅ Always filter by `userId`
- ❌ No route handlers for data
- ❌ No client-side fetching
- ❌ No raw SQL
