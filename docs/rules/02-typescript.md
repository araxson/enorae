# TypeScript Type Safety

**Purpose:** Enforce strict type safety, leverage TypeScript 5.x features, and integrate with Supabase generated types.

**Last Updated:** 2025-11-03
**Stack Version:** TypeScript 5.9.2+ (ES2022 target)

## Recent Updates (2025-11-03)

**NEW: Advanced Type-Level Programming Patterns:**
- Branded types for runtime safety and domain modeling
- Phantom types for compile-time state tracking
- Distributive conditional types with detailed examples
- Mapped type modifiers (-?, +readonly) for precise type transformations
- Variance annotations (in/out) for safer generic constraints
- Type-safe query builder pattern with builder API
- Type-safe routing helpers with path parameter extraction
- Assertion functions for type narrowing

**NEW: Performance Optimization Patterns:**
- Batched inference for recursive types (reduces recursion depth)
- Tail-call optimization patterns for type recursion
- tsconfig performance tuning for large codebases
- Type instantiation depth management
- Avoiding expensive recursive type computations

**NEW: Advanced String Manipulation Types:**
- Deep property access with type inference (PropType pattern)
- String case conversion (SnakeToPascalCase, SnakeToCamelCase)
- Type-safe string joining with delimiter support
- Version number parsing and validation
- Pattern extraction with multiple inference branches

**Verified Current Best Practices (2025-01-03):**
- All strict mode flags remain required and current
- `const` type parameters continue to preserve literal types in TS 5.9.2
- `satisfies` operator usage patterns confirmed as best practice
- Template literal types enhanced with better inference

---

## Quick Decision Tree

```
Need to handle unknown data? → Use `unknown`, NOT `any`
├─ Type from Supabase? → Import from `Database` types
├─ Type from Zod schema? → Use `z.infer<typeof schema>`
├─ Need type guard? → Create `(x): x is Type` function
└─ Need generic? → Constrain with `extends`, use `const` for literals

Should I use type or interface?
├─ Simple object shape → Use `type`
├─ Need to extend/implement → Use `interface`
├─ Union/intersection → Use `type`
└─ Database types → ALWAYS import from generated types

Property optional vs nullable?
├─ Might not exist → `prop?: Type`
├─ Exists but can be null → `prop: Type | null`
└─ Both → `prop?: Type | null`
```

---

## Critical Rules

### ✅ MUST Follow

1. **Strict mode REQUIRED** - All tsconfig strict flags must be enabled
2. **Never use `any`** - Use `unknown` for truly unknown types, then narrow
3. **Import Supabase types** - Never hand-write database types
4. **Infer from Zod schemas** - Single source of truth for validation types
5. **Explicit return types** - All exported functions must declare return types
6. **Type-only imports** - Use `import type` for type imports
7. **No type suppressions** - Never use `@ts-ignore` or `@ts-expect-error`

### ❌ FORBIDDEN

1. **`any` type** - Use `unknown` instead
2. **Type assertions without guards** - No `as Type` without validation
3. **Non-null assertions** - No `!.` or `!!` without clear justification
4. **Hand-written database types** - Must use Supabase generated types
5. **Duplicate type definitions** - Infer from schemas or database types
6. **Implicit `any`** - All parameters and returns must be typed
7. **Enums for string unions** - Use literal unions instead

---

## Patterns

### Pattern 1: Strict tsconfig.json Configuration (with Performance Tuning)
**When to use:** Every TypeScript project initialization or configuration update

**Implementation:**
```json
// ✅ CORRECT - Required strict configuration with performance optimization
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",

    // Strict type checking (ALL REQUIRED)
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Additional strict checks (ALL REQUIRED)
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,
    "useUnknownInCatchVariables": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    // Build settings
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    // Performance tuning for large codebases
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",

    // Type instantiation depth (default: 50, increase if needed)
    // "recursionDepth": 50,  // Uncomment if hitting "excessively deep" errors

    // Path mapping (improves import resolution)
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/lib/*": ["lib/*"],
      "@/features/*": ["features/*"]
    },

    "types": ["@types/node", "@types/react"]
  },

  // Performance: Exclude unnecessary files
  "exclude": [
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],

  // Performance: Only include relevant files
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.d.ts"
  ]
}

// ❌ WRONG - Missing strict flags
{
  "compilerOptions": {
    "strict": true
    // Missing noUncheckedIndexedAccess, useUnknownInCatchVariables, etc.
  }
}

// ❌ WRONG - No performance optimization
{
  "compilerOptions": {
    // ... strict flags ...
    // Missing: incremental, tsBuildInfoFile, exclude patterns
  }
}
```

**Performance Tips:**
- **`incremental: true`** - Saves compilation state between runs (2-5x faster rebuilds)
- **`skipLibCheck: true`** - Skips type checking of .d.ts files (significant speedup)
- **Exclude patterns** - Prevent TypeScript from checking unnecessary files
- **Path mapping** - Improves module resolution performance
- **`tsBuildInfoFile`** - Stores incremental state (commit to .gitignore)

**Large Codebase Tuning:**
For projects with 10,000+ TypeScript files:
```json
{
  "compilerOptions": {
    // Enable project references for monorepos
    "composite": true,
    "declarationMap": true,

    // Disable unused local checks for faster compilation
    "noUnusedLocals": false,
    "noUnusedParameters": false,

    // Consider looser moduleResolution if needed
    "moduleResolution": "node"
  }
}
```

**Rationale:** Strict mode catches potential runtime errors at compile time. `noUncheckedIndexedAccess` prevents undefined access bugs, `useUnknownInCatchVariables` enforces error handling safety. Performance tuning is critical for large codebases to maintain developer productivity.

---

### Pattern 2: unknown vs any - Type Safety
**When to use:** Handling data from external sources (API responses, user input, JSON parsing)

**Implementation:**
```typescript
// ✅ CORRECT - Use unknown and narrow with type guards
async function fetchUserData(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data: unknown = await response.json();

  // Type guard for validation
  if (!isValidUser(data)) {
    throw new Error('Invalid user data');
  }

  return data; // Now typed as User
}

function isValidUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    typeof value.id === 'string' &&
    typeof value.email === 'string'
  );
}

// ❌ WRONG - Using any bypasses type safety
async function fetchUserDataBad(id: string): Promise<any> {
  const response = await fetch(`/api/users/${id}`);
  return response.json(); // No validation, runtime errors likely
}

// ❌ WRONG - Type assertion without validation
async function fetchUserDataUnsafe(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return (await response.json()) as User; // Unsafe cast
}
```

**Rationale:** `unknown` forces explicit type checking before use, preventing runtime errors. `any` disables type checking entirely.

---

### Pattern 3: Supabase Database Types Integration
**When to use:** Every database query, mutation, or type reference

**Implementation:**
```typescript
// ✅ CORRECT - Import from generated types
import type { Database } from '@/lib/types/database.types';

// Views for read operations
export type AppointmentRow = Database['public']['Views']['appointments_view']['Row'];
export type StaffRow = Database['public']['Views']['staff_view']['Row'];

// Tables for write operations
export type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert'];
export type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update'];

// Typed query function
export async function getAppointments(
  businessId: string
): Promise<AppointmentRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('business_id', businessId)
    .returns<AppointmentRow[]>(); // Explicit type

  if (error) throw error;
  return data;
}

// ❌ WRONG - Hand-written database types
interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  // These will drift from actual schema!
}

// ❌ WRONG - No type on query result
export async function getAppointmentsBad(businessId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('business_id', businessId);
  // data is 'any', no type safety

  if (error) throw error;
  return data;
}
```

**Rationale:** Generated types stay in sync with database schema. Hand-written types drift over time.

---

### Pattern 4: Zod Schema Type Inference
**When to use:** Form validation, API input validation, any runtime data validation

