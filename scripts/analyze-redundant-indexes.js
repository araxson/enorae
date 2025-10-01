#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function findRedundantIndexes() {
  console.log('🔍 Step 1: Identifying Redundant Indexes\n');

  const query = `
    WITH index_columns AS (
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef,
        string_to_array(
          regexp_replace(
            regexp_replace(indexdef, '.*\\((.*)\\)', '\\1'),
            ' (ASC|DESC|NULLS (FIRST|LAST))', '', 'g'
          ),
          ', '
        ) as index_cols
      FROM pg_indexes
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ),
    redundant_candidates AS (
      SELECT
        i1.schemaname,
        i1.tablename,
        i1.indexname as redundant_index,
        i1.index_cols as redundant_cols,
        i2.indexname as covering_index,
        i2.index_cols as covering_cols,
        array_length(i1.index_cols, 1) as redundant_col_count,
        array_length(i2.index_cols, 1) as covering_col_count
      FROM index_columns i1
      JOIN index_columns i2
        ON i1.schemaname = i2.schemaname
        AND i1.tablename = i2.tablename
        AND i1.indexname != i2.indexname
      WHERE
        i1.index_cols[1:array_length(i1.index_cols, 1)]
          = i2.index_cols[1:array_length(i1.index_cols, 1)]
        AND array_length(i2.index_cols, 1) > array_length(i1.index_cols, 1)
    )
    SELECT
      schemaname || '.' || tablename as table_name,
      redundant_index,
      array_to_string(redundant_cols, ', ') as redundant_columns,
      covering_index,
      array_to_string(covering_cols, ', ') as covering_columns,
      pg_size_pretty(pg_relation_size(schemaname || '.' || redundant_index)) as index_size
    FROM redundant_candidates
    ORDER BY schemaname, tablename, redundant_index;
  `;

  const result = await client.query(query);
  return result.rows;
}

async function analyzeIndexUsage(indexNames) {
  console.log('\n📊 Step 2: Analyzing Index Usage Statistics\n');

  const query = `
    SELECT
      schemaname,
      tablename,
      indexrelname,
      idx_scan as times_used,
      idx_tup_read as rows_read,
      idx_tup_fetch as rows_fetched,
      pg_size_pretty(pg_relation_size(indexrelid)) as size
    FROM pg_stat_user_indexes
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
      ${indexNames.length > 0 ? `AND indexrelname IN (${indexNames.map(n => `'${n}'`).join(', ')})` : ''}
    ORDER BY idx_scan ASC, schemaname, tablename;
  `;

  try {
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Redundant Index Cleanup Analysis\n');
  console.log('=' .repeat(60));

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const redundantIndexes = await findRedundantIndexes();

    if (!redundantIndexes || redundantIndexes.length === 0) {
      console.log('✅ No redundant indexes found! Your database is well-optimized.');
      return;
    }

    console.log(`\n📋 Found ${redundantIndexes.length} redundant indexes:\n`);
    console.table(redundantIndexes);

    const indexNames = redundantIndexes.map(r => r.redundant_index);

    if (indexNames.length > 0) {
      const usageStats = await analyzeIndexUsage(indexNames);

      if (usageStats && usageStats.length > 0) {
        console.log('\n📈 Usage Statistics:\n');
        console.table(usageStats);
      }
    }

    // Calculate total savings
    const totalSize = redundantIndexes.reduce((acc, idx) => {
      const sizeMatch = idx.index_size.match(/(\d+)\s*(\w+)/);
      if (sizeMatch) {
        const value = parseInt(sizeMatch[1]);
        const unit = sizeMatch[2];
        const bytes = unit === 'MB' ? value * 1024 * 1024 :
                     unit === 'KB' ? value * 1024 : value;
        return acc + bytes;
      }
      return acc;
    }, 0);

    console.log('\n💾 Storage Impact:');
    console.log(`   Total space reclaimable: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Number of indexes to remove: ${redundantIndexes.length}`);

    // Generate DROP statements
    console.log('\n🗑️  Migration SQL (Step 3):\n');
    console.log('BEGIN;');
    console.log('');
    redundantIndexes.forEach(idx => {
      console.log(`-- Remove: ${idx.redundant_index}`);
      console.log(`-- Covered by: ${idx.covering_index} (${idx.covering_columns})`);
      console.log(`DROP INDEX IF EXISTS ${idx.table_name.split('.')[0]}.${idx.redundant_index};`);
      console.log('');
    });
    console.log('COMMIT;');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

main();