# 02. Insert, Update, Delete Rules

## 2.1 INSERT Operations

### Rule 2.1.1: Single record insert
```javascript
const { data, error } = await supabase
  .from('instruments')
  .insert({
    name: 'Stradivarius Violin',
    category: 'violin',
    price: 5000000
  })
  .select()
```

### Rule 2.1.2: Multiple records insert
```javascript
const { data, error } = await supabase
  .from('instruments')
  .insert([
    { name: 'Violin 1', category: 'violin' },
    { name: 'Viola 1', category: 'viola' },
    { name: 'Cello 1', category: 'cello' }
  ])
  .select()
```

### Rule 2.1.3: Insert with conflict resolution
```javascript
const { data, error } = await supabase
  .from('instruments')
  .upsert({
    id: 1,
    name: 'Updated Violin',
    category: 'violin'
  })
  .select()
```

## 2.2 UPDATE Operations

### Rule 2.2.1: Update specific record
```javascript
const { data, error } = await supabase
  .from('instruments')
  .update({
    name: 'Updated Instrument Name',
    price: 1500
  })
  .eq('id', 1)
  .select()
```

### Rule 2.2.2: Update multiple records
```javascript
const { data, error } = await supabase
  .from('instruments')
  .update({ status: 'active' })
  .in('category', ['violin', 'viola'])
  .select()
```

### Rule 2.2.3: Conditional updates
```javascript
const { data, error } = await supabase
  .from('instruments')
  .update({ 
    last_serviced: new Date().toISOString(),
    service_count: 1 
  })
  .is('last_serviced', null)
  .select()
```

## 2.3 UPSERT Operations

### Rule 2.3.1: Basic upsert (insert or update)
```javascript
const { data, error } = await supabase
  .from('instruments')
  .upsert({
    id: 1,
    name: 'Amati Violin',
    category: 'violin',
    price: 2000000
  })
  .select()
```

### Rule 2.3.2: Upsert with custom conflict resolution
```javascript
const { data, error } = await supabase
  .from('instruments')
  .upsert(
    {
      name: 'Unique Violin',
      serial_number: 'SN123456',
      category: 'violin'
    },
    {
      onConflict: 'serial_number',
      ignoreDuplicates: false
    }
  )
  .select()
```

### Rule 2.3.3: Bulk upsert operations
```javascript
const { data, error } = await supabase
  .from('instruments')
  .upsert([
    { id: 1, name: 'Updated Violin', category: 'violin' },
    { id: 2, name: 'Updated Viola', category: 'viola' },
    { name: 'New Cello', category: 'cello' }  // New record without ID
  ])
  .select()
```

## 2.4 DELETE Operations

### Rule 2.4.1: Delete specific record
```javascript
const { data, error } = await supabase
  .from('instruments')
  .delete()
  .eq('id', 1)
  .select()
```

### Rule 2.4.2: Delete multiple records
```javascript
const { data, error } = await supabase
  .from('instruments')
  .delete()
  .in('status', ['broken', 'sold'])
  .select()
```

### Rule 2.4.3: Conditional delete
```javascript
const { data, error } = await supabase
  .from('instruments')
  .delete()
  .lt('created_at', '2020-01-01')
  .select()
```

## 2.5 Returning Data Rules

### Rule 2.5.1: Return inserted/updated data
```javascript
// Always use .select() to return modified data
const { data, error } = await supabase
  .from('instruments')
  .insert({ name: 'New Violin', category: 'violin' })
  .select()
```

### Rule 2.5.2: Return specific columns
```javascript
const { data, error } = await supabase
  .from('instruments')
  .update({ price: 1500 })
  .eq('id', 1)
  .select('id, name, price, updated_at')
```

### Rule 2.5.3: Return count of affected rows
```javascript
const { data, error, count } = await supabase
  .from('instruments')
  .update({ status: 'archived' })
  .lt('last_used', '2023-01-01')
  .select('*', { count: 'exact' })
```

## 2.6 Transaction-like Operations

### Rule 2.6.1: Use RPC for complex operations
```javascript
// Define stored procedure for complex business logic
const { data, error } = await supabase.rpc('transfer_instrument', {
  from_user_id: 1,
  to_user_id: 2,
  instrument_id: 10
})
```

### Rule 2.6.2: Batch operations with error handling
```javascript
const batchOperations = async () => {
  try {
    // Insert parent record
    const { data: parentData, error: parentError } = await supabase
      .from('instrument_collections')
      .insert({ name: 'Orchestra Set' })
      .select()
      .single()

    if (parentError) throw parentError

    // Insert related records
    const { data: childData, error: childError } = await supabase
      .from('instruments')
      .insert([
        { name: 'Violin 1', collection_id: parentData.id },
        { name: 'Violin 2', collection_id: parentData.id }
      ])
      .select()

    if (childError) throw childError

    return { parent: parentData, children: childData }
  } catch (error) {
    console.error('Batch operation failed:', error)
    throw error
  }
}
```

## 2.7 Performance Optimization

### Rule 2.7.1: Use bulk operations for multiple records
```javascript
// ✅ Good - bulk insert
const { data, error } = await supabase
  .from('instruments')
  .insert(instrumentArray)

// ❌ Bad - individual inserts in loop
for (const instrument of instrumentArray) {
  await supabase.from('instruments').insert(instrument)
}
```

### Rule 2.7.2: Only return necessary columns
```javascript
// Return only what you need
const { data, error } = await supabase
  .from('instruments')
  .update({ status: 'updated' })
  .eq('category', 'violin')
  .select('id, updated_at')  // Not .select('*')
```

## 2.8 Error Handling Best Practices

### Rule 2.8.1: Handle constraint violations
```javascript
const { data, error } = await supabase
  .from('instruments')
  .insert({
    name: 'New Violin',
    serial_number: 'DUPLICATE123'  // Might violate unique constraint
  })
  .select()

if (error) {
  if (error.code === '23505') {  // Unique constraint violation
    console.error('Serial number already exists')
  } else {
    console.error('Insert error:', error.message)
  }
  return
}
```

### Rule 2.8.2: Validate data before operations
```javascript
const insertInstrument = async (instrumentData) => {
  // Validate required fields
  if (!instrumentData.name || !instrumentData.category) {
    throw new Error('Name and category are required')
  }

  const { data, error } = await supabase
    .from('instruments')
    .insert(instrumentData)
    .select()

  if (error) {
    console.error('Database error:', error)
    throw error
  }

  return data[0]
}
```