**Implementation:**
```typescript
// ✅ CORRECT - Single source of truth
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Infer TypeScript type from schema
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

// Use inferred type in function signature
export async function createAppointment(
  input: CreateAppointmentInput
): Promise<AppointmentRow> {
  // Validation happens at runtime
  const validated = createAppointmentSchema.parse(input);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('appointments')
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ❌ WRONG - Duplicate type definition
const schema = z.object({
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
});

interface CreateInput {
  customerId: string;
  serviceId: string;
}
// Now schema and interface can drift!

// ❌ WRONG - Manually typing what Zod already knows
function create(input: { customerId: string; serviceId: string }) {
  const validated = schema.parse(input); // Redundant typing
}
```

**Rationale:** Schema is runtime validation, type is compile-time. Inferring from schema keeps them synchronized.

---

### Pattern 5: Type Guards for Runtime Safety
**When to use:** Narrowing `unknown` types, validating external data, discriminated unions

**Implementation:**
```typescript
// ✅ CORRECT - User-defined type guard
interface SuccessResponse {
  status: 'success';
  data: unknown;
}

interface ErrorResponse {
  status: 'error';
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function isSuccessResponse(
  response: ApiResponse
): response is SuccessResponse {
  return response.status === 'success';
}

function handleResponse(response: ApiResponse) {
  if (isSuccessResponse(response)) {
    console.log('Data:', response.data); // Type narrowed
  } else {
    console.error('Error:', response.message); // Type narrowed
  }
}

// ✅ CORRECT - Type guard with typeof
function processValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase(); // value is string
  }
  if (typeof value === 'number') {
    return value.toString(); // value is number
  }
  throw new Error('Invalid value type');
}

// ✅ CORRECT - Type guard with instanceof
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// ❌ WRONG - No type guard, unsafe assertion
function handleResponseBad(response: unknown) {
  const typed = response as ApiResponse; // Unsafe!
  console.log(typed.status); // May crash at runtime
}

// ❌ WRONG - Using any instead of type guard
function processValueBad(value: any) {
  return value.toUpperCase(); // May crash if not string
}
```

**Rationale:** Type guards provide runtime validation that TypeScript can track, ensuring type safety.

---

### Pattern 6: Utility Types (Pick, Omit, Partial, etc.)
**When to use:** Deriving types from existing types without duplication

**Implementation:**
```typescript
// ✅ CORRECT - Using built-in utility types
interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

// Pick specific properties
type UserPublic = Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;

// Omit sensitive properties
type UserSafe = Omit<User, 'password'>;

// Make all properties optional
type UserPartial = Partial<User>;

// Make all properties required
type UserRequired = Required<UserPartial>;

// Make all properties readonly
type UserImmutable = Readonly<User>;

// Record type for key-value maps
type UserMap = Record<string, User>;

// Awaited type for promises
type ResolvedUser = Awaited<Promise<User>>;

// ReturnType for function return types
async function getUser(): Promise<User> {
  // ...
  return {} as User;
}
type GetUserReturn = ReturnType<typeof getUser>; // Promise<User>

// ✅ CORRECT - Combining utility types
type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;

// ❌ WRONG - Duplicating type definitions
interface UserPublicBad {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Duplicates User properties, will drift
}

// ❌ WRONG - Manual property selection
type UserSafeBad = {
  id: User['id'];
  email: User['email'];
  firstName: User['firstName'];
  lastName: User['lastName'];
  createdAt: User['createdAt'];
  // Verbose and error-prone
};
```

**Rationale:** Utility types derive types programmatically, ensuring consistency when source types change.

---

### Pattern 7: Generic Functions and Components
**When to use:** Reusable logic that works with multiple types

**Implementation:**
```typescript
// ✅ CORRECT - Generic function with constraint
interface Identifiable {
  id: string;
}

function findById<T extends Identifiable>(
  items: T[],
  id: string
): T | undefined {
  return items.find((item) => item.id === id);
}

// Type is inferred from usage
const appointment = findById(appointments, '123'); // AppointmentRow | undefined
const staff = findById(staffMembers, '456'); // StaffRow | undefined

// ✅ CORRECT - Generic with const type parameters (TypeScript 5.x)
function tuple<const T extends readonly unknown[]>(...items: T): T {
  return items;
}

const result = tuple('open', 42, { status: 'ok' });
// Type: readonly ['open', 42, { status: 'ok' }] - Literals preserved!

// ✅ CORRECT - Generic React component
interface ListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}

export function List<T>({
  items,
  keyExtractor,
  renderItem,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage with type inference
<List
  items={appointments}
  keyExtractor={(apt) => apt.id}
  renderItem={(apt) => <span>{apt.scheduled_at}</span>}
/>

// ❌ WRONG - No generic constraint
function findByIdBad<T>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
  // Error: Property 'id' does not exist on type 'T'
}

// ❌ WRONG - Overly permissive constraint
function findByIdLoose<T extends object>(items: T[], id: string) {
  return items.find((item) => item.id === id);
  // Still errors - object doesn't guarantee 'id' property
}
```

**Rationale:** Generics enable type-safe reusable code. Constraints ensure generic types have required properties.

---

### Pattern 8: Discriminated Unions for State Management
**When to use:** Modeling mutually exclusive states (loading, success, error)

**Implementation:**
```typescript
// ✅ CORRECT - Discriminated union with type narrowing
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: string;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>): React.ReactNode {
  switch (state.status) {
    case 'loading':
      return <Spinner />; // state is LoadingState
    case 'success':
      return <Data value={state.data} />; // state is SuccessState<T>
    case 'error':
      return <Error message={state.error} />; // state is ErrorState
  }
}

// ✅ CORRECT - Type-safe state transitions
function transitionToSuccess<T>(data: T): SuccessState<T> {
  return { status: 'success', data };
}

// ❌ WRONG - Boolean flags instead of discriminated union
interface StateBad<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}
// Problem: Can be { loading: true, error: 'oops', data: {...} } - invalid state!

function renderStateBad<T>(state: StateBad<T>) {
  if (state.loading) return <Spinner />;
  if (state.error) return <Error message={state.error} />;
  if (state.data) return <Data value={state.data} />;
  // Can have multiple branches true simultaneously
}
```

**Rationale:** Discriminated unions make impossible states unrepresentable, eliminating entire classes of bugs.

---

### Pattern 9: Literal Unions Over Enums
**When to use:** String or number constants, status values, configuration options

**Implementation:**
```typescript
// ✅ CORRECT - Literal union type
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type UserRole = 'admin' | 'business' | 'staff' | 'customer';

// Use with satisfies for type safety without widening
const defaultStatus = 'pending' satisfies AppointmentStatus;
// defaultStatus is still 'pending' (literal), not AppointmentStatus

// Type-safe function with literal union
function updateStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> {
  // Implementation
  return Promise.resolve();
}

updateStatus('123', 'confirmed'); // ✅ Valid
updateStatus('123', 'invalid'); // ❌ Type error

// ✅ CORRECT - Extract literal values for runtime use
const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
];

// ❌ WRONG - Using enum (adds runtime code, worse tree-shaking)
enum AppointmentStatusEnum {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no_show',
}

function updateStatusBad(
  appointmentId: string,
  status: AppointmentStatusEnum
) {
  // Enums compile to JavaScript objects, increasing bundle size
}

// ❌ WRONG - Using const enum (better, but still avoid)
const enum AppointmentStatusConst {
  Pending = 'pending',
  Confirmed = 'confirmed',
}
// Better than regular enum, but literal unions are preferred
```

**Rationale:** Literal unions are pure TypeScript (zero runtime cost), have better tooling support, and work seamlessly with Supabase types.

---

### Pattern 10: Template Literal Types for String Patterns
**When to use:** Type-safe string patterns, route paths, cache keys, event names

