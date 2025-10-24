# 01. Basic Query Rules

## 1.1 SELECT Operations

### Rule 1.1.1: Basic select all
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
```

### Rule 1.1.2: Select specific columns
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('id, name, created_at')
```

### Rule 1.1.3: Select with column aliases
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('id, name:instrument_name, created_at:date_created')
```

## 1.2 Filtering Rules

### Rule 1.2.1: Basic equality filter
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .eq('id', 1)
```

### Rule 1.2.2: Not equal filter
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .neq('status', 'inactive')
```

### Rule 1.2.3: Greater than / Less than filters
```javascript
// Greater than
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .gt('price', 100)

// Less than or equal
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .lte('created_at', '2023-01-01')
```

## 1.3 Text Search Rules

### Rule 1.3.1: Case-insensitive search
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .ilike('name', '%violin%')
```

### Rule 1.3.2: Pattern matching
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .like('name', 'Strad%')
```

### Rule 1.3.3: Full-text search
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .textSearch('description', 'antique wooden')
```

## 1.4 Array and Range Operations

### Rule 1.4.1: In array filter
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .in('category', ['violin', 'viola', 'cello'])
```

### Rule 1.4.2: Contains array element
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .contains('tags', ['vintage'])
```

### Rule 1.4.3: Range overlap (updated syntax)
```javascript
// ✅ New v2 syntax
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .ov('price_range', [150, 250])
```

## 1.5 Null Handling

### Rule 1.5.1: Check for null values
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .is('retired_date', null)
```

### Rule 1.5.2: Check for non-null values
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .not('retired_date', 'is', null)
```

## 1.6 Pagination Rules

### Rule 1.6.1: Range-based pagination (v2 syntax)
```javascript
// ✅ New v2 syntax
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .range(10, 20)  // Replace offset(10).limit(10)
```

### Rule 1.6.2: Count with pagination
```javascript
const { data, error, count } = await supabase
  .from('instruments')
  .select('*', { count: 'exact' })
  .range(0, 9)
```

## 1.7 Ordering Rules

### Rule 1.7.1: Basic ordering
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .order('created_at', { ascending: false })
```

### Rule 1.7.2: Multiple column ordering
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .order('category', { ascending: true })
  .order('name', { ascending: true })
```

### Rule 1.7.3: Null values ordering
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .order('retired_date', { ascending: true, nullsFirst: true })
```

## 1.8 Error Handling for Queries

### Rule 1.8.1: Always check for errors
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')

if (error) {
  console.error('Query error:', error.message)
  return
}

console.log('Data retrieved:', data.length, 'records')
```

### Rule 1.8.2: Handle empty results
```javascript
const { data, error } = await supabase
  .from('instruments')
  .select('*')
  .eq('id', nonExistentId)

if (error) {
  console.error('Error:', error)
  return
}

if (data.length === 0) {
  console.log('No records found')
  return
}

console.log('Found record:', data[0])
```