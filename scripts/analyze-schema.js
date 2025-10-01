const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeSchema() {
  try {
    // Query to get all tables with column counts
    const { data, error } = await supabase.rpc('analyze_schema', {
      query_sql: `
        SELECT
          t.table_schema,
          t.table_name,
          COUNT(c.column_name) as column_count
        FROM information_schema.tables t
        LEFT JOIN information_schema.columns c
          ON t.table_schema = c.table_schema
          AND t.table_name = c.table_name
        WHERE t.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
        GROUP BY t.table_schema, t.table_name
        ORDER BY column_count DESC, t.table_name;
      `
    });

    if (error) {
      // Try direct query instead
      const { data: pgData, error: pgError } = await supabase
        .from('information_schema.tables')
        .select('*')
        .limit(1);

      console.log('Error with RPC:', error);
      console.log('Trying alternative approach...');

      // Use raw SQL query via PostgREST
      const response = await fetch(
        `${supabaseUrl}/rest/v1/rpc/query`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              SELECT
                schemaname,
                tablename
              FROM pg_tables
              WHERE schemaname = 'public'
              ORDER BY tablename;
            `
          })
        }
      );

      const tables = await response.json();
      console.log('Tables:', JSON.stringify(tables, null, 2));
    } else {
      console.log('Schema Analysis:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error analyzing schema:', error);
  }
}

analyzeSchema();