**Implementation:**
```typescript
// ✅ CORRECT - Template literal types for type safety
type CacheTag =
  | 'appointments'
  | `appointments:${string}`
  | 'staff'
  | `staff:${string}`;

function revalidate(tag: CacheTag): void {
  revalidateTag(tag);
}

revalidate('appointments'); // ✅ Valid
revalidate('appointments:123'); // ✅ Valid
revalidate('users:123'); // ❌ Type error

// ✅ CORRECT - Type-safe route paths
type UserPath = `/users/${string}`;
type AppointmentPath = `/appointments/${string}`;
type ApiPath = `/api${string}`;

function navigate(path: UserPath | AppointmentPath): void {
  // Implementation
}

navigate('/users/123'); // ✅ Valid
navigate('/appointments/456'); // ✅ Valid
navigate('/settings'); // ❌ Type error

// ✅ CORRECT - Event names with capitalization
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<'click'>; // 'onClick'
type ChangeEvent = EventName<'change'>; // 'onChange'

// ✅ CORRECT - Combining with mapped types
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }

// ❌ WRONG - Using plain string type
function revalidateBad(tag: string): void {
  revalidateTag(tag); // No type safety
}

revalidateBad('anything'); // No error, but might be invalid tag
```

**Rationale:** Template literal types provide compile-time validation for string patterns without runtime overhead.

---

### Pattern 10b: Advanced Template Literal Patterns (String Parsing)
**When to use:** Type-safe string parsing, extracting data from structured strings, version numbers

**Implementation:**
```typescript
// ✅ CORRECT - Deep property access with template literals
type PropType<T, Path extends string> =
  string extends Path ? unknown :
  Path extends keyof T ? T[Path] :
  Path extends `${infer K}.${infer R}` ? K extends keyof T ? PropType<T[K], R> : unknown :
  unknown;

function getProp<T, P extends string>(obj: T, path: P): PropType<T, P> {
  const keys = path.split('.');
  let result: any = obj;
  for (const key of keys) {
    result = result?.[key];
  }
  return result;
}

const user = { profile: { name: 'Alice', age: 30 } };
const name = getProp(user, 'profile.name'); // Type: string
const age = getProp(user, 'profile.age'); // Type: number
const invalid = getProp(user, 'profile.invalid'); // Type: unknown

// ✅ CORRECT - Version number parsing
type Version = `${number}.${number}.${number}`;

function parseVersion(version: Version): [number, number, number] {
  const parts = version.split('.').map(Number);
  return [parts[0]!, parts[1]!, parts[2]!];
}

parseVersion('1.2.3'); // ✅ Valid
parseVersion('1.2'); // ❌ Type error - must be x.y.z format

// ✅ CORRECT - Pattern matching with inference
type ExtractInner<T> = T extends `*${infer U}*` ? U : never;

type T1 = ExtractInner<'*hello*'>; // 'hello'
type T2 = ExtractInner<'**world**'>; // '*world*'
type T3 = ExtractInner<'invalid'>; // never

function unwrap<T extends string>(str: `*${T}*`): T {
  return str.slice(1, -1) as T;
}

const result = unwrap('*content*'); // Type: 'content'

// ✅ CORRECT - Recursive string splitting (performance optimized)
type Split<S extends string, D extends string> =
  string extends S ? string[] :
  S extends `${infer Head}${D}${infer Tail}` ? [Head, ...Split<Tail, D>] :
  S extends '' ? [] :
  [S];

type PathParts = Split<'user.profile.name', '.'>; // ['user', 'profile', 'name']

// ⚠️ PERFORMANCE - For long strings, use batched inference
type Chars<S extends string> =
  string extends S ? string[] :
  // Check 10 characters at once to reduce recursion depth
  S extends `${infer C0}${infer C1}${infer C2}${infer C3}${infer C4}${infer C5}${infer C6}${infer C7}${infer C8}${infer C9}${infer R}`
    ? [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, ...Chars<R>] :
  S extends `${infer C}${infer R}` ? [C, ...Chars<R>] :
  S extends '' ? [] :
  never;

type Letters = Chars<'Hello'>; // ['H', 'e', 'l', 'l', 'o']

// ❌ WRONG - Plain string type loses type safety
function getPropBad(obj: any, path: string): any {
  // No type checking on path or return value
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
```

**Rationale:** Template literal types enable powerful compile-time string parsing and validation. Batched inference (checking multiple characters at once) reduces recursion depth for better performance with long strings.

---

### Pattern 11: Type Inference vs Explicit Types
**When to use:** Balance between conciseness and clarity

**Implementation:**
```typescript
// ✅ CORRECT - Let TypeScript infer simple types
const count = 42; // inferred as number
const message = 'Hello'; // inferred as string
const isActive = true; // inferred as boolean

// ✅ CORRECT - Infer from function calls
const appointments = await getAppointments(businessId);
// Type inferred from getAppointments return type

// ✅ CORRECT - Explicit types for function signatures (REQUIRED)
export async function getAppointments(
  businessId: string
): Promise<AppointmentRow[]> {
  // Explicit return type for exported functions
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('business_id', businessId)
    .returns<AppointmentRow[]>();

  if (error) throw error;
  return data;
}

// ✅ CORRECT - Explicit types for complex objects
const config: DatabaseConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  ssl: true,
};

// ✅ CORRECT - Use satisfies for type checking without widening
const metadata = {
  title: 'Appointments',
  description: 'Manage your schedule',
  keywords: ['booking', 'schedule'],
} satisfies Record<string, string | string[]>;

// metadata.title is still 'Appointments' (literal), not string

// ❌ WRONG - Redundant explicit types for simple values
const count: number = 42; // Unnecessary
const message: string = 'Hello'; // Unnecessary

// ❌ WRONG - Missing return type on exported function
export async function getAppointmentsBad(businessId: string) {
  // No return type - hard to understand API
  const supabase = await createClient();
  const { data } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('business_id', businessId);
  return data;
}

// ❌ WRONG - Over-specifying when inference works
const appointments: AppointmentRow[] = await getAppointments(businessId);
// Return type already known, this is redundant
```

**Rationale:** Infer simple types for conciseness, explicitly type function signatures and complex objects for clarity.

---

### Pattern 12: Handling Errors with unknown
**When to use:** Every catch block, error handling logic

**Implementation:**
```typescript
// ✅ CORRECT - Use unknown in catch, narrow with type guard
async function fetchData(id: string): Promise<Data> {
  try {
    const response = await fetch(`/api/data/${id}`);
    return await response.json();
  } catch (error: unknown) {
    // Must narrow unknown before use
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }

    if (typeof error === 'string') {
      console.error('String error:', error);
      throw new Error(error);
    }

    // Fallback for truly unknown errors
    console.error('Unknown error:', error);
    throw new Error('An unknown error occurred');
  }
}

// ✅ CORRECT - Reusable error handling utility
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unknown error occurred';
}

// Usage
try {
  await riskyOperation();
} catch (error: unknown) {
  toast.error(getErrorMessage(error));
}

// ❌ WRONG - Catching as any
try {
  await riskyOperation();
} catch (error: any) {
  console.error(error.message); // Unsafe access
}

// ❌ WRONG - Assuming error is Error type
try {
  await riskyOperation();
} catch (error) { // Implicitly 'any' if useUnknownInCatchVariables is false
  throw new Error(error.message); // Unsafe
}
```

**Rationale:** With `useUnknownInCatchVariables: true`, catch clauses receive `unknown`, forcing safe error handling.

---

### Pattern 13: Branded Types for Runtime Safety
**When to use:** Distinguishing values with identical runtime types but different semantic meanings (user IDs vs business IDs, validated vs unvalidated strings)

