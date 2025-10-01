export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      database_operations_log: {
        Row: {
          category: string | null
          created_at: string
          details: Json | null
          id: number
          metrics: Json | null
          operation_date: string
          operation_type: string
          pass_number: number | null
          status: string | null
          summary: string | null
          tables_affected: string[] | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          details?: Json | null
          id?: number
          metrics?: Json | null
          operation_date?: string
          operation_type: string
          pass_number?: number | null
          status?: string | null
          summary?: string | null
          tables_affected?: string[] | null
        }
        Update: {
          category?: string | null
          created_at?: string
          details?: Json | null
          id?: number
          metrics?: Json | null
          operation_date?: string
          operation_type?: string
          pass_number?: number | null
          status?: string | null
          summary?: string | null
          tables_affected?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      analytics_deleted_at_coverage: {
        Row: {
          has_deleted_at: boolean | null
          soft_delete_status: string | null
          table_name: unknown | null
          table_size: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          confirmation_code: string | null
          created_at: string | null
          customer_id: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string | null
          salon_id: string | null
          service_count: number | null
          staff_id: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          confirmation_code?: string | null
          created_at?: string | null
          customer_id?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string | null
          salon_id?: string | null
          service_count?: number | null
          staff_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          confirmation_code?: string | null
          created_at?: string | null
          customer_id?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string | null
          salon_id?: string | null
          service_count?: number | null
          staff_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blocked_times: {
        Row: {
          block_type: string | null
          created_at: string | null
          created_by: string | null
          end_time: string | null
          id: string | null
          is_active: boolean | null
          is_recurring: boolean | null
          reason: string | null
          recurrence_pattern: string | null
          salon_id: string | null
          staff_id: string | null
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          block_type?: string | null
          created_at?: string | null
          created_by?: string | null
          end_time?: string | null
          id?: string | null
          is_active?: boolean | null
          is_recurring?: boolean | null
          reason?: string | null
          recurrence_pattern?: string | null
          salon_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          block_type?: string | null
          created_at?: string | null
          created_by?: string | null
          end_time?: string | null
          id?: string | null
          is_active?: boolean | null
          is_recurring?: boolean | null
          reason?: string | null
          recurrence_pattern?: string | null
          salon_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_favorites: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string | null
          notes: string | null
          salon_id: string | null
          service_id: string | null
          staff_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string | null
          notes?: string | null
          salon_id?: string | null
          service_id?: string | null
          staff_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string | null
          notes?: string | null
          salon_id?: string | null
          service_id?: string | null
          staff_id?: string | null
        }
        Relationships: []
      }
      database_optimization_summary: {
        Row: {
          metric: string | null
          value: string | null
        }
        Relationships: []
      }
      database_structure_summary: {
        Row: {
          metrics: Json | null
          status: string | null
        }
        Relationships: []
      }
      database_views_inventory: {
        Row: {
          definition: string | null
          schemaname: unknown | null
          viewname: unknown | null
          viewowner: unknown | null
        }
        Relationships: []
      }
      final_optimization_report: {
        Row: {
          generated_at: string | null
          summary: Json | null
          title: string | null
        }
        Relationships: []
      }
      optimization_report: {
        Row: {
          generated_at: string | null
          metrics: Json | null
          title: string | null
        }
        Relationships: []
      }
      optimization_statistics: {
        Row: {
          last_updated: string | null
          schemas_optimized: number | null
          tables_optimized: number | null
          title: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string | null
          full_name: string | null
          phone: string | null
          id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          full_name?: string | null
          phone?: string | null
          id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          full_name?: string | null
          phone?: string | null
          id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      public_tables_without_rls: {
        Row: {
          rls_status: string | null
          schemaname: unknown | null
          tablename: unknown | null
        }
        Relationships: []
      }
      salons: {
        Row: {
          business_name: string | null
          business_type: string | null
          created_at: string | null
          id: string | null
          name: string | null
          owner_id: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          owner_id?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          owner_id?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          discontinued_at: string | null
          id: string | null
          is_active: boolean | null
          is_bookable: boolean | null
          is_featured: boolean | null
          name: string | null
          salon_id: string | null
          slug: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          experience_years: number | null
          id: string | null
          salon_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          experience_years?: number | null
          id?: string | null
          salon_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          experience_years?: number | null
          id?: string | null
          salon_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      staff_schedules: {
        Row: {
          break_end: string | null
          break_start: string | null
          created_at: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"] | null
          effective_from: string | null
          effective_until: string | null
          end_time: string | null
          id: string | null
          is_active: boolean | null
          salon_id: string | null
          staff_id: string | null
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          created_at?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week"] | null
          effective_from?: string | null
          effective_until?: string | null
          end_time?: string | null
          id?: string | null
          is_active?: boolean | null
          salon_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          created_at?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week"] | null
          effective_from?: string | null
          effective_until?: string | null
          end_time?: string | null
          id?: string | null
          is_active?: boolean | null
          salon_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_services: {
        Row: {
          created_at: string | null
          duration_override: number | null
          id: string | null
          is_available: boolean | null
          notes: string | null
          performed_count: number | null
          price_override: number | null
          proficiency_level:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          rating_average: number | null
          rating_count: number | null
          service_id: string | null
          staff_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_override?: number | null
          id?: string | null
          is_available?: boolean | null
          notes?: string | null
          performed_count?: number | null
          price_override?: number | null
          proficiency_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          rating_average?: number | null
          rating_count?: number | null
          service_id?: string | null
          staff_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_override?: number | null
          id?: string | null
          is_available?: boolean | null
          notes?: string | null
          performed_count?: number | null
          price_override?: number | null
          proficiency_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          rating_average?: number | null
          rating_count?: number | null
          service_id?: string | null
          staff_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      table_statistics: {
        Row: {
          dead_tuples: number | null
          deletes: number | null
          inserts: number | null
          live_tuples: number | null
          schemaname: unknown | null
          tablename: unknown | null
          updates: number | null
        }
        Relationships: []
      }
      tables_without_primary_keys: {
        Row: {
          schema_name: unknown | null
          table_name: unknown | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string | null
          is_active: boolean | null
          permissions: string[] | null
          role: Database["public"]["Enums"]["role_type"] | null
          salon_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["role_type"] | null
          salon_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["role_type"] | null
          salon_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_fulltext_search_to_table: {
        Args: { column_name: string; table_name: string }
        Returns: undefined
      }
      analyze_fk_selectivity: {
        Args: Record<PropertyKey, never>
        Returns: {
          column_name: string
          recommendation: string
          selectivity: number
          table_name: string
        }[]
      }
      audit_http_request: {
        Args: { body?: Json; headers?: Json; method: string; url: string }
        Returns: number
      }
      build_notification_payload: {
        Args: {
          p_data?: Json
          p_event_type: string
          p_record_id: string
          p_salon_id?: string
          p_table_name: string
          p_user_id?: string
        }
        Returns: Json
      }
      cached_auth_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      calculate_business_hours: {
        Args: { end_time: string; salon_uuid?: string; start_time: string }
        Returns: number
      }
      calculate_duration_minutes: {
        Args: { end_time: string; start_time: string }
        Returns: number
      }
      can_access_service_data: {
        Args: { p_service_id: string }
        Returns: boolean
      }
      can_access_service_scheduling: {
        Args: { p_service_id: string }
        Returns: boolean
      }
      can_manage_blocked_times: {
        Args: { p_salon_id: string; p_staff_id: string }
        Returns: boolean
      }
      can_manage_operating_hours: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      can_manage_salon: {
        Args: { salon_uuid: string }
        Returns: boolean
      }
      can_manage_special_dates: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      can_manage_staff_schedule: {
        Args: { p_staff_id: string }
        Returns: boolean
      }
      can_modify_appointment: {
        Args: { appointment_id: string }
        Returns: boolean
      }
      can_update_appointment: {
        Args: { p_appointment_id: string }
        Returns: boolean
      }
      can_update_time_off_request: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      can_user_manage_salon: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      can_view_appointment: {
        Args: { appointment_id: string }
        Returns: boolean
      }
      can_view_time_off_request: {
        Args: { p_salon_id: string; p_staff_id: string }
        Returns: boolean
      }
      check_naming_consistency: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          consistency_score: number
          details: string
        }[]
      }
      check_salon_access: {
        Args: { target_salon_id: string }
        Returns: {
          access_level: string
          can_delete: boolean
          can_read: boolean
          can_write: boolean
          reason: string
        }[]
      }
      clean_phone_number: {
        Args: { phone: string }
        Returns: string
      }
      create_aggregate_index: {
        Args: { agg_type?: string; column_name: string; table_name: string }
        Returns: undefined
      }
      create_aggregate_materialized_view: {
        Args: {
          agg_column: string
          agg_function?: string
          group_column: string
          source_table: string
          view_name: string
        }
        Returns: undefined
      }
      create_analytics_indexes: {
        Args: { table_name: string }
        Returns: undefined
      }
      create_common_sort_indexes: {
        Args: { table_name: string }
        Returns: undefined
      }
      create_compound_orderby_index: {
        Args: { columns_with_order: Json; table_name: string }
        Returns: undefined
      }
      create_fk_composite_indexes: {
        Args: { filter_column: string; fk_column: string; table_name: string }
        Returns: undefined
      }
      create_fk_covering_index: {
        Args: {
          fk_column: string
          included_columns: string[]
          table_name: string
        }
        Returns: undefined
      }
      create_foreign_key_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          column_name: string
          created_index: string
          table_name: string
        }[]
      }
      create_groupby_composite_index: {
        Args: { columns: string[]; table_name: string }
        Returns: undefined
      }
      create_orderby_index: {
        Args: {
          column_name: string
          include_columns?: string[]
          sort_order?: string
          table_name: string
        }
        Returns: undefined
      }
      create_reverse_sort_indexes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_search_config: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_user_salon_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      generate_random_code: {
        Args: { length?: number }
        Returns: string
      }
      generate_search_vector: {
        Args: { input_text: string }
        Returns: unknown
      }
      generate_service_search_text: {
        Args: { service_id: string }
        Returns: string
      }
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
      generate_unique_slug: {
        Args: {
          base_text: string
          column_name: string
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      get_appointment_summary: {
        Args: { p_date_from?: string; p_date_to?: string; p_salon_id?: string }
        Returns: Database["public"]["CompositeTypes"]["appointment_summary"][]
      }
      get_complete_optimization_summary: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_complete_project_summary: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_my_data_summary: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_normalization_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          entity_type: string
          record_count: number
          status: string
          table_component: string
        }[]
      }
      get_optimization_executive_summary: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_phase_6_summary: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_phase_7_executive_summary: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_salon_metrics: {
        Args:
          | { p_date_from: string; p_date_to: string; p_salon_id: string }
          | { p_salon_id: string }
        Returns: {
          metric_date: string
          new_customers: number
          total_appointments: number
          total_revenue: number
        }[]
      }
      get_ultrathink_insights: {
        Args: Record<PropertyKey, never>
        Returns: {
          current_value: number
          entity_name: string
          insight_category: string
          metric_name: string
          priority_level: string
          recommendation: string
        }[]
      }
      get_user_accessible_salons: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_salon_id: {
        Args: { user_uuid?: string }
        Returns: string
      }
      get_user_salon_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_salons: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      has_role: {
        Args: { required_role: string } | { role_name: string; user_id: string }
        Returns: boolean
      }
      has_salon_access: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      increment_counter: {
        Args: {
          column_name: string
          schema_name: string
          table_name: string
          where_clause: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_future_timestamp: {
        Args: { ts: string }
        Returns: boolean
      }
      is_owner: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      is_platform_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_salon_owner: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      is_salon_staff: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      is_staff_member: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      is_valid_email: {
        Args: { email: string }
        Returns: boolean
      }
      is_valid_jsonb_array: {
        Args: { data: Json }
        Returns: boolean
      }
      is_valid_jsonb_object: {
        Args: { data: Json }
        Returns: boolean
      }
      is_valid_phone: {
        Args: { phone: string }
        Returns: boolean
      }
      log_security_event: {
        Args: { p_event_type: string; p_metadata?: Json; p_severity?: string }
        Returns: undefined
      }
      optimize_cascade_operations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      optimize_distinct_column: {
        Args: { column_name: string; table_name: string }
        Returns: undefined
      }
      optimize_pagination_index: {
        Args: {
          filter_column?: string
          order_column: string
          table_name: string
        }
        Returns: undefined
      }
      optimize_top_n_queries: {
        Args: {
          partition_column?: string
          rank_column: string
          table_name: string
        }
        Returns: undefined
      }
      prepare_search_query: {
        Args: { query_text: string }
        Returns: unknown
      }
      refresh_materialized_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_performance_analytics: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      refresh_user_role_claim: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      require_mfa: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      safe_json_extract_text: {
        Args: { data: Json; path: string }
        Returns: string
      }
      search_salons: {
        Args: {
          city?: string
          is_verified_filter?: boolean
          limit_count?: number
          search_term?: string
          state?: string
        }
        Returns: {
          address: Json
          id: string
          is_featured: boolean
          is_verified: boolean
          name: string
          rating_average: number
          slug: string
        }[]
      }
      session_has_mfa: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      soft_delete_user: {
        Args: Record<PropertyKey, never> | { p_user_id: string }
        Returns: boolean
      }
      subscribe_to_channels: {
        Args: { p_user_id: string }
        Returns: {
          channel: string
          description: string
        }[]
      }
      suggest_join_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          priority: string
          suggestion: string
        }[]
      }
      text_similarity: {
        Args: { text1: string; text2: string }
        Returns: number
      }
      update_real_time_metric: {
        Args: { p_metric_name: string; p_metric_value: number }
        Returns: undefined
      }
      user_accessible_salon_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      user_can_access_salon: {
        Args: { target_salon_id: string; user_uuid?: string }
        Returns: boolean
      }
      user_can_access_service: {
        Args: { p_service_id: string }
        Returns: boolean
      }
      user_has_any_role: {
        Args: { allowed_roles: Database["public"]["Enums"]["role_type"][] }
        Returns: boolean
      }
      user_has_permission: {
        Args: { permission_name: string; user_uuid?: string }
        Returns: boolean
      }
      user_has_role: {
        Args: { check_role: Database["public"]["Enums"]["role_type"] }
        Returns: boolean
      }
      user_has_salon_access: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      validate_email: {
        Args: { email: string }
        Returns: boolean
      }
      validate_no_sql_injection: {
        Args: { input_text: string }
        Returns: boolean
      }
      validate_normalized_data_consistency: {
        Args: Record<PropertyKey, never>
        Returns: {
          issue_count: number
          issue_type: string
          sample_ids: string
          table_name: string
        }[]
      }
      validate_phone_number: {
        Args: { phone: string }
        Returns: boolean
      }
      validate_positive_number: {
        Args: { max_value?: number; value: number }
        Returns: boolean
      }
      validate_rls_configuration: {
        Args: Record<PropertyKey, never>
        Returns: {
          policy_count: number
          rls_enabled: boolean
          schema_name: string
          security_assessment: string
          table_name: string
        }[]
      }
      validate_uuid: {
        Args: { id: string }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status:
        | "draft"
        | "pending"
        | "confirmed"
        | "checked_in"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
        | "rescheduled"
      audit_category:
        | "authentication"
        | "data_modification"
        | "access_control"
        | "system_monitoring"
        | "compliance"
        | "maintenance"
        | "security"
        | "performance"
      audit_event_type:
        | "user_action"
        | "system_event"
        | "data_access"
        | "authentication"
        | "authorization"
        | "api_call"
        | "security_event"
      audit_severity: "info" | "debug" | "warning" | "error" | "critical"
      billing_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "cancelled"
      compliance_type:
        | "gdpr"
        | "hipaa"
        | "sox"
        | "pci_dss"
        | "ccpa"
        | "iso27001"
        | "security_audit"
        | "data_retention"
      data_operation: "INSERT" | "UPDATE" | "DELETE"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
      incident_severity: "low" | "medium" | "high" | "critical"
      incident_status:
        | "detected"
        | "investigating"
        | "contained"
        | "resolved"
        | "false_positive"
      invoice_status:
        | "draft"
        | "sent"
        | "viewed"
        | "partially_paid"
        | "paid"
        | "overdue"
        | "cancelled"
        | "refunded"
      loyalty_transaction_type:
        | "earned"
        | "redeemed"
        | "expired"
        | "adjusted"
        | "bonus"
      notification_channel: "email" | "sms" | "push" | "in_app" | "whatsapp"
      notification_status:
        | "queued"
        | "sending"
        | "sent"
        | "delivered"
        | "opened"
        | "clicked"
        | "failed"
        | "bounced"
        | "unsubscribed"
      notification_type:
        | "appointment_confirmation"
        | "appointment_reminder"
        | "appointment_cancelled"
        | "appointment_rescheduled"
        | "promotion"
        | "review_request"
        | "loyalty_update"
        | "staff_message"
        | "system_alert"
        | "welcome"
        | "birthday"
        | "other"
      payment_method:
        | "cash"
        | "card"
        | "online"
        | "wallet"
        | "loyalty_points"
        | "gift_card"
        | "other"
      payment_method_type:
        | "card"
        | "bank_account"
        | "paypal"
        | "stripe"
        | "cash"
        | "check"
        | "crypto"
        | "other"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "partially_refunded"
        | "cancelled"
      period_type:
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
      proficiency_level:
        | "trainee"
        | "beginner"
        | "intermediate"
        | "advanced"
        | "expert"
        | "master"
      purchase_order_status:
        | "draft"
        | "submitted"
        | "approved"
        | "ordered"
        | "partially_received"
        | "received"
        | "cancelled"
      referral_status:
        | "pending"
        | "accepted"
        | "completed"
        | "expired"
        | "cancelled"
      review_status:
        | "pending"
        | "approved"
        | "rejected"
        | "flagged"
        | "hidden"
        | "deleted"
      role_type:
        | "super_admin"
        | "platform_admin"
        | "tenant_owner"
        | "salon_owner"
        | "salon_manager"
        | "senior_staff"
        | "staff"
        | "junior_staff"
        | "customer"
        | "vip_customer"
        | "guest"
      security_incident_type:
        | "failed_login"
        | "brute_force"
        | "suspicious_activity"
        | "data_breach"
        | "unauthorized_access"
        | "privilege_escalation"
        | "high_risk_event"
        | "malware_detected"
        | "sql_injection"
        | "xss_attempt"
      service_status: "active" | "inactive" | "discontinued" | "seasonal"
      staff_status:
        | "available"
        | "busy"
        | "break"
        | "off_duty"
        | "vacation"
        | "sick_leave"
        | "training"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "cancelled"
        | "unpaid"
        | "incomplete"
        | "incomplete_expired"
        | "paused"
      thread_priority: "low" | "normal" | "high" | "urgent"
      thread_status: "open" | "in_progress" | "resolved" | "closed" | "archived"
      time_off_status: "pending" | "approved" | "rejected" | "cancelled"
    }
    CompositeTypes: {
      appointment_summary: {
        appointment_id: string | null
        salon_name: string | null
        service_names: string[] | null
        staff_name: string | null
        customer_name: string | null
        start_time: string | null
        total_amount: number | null
        status: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never