**Implementation:**
```typescript
// ✅ CORRECT - Branded types prevent mixing incompatible values
declare const brand: unique symbol;

type Brand<T, TBrand> = T & { [brand]: TBrand };

// Create branded types for different ID types
type UserId = Brand<string, 'UserId'>;
type BusinessId = Brand<string, 'BusinessId'>;
type StaffId = Brand<string, 'StaffId'>;

// Helper functions to create branded values (with validation)
function createUserId(id: string): UserId {
  if (!id.match(/^user_[a-z0-9]+$/)) {
    throw new Error('Invalid user ID format');
  }
  return id as UserId;
}

function createBusinessId(id: string): BusinessId {
  if (!id.match(/^biz_[a-z0-9]+$/)) {
    throw new Error('Invalid business ID format');
  }
  return id as BusinessId;
}

// Type-safe functions that only accept specific branded types
function getUserData(userId: UserId): Promise<User> {
  // Implementation
  return Promise.resolve({} as User);
}

function getBusinessData(businessId: BusinessId): Promise<Business> {
  // Implementation
  return Promise.resolve({} as Business);
}

// Usage - type safety prevents mixing incompatible IDs
const userId = createUserId('user_abc123');
const businessId = createBusinessId('biz_xyz789');

getUserData(userId); // ✅ Valid
getUserData(businessId); // ❌ Type error - BusinessId not assignable to UserId

// ✅ CORRECT - Branded types for validated strings
type EmailAddress = Brand<string, 'EmailAddress'>;
type ValidatedUrl = Brand<string, 'ValidatedUrl'>;

function validateEmail(email: string): EmailAddress {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email address');
  }
  return email as EmailAddress;
}

function sendEmail(to: EmailAddress, subject: string, body: string): Promise<void> {
  // Can only be called with validated email
  return Promise.resolve();
}

// Type system enforces validation
const rawEmail = 'user@example.com';
sendEmail(rawEmail, 'Hello', 'World'); // ❌ Type error - string not assignable to EmailAddress

const validEmail = validateEmail(rawEmail);
sendEmail(validEmail, 'Hello', 'World'); // ✅ Valid

// ❌ WRONG - Using plain strings without branding
function getUserDataBad(userId: string): Promise<User> {
  // No type safety - can accidentally pass wrong ID
  return Promise.resolve({} as User);
}

getUserDataBad('biz_xyz789'); // No error, but wrong ID type!

// ❌ WRONG - Type assertion without validation
function createUserIdUnsafe(id: string): UserId {
  return id as UserId; // No validation!
}
```

**Rationale:** Branded types add zero runtime overhead while preventing entire classes of bugs where semantically different values share the same primitive type. The brand forces explicit validation before use.

---

### Pattern 14: Phantom Types for Compile-Time State Tracking
**When to use:** Tracking state transitions, preventing invalid operations at compile time, encoding business rules in types

**Implementation:**
```typescript
// ✅ CORRECT - Phantom types for state machine
type State = 'draft' | 'submitted' | 'approved' | 'rejected';

type FormData<TState extends State = State> = {
  id: string;
  data: Record<string, unknown>;
  _state?: TState; // Phantom property - never exists at runtime
};

type DraftForm = FormData<'draft'>;
type SubmittedForm = FormData<'submitted'>;
type ApprovedForm = FormData<'approved'>;

// State transition functions with type-level constraints
function submitForm(form: DraftForm): SubmittedForm {
  // Validation logic
  return form as SubmittedForm; // Safe cast - state transition enforced
}

function approveForm(form: SubmittedForm): ApprovedForm {
  // Approval logic
  return form as ApprovedForm;
}

function editForm(form: DraftForm): DraftForm {
  // Can only edit draft forms
  return form;
}

// Usage - type system prevents invalid state transitions
const draft: DraftForm = { id: '1', data: {} };
const submitted = submitForm(draft); // ✅ Valid
const approved = approveForm(submitted); // ✅ Valid

editForm(approved); // ❌ Type error - can't edit approved form
approveForm(draft); // ❌ Type error - can't approve draft (must submit first)

// ✅ CORRECT - Phantom types for API request/response lifecycle
type ApiState = 'unsent' | 'pending' | 'completed' | 'failed';

class ApiRequest<TState extends ApiState = 'unsent'> {
  private _phantom?: TState; // Phantom type parameter

  constructor(
    private url: string,
    private options: RequestInit = {}
  ) {}

  send(this: ApiRequest<'unsent'>): ApiRequest<'pending'> {
    // Can only send unsent requests
    fetch(this.url, this.options);
    return this as ApiRequest<'pending'>;
  }

  async complete(this: ApiRequest<'pending'>): Promise<ApiRequest<'completed'>> {
    // Can only complete pending requests
    return this as ApiRequest<'completed'>;
  }

  retry(this: ApiRequest<'failed'>): ApiRequest<'pending'> {
    // Can only retry failed requests
    return this as ApiRequest<'pending'>;
  }
}

// Usage - compile-time state tracking
const request = new ApiRequest<'unsent'>('/api/data');
const pending = request.send(); // ✅ Valid
pending.send(); // ❌ Type error - can't send pending request
// const completed = await pending.complete(); // ✅ Valid
// completed.retry(); // ❌ Type error - can't retry completed request

// ✅ CORRECT - Phantom types for database record states
type DbState = 'new' | 'persisted' | 'deleted';

interface DbRecord<T, TState extends DbState = DbState> {
  data: T;
  _dbState?: TState;
}

function insertRecord<T>(record: DbRecord<T, 'new'>): DbRecord<T, 'persisted'> {
  // Insert logic
  return record as DbRecord<T, 'persisted'>;
}

function updateRecord<T>(record: DbRecord<T, 'persisted'>): DbRecord<T, 'persisted'> {
  // Can only update persisted records
  return record;
}

function deleteRecord<T>(record: DbRecord<T, 'persisted'>): DbRecord<T, 'deleted'> {
  // Can only delete persisted records
  return record as DbRecord<T, 'deleted'>;
}

// Usage
const newRecord: DbRecord<{ name: string }, 'new'> = { data: { name: 'Alice' } };
const persisted = insertRecord(newRecord); // ✅ Valid
updateRecord(newRecord); // ❌ Type error - can't update new record
const deleted = deleteRecord(persisted); // ✅ Valid
updateRecord(deleted); // ❌ Type error - can't update deleted record

// ❌ WRONG - Runtime state tracking (overhead and error-prone)
interface FormBad {
  id: string;
  data: Record<string, unknown>;
  state: State; // Runtime state - can be mutated incorrectly
}

function submitFormBad(form: FormBad): FormBad {
  // No compile-time check that form is in draft state
  form.state = 'submitted';
  return form;
}
```

**Rationale:** Phantom types encode state machines and business rules in the type system with zero runtime cost. Invalid state transitions become compile errors instead of runtime bugs.

---

### Pattern 15: Distributive Conditional Types
**When to use:** Applying conditional logic to each member of a union type independently

**Implementation:**
```typescript
// ✅ CORRECT - Distributive conditional types over unions
type ToArray<T> = T extends unknown ? T[] : never;

type StringOrNumber = string | number;
type Result = ToArray<StringOrNumber>; // string[] | number[]
// NOT (string | number)[]

// Detailed explanation: Distributive behavior
// ToArray<string | number>
// = ToArray<string> | ToArray<number>
// = string[] | number[]

// ✅ CORRECT - Extract nullable types from union
type ExtractNullable<T> = T extends null | undefined ? T : never;

type Mixed = string | number | null | undefined | boolean;
type Nullable = ExtractNullable<Mixed>; // null | undefined

// ✅ CORRECT - Filter function types from union
type ExtractFunctions<T> = T extends (...args: any[]) => any ? T : never;

type MixedTypes = string | ((x: number) => string) | number | ((y: boolean) => void);
type OnlyFunctions = ExtractFunctions<MixedTypes>;
// ((x: number) => string) | ((y: boolean) => void)

// ✅ CORRECT - Unwrap Promise types
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type NestedPromise = Promise<Promise<Promise<string>>>;
type Unwrapped = Awaited<NestedPromise>; // string

type MixedPromises = Promise<number> | string | Promise<boolean>;
type UnwrappedMixed = Awaited<MixedPromises>; // number | string | boolean

// ✅ CORRECT - Prevent distributive behavior with tuple wrapper
type ToArrayNonDistributive<T> = [T] extends [unknown] ? T[] : never;

type ResultNonDist = ToArrayNonDistributive<string | number>; // (string | number)[]
// NOT string[] | number[]

// ✅ CORRECT - Exclude specific types from union
type ExcludeNull<T> = T extends null ? never : T;

type WithNull = string | number | null;
type WithoutNull = ExcludeNull<WithNull>; // string | number

// Built-in Exclude works the same way (distributive)
type WithoutNullBuiltin = Exclude<WithNull, null>; // string | number

// ✅ CORRECT - Real-world example: API response types
type ApiSuccess<T> = { status: 'success'; data: T };
type ApiError = { status: 'error'; message: string };
type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Extract only success responses
type ExtractSuccess<T> = T extends ApiSuccess<infer U> ? U : never;

type UserResponse = ApiResponse<{ id: string; name: string }>;
type StaffResponse = ApiResponse<{ id: string; role: string }>;

type Responses = UserResponse | StaffResponse;
type SuccessData = ExtractSuccess<Responses>;
// { id: string; name: string } | { id: string; role: string }

// ❌ WRONG - Expecting non-distributive behavior
type ToArrayWrong<T> = T extends unknown ? T[] : never;
type WrongResult = ToArrayWrong<string | number>;
// User expects: (string | number)[]
// Actual result: string[] | number[]

// Use tuple wrapper to prevent distribution when needed
```

**Rationale:** Distributive conditional types automatically apply transformations to each union member independently, enabling powerful type-level filtering and mapping operations. Understanding distribution is critical for correct conditional type behavior.

---

### Pattern 16: Mapped Type Modifiers for Precise Transformations
**When to use:** Adding/removing readonly or optional modifiers, creating precise derived types

**Implementation:**
```typescript
// ✅ CORRECT - Remove readonly modifier with -readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface ReadonlyUser {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;
}

type MutableUser = Mutable<ReadonlyUser>;
// { id: string; email: string; createdAt: Date }

// ✅ CORRECT - Add readonly modifier with +readonly
type Immutable<T> = {
  +readonly [P in keyof T]: T[P];
};

interface MutableData {
  name: string;
  age: number;
}

type ImmutableData = Immutable<MutableData>;
// { readonly name: string; readonly age: number }

// ✅ CORRECT - Remove optional modifier with -?
type Required<T> = {
  [P in keyof T]-?: T[P];
};

interface PartialUser {
  id?: string;
  email?: string;
  name?: string;
}

type CompleteUser = Required<PartialUser>;
// { id: string; email: string; name: string }

// ✅ CORRECT - Add optional modifier with +?
type Partial<T> = {
  [P in keyof T]+?: T[P];
};

interface StrictConfig {
  apiKey: string;
  timeout: number;
  retries: number;
}

type FlexibleConfig = Partial<StrictConfig>;
// { apiKey?: string; timeout?: number; retries?: number }

// ✅ CORRECT - Combine modifiers for complex transformations
type MutableRequired<T> = {
  -readonly [P in keyof T]-?: T[P];
};

interface PartialReadonlyUser {
  readonly id?: string;
  readonly email?: string;
}

type FullyMutableUser = MutableRequired<PartialReadonlyUser>;
// { id: string; email: string }

// ✅ CORRECT - Conditional modifier application
type MakeReadonly<T, K extends keyof T> = {
  +readonly [P in K]: T[P];
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

interface User {
  id: string;
  email: string;
  name: string;
  age: number;
}

type UserWithReadonlyId = MakeReadonly<User, 'id' | 'email'>;
// { readonly id: string; readonly email: string; name: string; age: number }

// ✅ CORRECT - Deep readonly transformation
type DeepReadonly<T> = {
  +readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface NestedConfig {
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
    ssl: boolean;
  };
}

type ImmutableConfig = DeepReadonly<NestedConfig>;
// {
//   readonly server: {
//     readonly host: string;
//     readonly port: number;
//   };
//   readonly database: {
//     readonly url: string;
//     readonly ssl: boolean;
//   };
// }

// ✅ CORRECT - Real-world: Database update types
type DatabaseUpdate<T> = {
  [P in keyof T]+?: T[P] | null;
};

interface AppointmentRow {
  id: string;
  customerId: string;
  scheduledAt: Date;
  status: string;
}

type AppointmentUpdate = DatabaseUpdate<Omit<AppointmentRow, 'id'>>;
// {
//   customerId?: string | null;
//   scheduledAt?: Date | null;
//   status?: string | null;
// }

// ❌ WRONG - Forgetting to remove readonly when needed
type BadMutable<T> = {
  [P in keyof T]: T[P]; // Preserves readonly!
};

type StillReadonly = BadMutable<ReadonlyUser>;
// { readonly id: string; ... } - Still readonly!

// ❌ WRONG - Using Partial when Required is needed
function updateUser(id: string, data: Partial<User>) {
  // Problem: All fields optional, can't enforce required updates
}

// Better: Use specific update types
type UserProfileUpdate = Required<Pick<User, 'name'>> & Partial<Pick<User, 'age'>>;
```

**Rationale:** Mapped type modifiers (+/- for readonly and ?) provide surgical precision in deriving types. They enable creating exact transformations without manual duplication, with the type system enforcing correctness.

---

### Pattern 17: Type-Safe Query Builder Pattern
**When to use:** Building fluent APIs, database query builders, request builders with compile-time validation

**Implementation:**
```typescript
// ✅ CORRECT - Type-safe query builder with progressive refinement
type QueryState = {
  table?: string;
  select?: readonly string[];
  where?: readonly string[];
  orderBy?: readonly string[];
};

class QueryBuilder<TState extends QueryState = {}> {
  private state: QueryState = {};

  // From clause - sets table and enables select
  from<TTable extends string>(
    table: TTable
  ): QueryBuilder<TState & { table: TTable }> {
    this.state.table = table;
    return this as any;
  }

  // Select clause - requires table to be set
  select<
    TColumns extends readonly string[]
  >(
    this: QueryBuilder<TState & { table: string }>,
    ...columns: TColumns
  ): QueryBuilder<TState & { select: TColumns }> {
    this.state.select = columns;
    return this as any;
  }

  // Where clause - requires table
  where(
    this: QueryBuilder<TState & { table: string }>,
    condition: string
  ): QueryBuilder<TState & { where: readonly string[] }> {
    this.state.where = [...(this.state.where || []), condition];
    return this as any;
  }

  // OrderBy clause - requires table
  orderBy(
    this: QueryBuilder<TState & { table: string }>,
    column: string
  ): QueryBuilder<TState & { orderBy: readonly string[] }> {
    this.state.orderBy = [...(this.state.orderBy || []), column];
    return this as any;
  }

  // Execute - requires table and select
  execute(
    this: QueryBuilder<TState & { table: string; select: readonly string[] }>
  ): Promise<unknown[]> {
    const query = this.buildQuery();
    console.log('Executing:', query);
    return Promise.resolve([]);
  }

  private buildQuery(): string {
    const { table, select, where, orderBy } = this.state;
    let query = `SELECT ${select?.join(', ') || '*'} FROM ${table}`;
    if (where) query += ` WHERE ${where.join(' AND ')}`;
    if (orderBy) query += ` ORDER BY ${orderBy.join(', ')}`;
    return query;
  }
}

// Usage - type system enforces correct method order
const query = new QueryBuilder();

query
  .from('users')
  .select('id', 'email', 'name')
  .where('age > 18')
  .orderBy('name')
  .execute(); // ✅ Valid

query.select('id'); // ❌ Type error - must call from() first
query.from('users').execute(); // ❌ Type error - must call select() first

// ✅ CORRECT - Type-safe API request builder
type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

class RequestBuilder<TConfig extends RequestConfig = {}> {
  private config: RequestConfig = {};

  method<TMethod extends RequestConfig['method']>(
    method: TMethod
  ): RequestBuilder<TConfig & { method: TMethod }> {
    this.config.method = method;
    return this as any;
  }

  path<TPath extends string>(
    path: TPath
  ): RequestBuilder<TConfig & { path: TPath }> {
    this.config.path = path;
    return this as any;
  }

  body<TBody>(
    this: RequestBuilder<TConfig & { method: 'POST' | 'PUT' }>,
    body: TBody
  ): RequestBuilder<TConfig & { body: TBody }> {
    this.config.body = body;
    return this as any;
  }

  headers(
    headers: Record<string, string>
  ): RequestBuilder<TConfig & { headers: Record<string, string> }> {
    this.config.headers = headers;
    return this as any;
  }

  async send(
    this: RequestBuilder<TConfig & { method: string; path: string }>
  ): Promise<Response> {
    const { method, path, body, headers } = this.config;
    return fetch(path!, {
      method: method!,
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }
}

// Usage
const request = new RequestBuilder()
  .method('POST')
  .path('/api/users')
  .body({ name: 'Alice', email: 'alice@example.com' })
  .send(); // ✅ Valid

new RequestBuilder()
  .method('GET')
  .path('/api/users')
  .body({ data: 'test' }) // ❌ Type error - can't send body with GET
  .send();

new RequestBuilder()
  .method('POST')
  .send(); // ❌ Type error - must set path

// ❌ WRONG - Non-type-safe builder
class BadQueryBuilder {
  private state: any = {};

  from(table: string) {
    this.state.table = table;
    return this;
  }

  select(...columns: string[]) {
    this.state.select = columns;
    return this;
  }

  execute() {
    // No type safety - can execute without required fields
    return Promise.resolve([]);
  }
}

// No type errors, but will fail at runtime
new BadQueryBuilder().execute(); // No error!
```

**Rationale:** Type-safe builders use progressive type refinement to encode API constraints in the type system. Invalid method sequences become compile errors, eliminating runtime validation needs.

---

### Pattern 18: Advanced String Case Conversion Types
**When to use:** Converting between naming conventions (snake_case, camelCase, PascalCase), API response transformations

**Implementation:**
```typescript
// ✅ CORRECT - Snake case to PascalCase conversion
type SnakeToPascalCase<S extends string> =
  S extends `${infer First}_${infer Rest}`
    ? `${Capitalize<First>}${SnakeToPascalCase<Rest>}`
    : Capitalize<S>;

type Example1 = SnakeToPascalCase<'hello_world_foo'>; // 'HelloWorldFoo'
type Example2 = SnakeToPascalCase<'user_profile_settings'>; // 'UserProfileSettings'

// ✅ CORRECT - Snake case to camelCase conversion
type SnakeToCamelCase<S extends string> =
  S extends `${infer First}_${infer Rest}`
    ? `${Lowercase<First>}${SnakeToPascalCase<Rest>}`
    : Lowercase<S>;

type Example3 = SnakeToCamelCase<'user_id'>; // 'userId'
type Example4 = SnakeToCamelCase<'created_at'>; // 'createdAt'

// ✅ CORRECT - Convert object keys from snake_case to camelCase
type CamelCaseKeys<T> = {
  [K in keyof T as K extends string ? SnakeToCamelCase<K> : K]: T[K];
};

interface ApiResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_active: boolean;
}

type ClientResponse = CamelCaseKeys<ApiResponse>;
// {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   createdAt: string;
//   isActive: boolean;
// }

// ✅ CORRECT - camelCase to snake_case conversion
type CamelToSnakeCase<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? First extends Capitalize<First>
      ? `_${Lowercase<First>}${CamelToSnakeCase<Rest>}`
      : `${First}${CamelToSnakeCase<Rest>}`
    : S;

type Example5 = CamelToSnakeCase<'userId'>; // '_user_id'
type Example6 = CamelToSnakeCase<'firstName'>; // '_first_name'

// Remove leading underscore
type TrimLeading<S extends string> = S extends `_${infer Rest}` ? Rest : S;

type CleanCamelToSnake<S extends string> = TrimLeading<CamelToSnakeCase<S>>;

type Example7 = CleanCamelToSnake<'userId'>; // 'user_id'
type Example8 = CleanCamelToSnake<'firstName'>; // 'first_name'

// ✅ CORRECT - Convert object keys from camelCase to snake_case
type SnakeCaseKeys<T> = {
  [K in keyof T as K extends string ? CleanCamelToSnake<K> : K]: T[K];
};

interface ClientData {
  userId: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

type ApiData = SnakeCaseKeys<ClientData>;
// {
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   created_at: Date;
// }

// ✅ CORRECT - Deep case conversion for nested objects
type DeepCamelCaseKeys<T> = {
  [K in keyof T as K extends string ? SnakeToCamelCase<K> : K]:
    T[K] extends object ? DeepCamelCaseKeys<T[K]> : T[K];
};

interface NestedApiResponse {
  user_profile: {
    first_name: string;
    last_name: string;
    contact_info: {
      email_address: string;
      phone_number: string;
    };
  };
}

type NestedClientResponse = DeepCamelCaseKeys<NestedApiResponse>;
// {
//   userProfile: {
//     firstName: string;
//     lastName: string;
//     contactInfo: {
//       emailAddress: string;
//       phoneNumber: string;
//     };
//   };
// }

// ✅ CORRECT - Real-world: API response transformer
function transformResponse<T extends Record<string, unknown>>(
  response: T
): CamelCaseKeys<T> {
  const result: any = {};
  for (const key in response) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = response[key];
  }
  return result;
}

// Usage with type safety
const apiData: ApiResponse = {
  user_id: '123',
  first_name: 'Alice',
  last_name: 'Smith',
  created_at: '2025-01-01',
  is_active: true,
};

const clientData = transformResponse(apiData);
console.log(clientData.userId); // ✅ Type-safe access
console.log(clientData.user_id); // ❌ Type error
```

**Rationale:** String case conversion types enable automatic transformation between API conventions (often snake_case) and TypeScript conventions (camelCase), maintaining type safety across the transformation boundary.

---

## Advanced Type-Level Programming

### Pattern 19: Type-Safe String Joining
**When to use:** Building type-safe string concatenation, path joining, SQL query building

**Implementation:**
```typescript
// ✅ CORRECT - Recursive type-safe string joining
type Join<T extends unknown[], D extends string> =
  T extends [] ? '' :
  T extends [string | number | boolean | bigint] ? `${T[0]}` :
  T extends [string | number | boolean | bigint, ...infer U] ? `${T[0]}${D}${Join<U, D>}` :
  string;

type Path1 = Join<['users', 'profile', 'settings'], '/'>; // 'users/profile/settings'
type Path2 = Join<['api', 'v1', 'appointments'], '/'>; // 'api/v1/appointments'
type Csv = Join<['name', 'email', 'age'], ','>; // 'name,email,age'

// ✅ CORRECT - Type-safe path builder
type PathSegment = string | number;

type BuildPath<T extends readonly PathSegment[]> = Join<T, '/'>;

function createPath<T extends readonly PathSegment[]>(...segments: T): BuildPath<T> {
  return segments.join('/') as BuildPath<T>;
}

const userPath = createPath('users', '123', 'profile');
// Type: 'users/123/profile'

const apiPath = createPath('api', 'v1', 'data');
// Type: 'api/v1/data'

// ✅ CORRECT - SQL query fragment joining
type SqlJoin<T extends readonly string[]> = Join<T, ' AND '>;

type Condition1 = SqlJoin<['age > 18', 'status = active', 'verified = true']>;
// 'age > 18 AND status = active AND verified = true'

function buildWhereClause<T extends readonly string[]>(
  conditions: T
): SqlJoin<T> {
  return conditions.join(' AND ') as SqlJoin<T>;
}

const where = buildWhereClause(['age > 18', 'active = true']);
// Type: 'age > 18 AND active = true'

// ✅ CORRECT - Type-safe URL builder
type UrlPath = readonly (string | number)[];

type BuildUrl<TBase extends string, TPath extends UrlPath> =
  `${TBase}${Join<TPath, '/'>}`;

function buildUrl<TBase extends string, TPath extends UrlPath>(
  base: TBase,
  ...path: TPath
): BuildUrl<TBase, TPath> {
  return `${base}${path.join('/')}` as BuildUrl<TBase, TPath>;
}

const apiUrl = buildUrl('https://api.example.com/', 'users', 123, 'profile');
// Type: 'https://api.example.com/users/123/profile'
```

**Rationale:** Type-safe string joining preserves literal types through concatenation, enabling compile-time validation of paths, queries, and other string-based APIs.

---

### Performance Optimization Patterns

### Pattern 20: Batched Inference for Recursive Types
**When to use:** Processing long strings, deep recursion, avoiding "Type instantiation is excessively deep" errors

**Implementation:**
```typescript
// ❌ PROBLEM - Naive recursive type (slow for long strings)
type CharsSlow<S extends string> =
  S extends `${infer C}${infer R}` ? [C, ...CharsSlow<R>] :
  S extends '' ? [] :
  never;

type SlowResult = CharsSlow<'Hello'>; // Works but slow
// type VerySlowResult = CharsSlow<'VeryLongStringHere...'>; // May hit recursion limit

// ✅ SOLUTION - Batched inference (10x faster, handles longer strings)
type CharsFast<S extends string> =
  string extends S ? string[] :
  // Process 10 characters at once
  S extends `${infer C0}${infer C1}${infer C2}${infer C3}${infer C4}${infer C5}${infer C6}${infer C7}${infer C8}${infer C9}${infer R}`
    ? [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, ...CharsFast<R>] :
  // Fall back to one-by-one for remaining characters
  S extends `${infer C}${infer R}` ? [C, ...CharsFast<R>] :
  S extends '' ? [] :
  never;

type FastResult = CharsFast<'Hello'>; // ['H', 'e', 'l', 'l', 'o']
type LongerResult = CharsFast<'This is a much longer string'>; // Works efficiently

// ✅ CORRECT - Batched string splitting
type SplitFast<S extends string, D extends string> =
  string extends S ? string[] :
  // Try to match multiple segments at once
  S extends `${infer A}${D}${infer B}${D}${infer C}${D}${infer Rest}`
    ? [A, B, C, ...SplitFast<Rest, D>] :
  // Fall back to single segment
  S extends `${infer Head}${D}${infer Tail}` ? [Head, ...SplitFast<Tail, D>] :
  S extends '' ? [] :
  [S];

type SplitResult = SplitFast<'a.b.c.d.e.f', '.'>; // ['a', 'b', 'c', 'd', 'e', 'f']

// ✅ CORRECT - Tail-call optimized recursion
type CounterTailRec<N extends number, Acc extends unknown[] = []> =
  Acc['length'] extends N ? Acc : CounterTailRec<N, [...Acc, unknown]>;

type Ten = CounterTailRec<10>; // [unknown, unknown, ..., unknown] (length 10)

// ✅ CORRECT - Performance-conscious deep property access
type PropTypeFast<T, Path extends string> =
  string extends Path ? unknown :
  Path extends keyof T ? T[Path] :
  // Batch multiple levels
  Path extends `${infer K1}.${infer K2}.${infer K3}.${infer Rest}`
    ? K1 extends keyof T
      ? K2 extends keyof T[K1]
        ? K3 extends keyof T[K1][K2]
          ? PropTypeFast<T[K1][K2][K3], Rest>
          : unknown
        : unknown
      : unknown :
  // Single level
  Path extends `${infer K}.${infer R}`
    ? K extends keyof T ? PropTypeFast<T[K], R> : unknown :
  unknown;

interface DeepObject {
  a: { b: { c: { d: { e: { f: string } } } } };
}

type Result = PropTypeFast<DeepObject, 'a.b.c.d.e.f'>; // string
```

**Rationale:** Batched inference processes multiple items per recursion step, reducing recursion depth by 10x or more. This avoids "excessively deep" errors and dramatically improves compilation performance for complex recursive types.

---

## Detection Commands

Run these commands to find TypeScript violations:

```bash
# 1. Find any usage of 'any' type (FORBIDDEN)
rg "\bany\b" --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' \
  --glob '!*.d.ts' \
  --glob '!database.types.ts'

# 2. Find type suppressions (FORBIDDEN)
rg "@ts-ignore|@ts-expect-error" \
  --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules'

# 3. Find non-null assertions (avoid unless justified)
rg "!\.|!!" --glob "*.ts" --glob "*.ts x" \
  --glob '!node_modules' \
  --glob '!*.test.ts'

# 4. Find missing type-only imports
rg "import \{ .* \} from '.*types'" \
  --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' | \
  grep -v "import type"

# 5. Find hand-written database interfaces (should use generated types)
rg "^interface (Appointment|Staff|Service|User|Business)" \
  --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' \
  --glob '!database.types.ts'

# 6. Find enum usage (prefer literal unions)
rg "^enum " --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules'

# 7. Find unsafe branded type creation (missing validation)
rg "as (UserId|BusinessId|StaffId|EmailAddress)" \
  --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' -B 3 | \
  grep -v "if\|throw\|validate"

# 8. Find phantom types without state validation
rg "as.*Form\<|as.*Request\<|as.*Record\<" \
  --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' -B 5 | \
  grep -v "// Safe cast\|// State transition"

# 9. Find non-distributive conditional types (potential bugs)
rg "extends \[unknown\]" --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules'

# 10. Find naive recursive types (performance issues)
rg "extends \`\$\{infer" --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' | \
  grep -v "C0\|C1\|C2" # Batched inference uses numbered captures

# 11. Verify typecheck passes
npm run typecheck

# 12. Find missing return types on exported functions
rg "^export (async )?function \w+\([^)]*\) \{" \
  --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules'

# 13. Find unconstrained Object.keys usage with generics
rg "Object\.keys\(" --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' -A 5 -B 5 | \
  grep -E "function.*<T[^>]*>\("

# 14. Check for proper Zod inference
rg "z\.infer<typeof" --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' -c
# Should match all schema usages

# 15. Find query builders without type safety
rg "class \w*Builder" --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' -A 10 | \
  grep -v "TState\|TConfig\|type parameter"

# 16. Check tsconfig performance settings
cat tsconfig.json | grep -E "incremental|tsBuildInfoFile|skipLibCheck"

# 17. Find mapped types without modifiers (potential issues)
rg "\[P in keyof T\]: T\[P\]" --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' | \
  grep -v "readonly\|-readonly\|?\|-?"

# 18. Find missing branded type validators
rg "type \w+ = Brand<" --glob "*.ts" --glob "*.tsx" \
  --glob '!node_modules' -A 20 | \
  grep -v "function create\|function validate"
```

**Before every commit:** Run `npm run typecheck` - MUST pass with zero errors.

**Performance Monitoring:**
```bash
# Check TypeScript compilation time
time npm run typecheck

# If > 30s, run diagnostics
tsc --extendedDiagnostics --noEmit

# Look for "Type instantiation is excessively deep" warnings
tsc --noEmit 2>&1 | grep "excessively deep"

# Identify slow files
tsc --generateTrace trace && analyze-trace trace
```

---

## Quick Reference

| Pattern | When | Example | Since |
|---------|------|---------|-------|
| `unknown` vs `any` | External data | `const data: unknown = await response.json()` | TS 3.0 |
| Type guard | Narrow unknown | `if (isUser(data)) { data.email }` | TS 1.6 |
| Supabase types | Database queries | `Database['public']['Views']['appointments_view']['Row']` | - |
| Zod inference | Form validation | `type FormData = z.infer<typeof schema>` | - |
| Utility types | Derive types | `type UserPublic = Omit<User, 'password'>` | TS 2.1+ |
| Generics | Reusable logic | `function findById<T extends Identifiable>(items: T[])` | TS 1.0 |
| Discriminated union | State management | `type State = { status: 'loading' } \| { status: 'success', data: T }` | TS 2.0 |
| Literal union | String constants | `type Status = 'pending' \| 'confirmed'` | TS 1.8 |
| Template literal | String patterns | `type Path = \`/api/${string}\`` | TS 4.1 |
| Template parsing | Extract from strings | `type PropType<T, Path> = Path extends \`${infer K}.${infer R}\`...` | TS 4.1 |
| `satisfies` | Type check without widen | `const config = {...} satisfies Config` | TS 4.9 |
| `satisfies` + `Partial` | Optional props + literals | `const obj = {...} satisfies Partial<Type>` | TS 4.9 |
| `const` generics | Preserve literals | `function tuple<const T extends readonly unknown[]>` | TS 5.0 |
| `type` vs `interface` | Objects | Use `type` for unions, `interface` for extending | - |
| `Object.keys` constraint | Generic object ops | `function f<T extends object>(obj: T)` | - |
| **Branded types** | **ID/value separation** | `type UserId = Brand<string, 'UserId'>` | **TS 2.7** |
| **Phantom types** | **State machines** | `type Form<TState = 'draft'> = { _state?: TState }` | **TS 2.0** |
| **Distributive conditionals** | **Union filtering** | `type ToArray<T> = T extends unknown ? T[] : never` | **TS 2.8** |
| **Mapped modifiers** | **Precision transformations** | `type Mutable<T> = { -readonly [P in keyof T]: T[P] }` | **TS 2.8** |
| **Type-safe builder** | **Fluent APIs** | `class Builder<TState = {}> { from<T>(t: T): Builder<TState & { table: T }> }` | **TS 2.8** |
| **Case conversion** | **API transformations** | `type CamelCaseKeys<T> = { [K in keyof T as SnakeToCamelCase<K>]: T[K] }` | **TS 4.1** |
| **String joining** | **Path building** | `type Join<T, D> = T extends [infer F, ...infer R] ? \`${F}${D}${Join<R, D>}\` : ''` | **TS 4.1** |
| **Batched inference** | **Performance** | `S extends \`${C0}${C1}...${C9}${R}\` ? [C0, ...] : [C, ...]` | **TS 4.1** |
| **Deep readonly** | **Nested immutability** | `type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }` | **TS 2.8** |
| **Variance annotations** | **Generic constraints** | `type Box<out T> = { value: T }` (covariant) | **TS 4.7** |

---

## TypeScript 5.x Modern Features

### const Type Parameters (Preserve Literal Types)
```typescript
// Preserves literal types through generic functions
declare function tuple<const T extends readonly unknown[]>(...items: T): T;

const result = tuple('open', 42, { status: 'ok' });
// Type: readonly ['open', 42, { status: 'ok' }]
// NOT: readonly [string, number, { status: string }]

// Use case: Configuration objects with literal types
declare function createConfig<const T extends Record<string, unknown>>(
  config: T
): T;

const appConfig = createConfig({
  env: 'production',
  port: 3000,
  features: { darkMode: true },
});
// appConfig.env is 'production', not string
```

### satisfies Operator (Type Check Without Widening)
```typescript
// Type-check without losing literal types
const metadata = {
  title: 'Appointments',
  description: 'Manage schedule',
  tags: ['booking', 'calendar'],
} satisfies Record<string, string | string[]>;

// metadata.title is still 'Appointments' (literal)
// NOT widened to string

// Use case: Ensure object structure without type widening
type RouteConfig = {
  path: string;
  permissions: string[];
};

const routes = {
  appointments: { path: '/appointments', permissions: ['read:appointments'] },
  staff: { path: '/staff', permissions: ['read:staff', 'write:staff'] },
} satisfies Record<string, RouteConfig>;

// routes.appointments.path is '/appointments', not string

// ✅ CORRECT - satisfies with Partial to allow optional properties while preserving literals
type Point = {
  x: number;
  y: number;
  z: number;
};

const point2d = { x: 10, y: 20 } satisfies Partial<Point>;
// point2d.x is number (not widened)
// point2d has type { x: number; y: number } (not Partial<Point>)
// Can access point2d.x.toFixed() without type errors
// Cannot access point2d.z (correctly errors)

// Compare with type annotation (loses inference)
const point2dTyped: Partial<Point> = { x: 10, y: 20 };
// Can access point2dTyped.z, but it's 'number | undefined' - less precise!
```

### using Declarations (Resource Management)
```typescript
// Automatic resource cleanup (Symbol.dispose)
class Timer implements Disposable {
  constructor(private label: string) {
    console.time(label);
  }

  [Symbol.dispose]() {
    console.timeEnd(this.label);
  }
}

async function measurePerformance() {
  using timer = new Timer('database-query');
  await fetchData(); // Timer automatically disposed when scope exits
}

// Use case: Database connections, file handles
class DatabaseConnection implements Disposable {
  [Symbol.dispose]() {
    this.close();
  }

  close() {
    // Cleanup logic
  }
}

async function query() {
  using conn = await openDatabase();
  return conn.execute('SELECT * FROM users');
  // Connection automatically closed
}
```

---

## Common Pitfalls and Solutions

### Pitfall 1: Array Access Without Index Check
```typescript
// ❌ PROBLEM - Unchecked array access
function getFirstItem<T>(items: T[]): T {
  return items[0]; // Could be undefined!
}

// ✅ SOLUTION - Handle potential undefined
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0]; // Type correctly reflects possibility
}

// ✅ SOLUTION - Validate before access
function getFirstItemSafe<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('Array is empty');
  }
  return items[0]!; // Non-null assertion justified by check
}
```

### Pitfall 2: Object Property Access
```typescript
// ❌ PROBLEM - Unchecked property access
function getValue(obj: Record<string, string>, key: string): string {
  return obj[key]; // Could be undefined with noUncheckedIndexedAccess!
}

// ✅ SOLUTION - Handle optional property
function getValue(obj: Record<string, string>, key: string): string | undefined {
  return obj[key];
}

// ✅ SOLUTION - Provide default
function getValueWithDefault(
  obj: Record<string, string>,
  key: string,
  defaultValue: string
): string {
  return obj[key] ?? defaultValue;
}
```

### Pitfall 3: Mixing Type and Value Imports
```typescript
// ❌ PROBLEM - Mixed imports
import { Database, createClient } from '@/lib/supabase';
// Database is type, createClient is value - confusing

// ✅ SOLUTION - Separate type imports
import type { Database } from '@/lib/types/database.types';
import { createClient } from '@/lib/supabase/client';
```

### Pitfall 4: Object.keys with Unconstrained Generics
```typescript
// ❌ PROBLEM - Object.keys with unconstrained type parameter
function compareKeys<T>(a: T, b: T): boolean {
  const keysA = Object.keys(a); // Error: T is not assignable to object
  const keysB = Object.keys(b);
  return keysA.length === keysB.length;
}

// ✅ SOLUTION 1 - Add object constraint
function compareKeys<T extends object>(a: T, b: T): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  return keysA.length === keysB.length;
}

// ✅ SOLUTION 2 - Runtime check to narrow type
function compareKeysRuntime<T>(a: T, b: T): boolean {
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  return keysA.length === keysB.length;
}

// ✅ SOLUTION 3 - Use Record type
function compareKeysRecord<T extends Record<string, unknown>>(
  a: T,
  b: T
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  return keysA.length === keysB.length;
}
```

### Pitfall 5: Generic Type Inference with Mixed Arguments
```typescript
// ❌ PROBLEM - Different types for same generic parameter
declare function merge<T>(a: T, b: T): T;

const result = merge(1, 'hello'); // Error: Type mismatch

// ✅ SOLUTION 1 - Use union type explicitly
const result = merge<number | string>(1, 'hello');

// ✅ SOLUTION 2 - Use separate type parameters
declare function merge<T, U>(a: T, b: U): T & U;
const result = merge(1, 'hello'); // Type: number & string

// ✅ SOLUTION 3 - Use overloads for specific cases
function merge<T>(a: T, b: T): T;
function merge<T, U>(a: T, b: U): T & U;
function merge(a: any, b: any): any {
  return Object.assign({}, a, b);
}
```

---

## Related Files

- **01-architecture.md** - File organization and naming conventions
- **05-database.md** - Supabase type usage in queries
- **07-forms.md** - Zod schema type inference
- **06-api.md** - Server Action type safety

---

**Pre-Commit Checklist:**

- [ ] `npm run typecheck` passes with zero errors
- [ ] No `any` types found (run detection commands)
- [ ] No `@ts-ignore` or `@ts-expect-error` suppressions
- [ ] All exported functions have explicit return types
- [ ] Database types imported from `database.types.ts`
- [ ] Zod schemas use `z.infer<typeof schema>`
- [ ] Type-only imports use `import type`
- [ ] `tsconfig.json` has all strict flags enabled
- [ ] Type guards used for `unknown` narrowing
- [ ] No enums (use literal unions instead)
