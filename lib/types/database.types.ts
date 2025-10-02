/**
 * Supabase Database Types
 *
 * Auto-generated from Supabase database schema
 *
 * Generated: 2025-10-01 (after security & performance fixes)
 * Schemas: public (views-based type generation)
 *
 * CRITICAL:
 * - Always query from public views (not schema tables)
 * - Use Database['public']['Views'] for types
 * - Never use Database['public']['Tables'] for queries
 *
 * @see docs/03-database/best-practices.md
 * @see CLAUDE.md
 */

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
  admin: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      foreign_key_analysis: {
        Row: {
          column_name: unknown | null
          constraint_name: unknown | null
          foreign_column_name: unknown | null
          foreign_table_name: unknown | null
          foreign_table_schema: unknown | null
          has_index: boolean | null
          index_name: unknown | null
          table_name: unknown | null
          table_schema: unknown | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_missing_fk_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          column_name: string
          constraint_name: string
          create_index_sql: string
          table_name: string
          table_schema: string
        }[]
      }
      refresh_foreign_key_analysis: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  analytics: {
    Tables: {
      daily_metrics: {
        Row: {
          active_staff_count: number | null
          anomaly_score: number | null
          cancelled_appointments: number | null
          completed_appointments: number | null
          created_at: string
          forecast_accuracy: number | null
          id: string
          last_real_time_update: string | null
          metric_at: string
          new_customers: number | null
          no_show_appointments: number | null
          predicted_demand: Json | null
          product_revenue: number | null
          real_time_updates_count: number | null
          returning_customers: number | null
          salon_id: string
          service_revenue: number | null
          streaming_metrics: Json | null
          total_appointments: number | null
          total_revenue: number | null
          trend_indicators: Json | null
          updated_at: string
          utilization_rate: number | null
        }
        Insert: {
          active_staff_count?: number | null
          anomaly_score?: number | null
          cancelled_appointments?: number | null
          completed_appointments?: number | null
          created_at?: string
          forecast_accuracy?: number | null
          id?: string
          last_real_time_update?: string | null
          metric_at: string
          new_customers?: number | null
          no_show_appointments?: number | null
          predicted_demand?: Json | null
          product_revenue?: number | null
          real_time_updates_count?: number | null
          returning_customers?: number | null
          salon_id: string
          service_revenue?: number | null
          streaming_metrics?: Json | null
          total_appointments?: number | null
          total_revenue?: number | null
          trend_indicators?: Json | null
          updated_at?: string
          utilization_rate?: number | null
        }
        Update: {
          active_staff_count?: number | null
          anomaly_score?: number | null
          cancelled_appointments?: number | null
          completed_appointments?: number | null
          created_at?: string
          forecast_accuracy?: number | null
          id?: string
          last_real_time_update?: string | null
          metric_at?: string
          new_customers?: number | null
          no_show_appointments?: number | null
          predicted_demand?: Json | null
          product_revenue?: number | null
          real_time_updates_count?: number | null
          returning_customers?: number | null
          salon_id?: string
          service_revenue?: number | null
          streaming_metrics?: Json | null
          total_appointments?: number | null
          total_revenue?: number | null
          trend_indicators?: Json | null
          updated_at?: string
          utilization_rate?: number | null
        }
        Relationships: []
      }
      manual_transactions: {
        Row: {
          appointment_id: string | null
          created_at: string
          created_by_id: string | null
          customer_id: string | null
          id: string
          payment_method: string | null
          salon_id: string
          staff_id: string | null
          transaction_at: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          created_by_id?: string | null
          customer_id?: string | null
          id?: string
          payment_method?: string | null
          salon_id: string
          staff_id?: string | null
          transaction_at: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          created_by_id?: string | null
          customer_id?: string | null
          id?: string
          payment_method?: string | null
          salon_id?: string
          staff_id?: string | null
          transaction_at?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      operational_metrics: {
        Row: {
          anomaly_score: number | null
          busiest_day_of_week: number | null
          created_at: string
          forecast_accuracy: number | null
          id: string
          last_real_time_update: string | null
          metric_at: string
          peak_hour: number | null
          predicted_demand: Json | null
          real_time_updates_count: number | null
          salon_id: string
          streaming_metrics: Json | null
          trend_indicators: Json | null
          updated_at: string
        }
        Insert: {
          anomaly_score?: number | null
          busiest_day_of_week?: number | null
          created_at?: string
          forecast_accuracy?: number | null
          id?: string
          last_real_time_update?: string | null
          metric_at: string
          peak_hour?: number | null
          predicted_demand?: Json | null
          real_time_updates_count?: number | null
          salon_id: string
          streaming_metrics?: Json | null
          trend_indicators?: Json | null
          updated_at?: string
        }
        Update: {
          anomaly_score?: number | null
          busiest_day_of_week?: number | null
          created_at?: string
          forecast_accuracy?: number | null
          id?: string
          last_real_time_update?: string | null
          metric_at?: string
          peak_hour?: number | null
          predicted_demand?: Json | null
          real_time_updates_count?: number | null
          salon_id?: string
          streaming_metrics?: Json | null
          trend_indicators?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_avg_days_between_visits: {
        Args: { p_customer_id: string; p_salon_id: string }
        Returns: number
      }
      calculate_customer_favorite_staff: {
        Args: { p_customer_id: string; p_salon_id: string }
        Returns: string
      }
      calculate_customer_metrics: {
        Args: { p_customer_id: string; p_salon_id: string }
        Returns: undefined
      }
      calculate_customer_rates: {
        Args: { p_customer_id: string; p_salon_id: string }
        Returns: {
          cancellation_rate: number
          no_show_rate: number
        }[]
      }
      calculate_customer_review_stats: {
        Args: { p_customer_id: string; p_salon_id: string }
        Returns: {
          average_rating: number
          review_count: number
        }[]
      }
      calculate_customer_service_stats: {
        Args: { p_customer_id: string; p_salon_id: string }
        Returns: {
          favorite_service_id: string
          total_services: number
        }[]
      }
      calculate_customer_visit_stats: {
        Args: { p_customer_id: string; p_salon_id: string }
        Returns: {
          cancelled_appointments: number
          completed_appointments: number
          first_visit_date: string
          last_visit_date: string
          no_show_appointments: number
          total_appointments: number
          total_visits: number
        }[]
      }
      calculate_daily_appointment_metrics: {
        Args: { p_date: string; p_salon_id: string }
        Returns: {
          appointment_revenue: number
          cancelled_appointments: number
          completed_appointments: number
          no_show_appointments: number
          total_appointments: number
        }[]
      }
      calculate_daily_customer_metrics: {
        Args: { p_date: string; p_salon_id: string }
        Returns: {
          new_customers: number
          returning_customers: number
          unique_customers: number
        }[]
      }
      calculate_daily_metrics_v2: {
        Args: { p_date?: string; p_salon_id: string }
        Returns: undefined
      }
      calculate_daily_service_metrics: {
        Args: { p_date: string; p_salon_id: string }
        Returns: {
          avg_service_duration: unknown
          most_popular_service: string
          service_revenue: number
          services_performed: number
        }[]
      }
      database_optimization_complete: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      refresh_daily_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_service_performance: {
        Args: { p_service_id: string }
        Returns: undefined
      }
      update_salon_stats: {
        Args: { p_salon_id: string }
        Returns: undefined
      }
      user_owns_salon: {
        Args: { salon_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  app_realtime: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  archive: {
    Tables: {
      events_archived: {
        Row: {
          action: string
          batch_id: string | null
          consent_id: string | null
          correlation_id: string | null
          created_at: string
          data_classification: string | null
          data_subject_id: string | null
          device_fingerprint: string | null
          encrypted_data: string | null
          encryption_key_id: string | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          event_category: Database["public"]["Enums"]["audit_category"]
          event_timestamp: string
          event_type: Database["public"]["Enums"]["audit_event_type"]
          geolocation: Json
          id: string
          ingestion_timestamp: string | null
          ip_address: unknown | null
          metadata: Json
          new_values: Json | null
          old_values: Json | null
          processing_duration_ms: number | null
          processing_lawful_basis: string | null
          regulatory_tags: string[] | null
          request_id: string | null
          retention_until: string | null
          risk_score: number | null
          salon_id: string | null
          session_id: string | null
          severity: Database["public"]["Enums"]["audit_severity"]
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          batch_id?: string | null
          consent_id?: string | null
          correlation_id?: string | null
          created_at?: string
          data_classification?: string | null
          data_subject_id?: string | null
          device_fingerprint?: string | null
          encrypted_data?: string | null
          encryption_key_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          event_category: Database["public"]["Enums"]["audit_category"]
          event_timestamp?: string
          event_type: Database["public"]["Enums"]["audit_event_type"]
          geolocation?: Json
          id?: string
          ingestion_timestamp?: string | null
          ip_address?: unknown | null
          metadata?: Json
          new_values?: Json | null
          old_values?: Json | null
          processing_duration_ms?: number | null
          processing_lawful_basis?: string | null
          regulatory_tags?: string[] | null
          request_id?: string | null
          retention_until?: string | null
          risk_score?: number | null
          salon_id?: string | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["audit_severity"]
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          batch_id?: string | null
          consent_id?: string | null
          correlation_id?: string | null
          created_at?: string
          data_classification?: string | null
          data_subject_id?: string | null
          device_fingerprint?: string | null
          encrypted_data?: string | null
          encryption_key_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          event_category?: Database["public"]["Enums"]["audit_category"]
          event_timestamp?: string
          event_type?: Database["public"]["Enums"]["audit_event_type"]
          geolocation?: Json
          id?: string
          ingestion_timestamp?: string | null
          ip_address?: unknown | null
          metadata?: Json
          new_values?: Json | null
          old_values?: Json | null
          processing_duration_ms?: number | null
          processing_lawful_basis?: string | null
          regulatory_tags?: string[] | null
          request_id?: string | null
          retention_until?: string | null
          risk_score?: number | null
          salon_id?: string | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["audit_severity"]
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  audit: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          event_category: string
          event_type: string
          id: string
          impersonator_id: string | null
          ip_address: unknown | null
          is_success: boolean
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          request_id: string | null
          salon_id: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          event_category: string
          event_type: string
          id?: string
          impersonator_id?: string | null
          ip_address?: unknown | null
          is_success?: boolean
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          request_id?: string | null
          salon_id?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          event_category?: string
          event_type?: string
          id?: string
          impersonator_id?: string | null
          ip_address?: unknown | null
          is_success?: boolean
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          request_id?: string | null
          salon_id?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_partitions: {
        Args: Record<PropertyKey, never>
        Returns: {
          partition_name: string
          row_count: number
          size_bytes: number
        }[]
      }
      calculate_event_risk_score: {
        Args: {
          p_event_type: Database["public"]["Enums"]["audit_event_type"]
          p_ip_address: unknown
          p_severity: Database["public"]["Enums"]["audit_severity"]
          p_user_id: string
        }
        Returns: number
      }
      can_view_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      comprehensive_rls_audit: {
        Args: Record<PropertyKey, never>
        Returns: {
          has_sensitive_columns: boolean
          policy_count: number
          recommendation: string
          risk_level: string
          rls_enabled: boolean
          schema_name: string
          table_name: string
        }[]
      }
      create_monthly_partition: {
        Args: { partition_date: string }
        Returns: undefined
      }
      create_monthly_partitions: {
        Args: { p_year?: number }
        Returns: undefined
      }
      create_partition_indexes: {
        Args: { partition_name: string }
        Returns: undefined
      }
      database_health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      database_health_summary: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      enable_tracking: {
        Args: { target_table: unknown }
        Returns: undefined
      }
      generate_security_report: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_record_history: {
        Args: { p_limit?: number; p_record_id: string; p_table_name: string }
        Returns: {
          changed_at: string
          changed_by: string
          new_data: Json
          old_data: Json
          operation: string
        }[]
      }
      log_event: {
        Args: {
          p_action: string
          p_encrypt_sensitive?: boolean
          p_entity_id?: string
          p_entity_type?: string
          p_event_category: Database["public"]["Enums"]["audit_category"]
          p_event_type: Database["public"]["Enums"]["audit_event_type"]
          p_metadata?: Json
          p_new_values?: Json
          p_old_values?: Json
          p_regulatory_tags?: string[]
          p_severity?: Database["public"]["Enums"]["audit_severity"]
        }
        Returns: string
      }
      log_security_incident: {
        Args: {
          p_affected_resources?: Json
          p_attack_vector?: string
          p_description: string
          p_incident_type: Database["public"]["Enums"]["security_incident_type"]
          p_severity: Database["public"]["Enums"]["incident_severity"]
        }
        Returns: string
      }
      log_sensitive_operation: {
        Args: {
          new_values?: Json
          old_values?: Json
          operation_type: string
          record_id: string
          table_name: string
        }
        Returns: string
      }
      maintain_partitions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      primary_key_columns: {
        Args: { entity_oid: unknown }
        Returns: string[]
      }
      security_health_check: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_category: string
          check_name: string
          details: string
          recommendations: string
          severity: string
          status: string
        }[]
      }
      trigger_security_alert: {
        Args: { p_event_id: string; p_risk_score: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  auth: {
    Tables: {
      audit_log_entries: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string | null
          ip_address: string
          payload: Json | null
        }
        Insert: {
          created_at?: string | null
          id: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Relationships: []
      }
      flow_state: {
        Row: {
          auth_code: string
          auth_code_issued_at: string | null
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"]
          created_at: string | null
          id: string
          provider_access_token: string | null
          provider_refresh_token: string | null
          provider_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth_code: string
          auth_code_issued_at?: string | null
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"]
          created_at?: string | null
          id: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth_code?: string
          auth_code_issued_at?: string | null
          authentication_method?: string
          code_challenge?: string
          code_challenge_method?: Database["auth"]["Enums"]["code_challenge_method"]
          created_at?: string | null
          id?: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      identities: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identity_data: Json
          last_sign_in_at: string | null
          provider: string
          provider_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data: Json
          last_sign_in_at?: string | null
          provider: string
          provider_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data?: Json
          last_sign_in_at?: string | null
          provider?: string
          provider_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      instances: {
        Row: {
          created_at: string | null
          id: string
          raw_base_config: string | null
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      mfa_amr_claims: {
        Row: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Update: {
          authentication_method?: string
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mfa_amr_claims_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_challenges: {
        Row: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          otp_code: string | null
          verified_at: string | null
          web_authn_session_data: Json | null
        }
        Insert: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          otp_code?: string | null
          verified_at?: string | null
          web_authn_session_data?: Json | null
        }
        Update: {
          created_at?: string
          factor_id?: string
          id?: string
          ip_address?: unknown
          otp_code?: string | null
          verified_at?: string | null
          web_authn_session_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_challenges_auth_factor_id_fkey"
            columns: ["factor_id"]
            isOneToOne: false
            referencedRelation: "mfa_factors"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_factors: {
        Row: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name: string | null
          id: string
          last_challenged_at: string | null
          phone: string | null
          secret: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
          web_authn_aaguid: string | null
          web_authn_credential: Json | null
        }
        Insert: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id: string
          last_challenged_at?: string | null
          phone?: string | null
          secret?: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
          web_authn_aaguid?: string | null
          web_authn_credential?: Json | null
        }
        Update: {
          created_at?: string
          factor_type?: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id?: string
          last_challenged_at?: string | null
          phone?: string | null
          secret?: string | null
          status?: Database["auth"]["Enums"]["factor_status"]
          updated_at?: string
          user_id?: string
          web_authn_aaguid?: string | null
          web_authn_credential?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_factors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_clients: {
        Row: {
          client_id: string
          client_name: string | null
          client_secret_hash: string
          client_uri: string | null
          created_at: string
          deleted_at: string | null
          grant_types: string
          id: string
          logo_uri: string | null
          redirect_uris: string
          registration_type: Database["auth"]["Enums"]["oauth_registration_type"]
          updated_at: string
        }
        Insert: {
          client_id: string
          client_name?: string | null
          client_secret_hash: string
          client_uri?: string | null
          created_at?: string
          deleted_at?: string | null
          grant_types: string
          id: string
          logo_uri?: string | null
          redirect_uris: string
          registration_type: Database["auth"]["Enums"]["oauth_registration_type"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_name?: string | null
          client_secret_hash?: string
          client_uri?: string | null
          created_at?: string
          deleted_at?: string | null
          grant_types?: string
          id?: string
          logo_uri?: string | null
          redirect_uris?: string
          registration_type?: Database["auth"]["Enums"]["oauth_registration_type"]
          updated_at?: string
        }
        Relationships: []
      }
      one_time_tokens: {
        Row: {
          created_at: string
          id: string
          relates_to: string
          token_hash: string
          token_type: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          relates_to: string
          token_hash: string
          token_type: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          relates_to?: string
          token_hash?: string
          token_type?: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "one_time_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      refresh_tokens: {
        Row: {
          created_at: string | null
          id: number
          instance_id: string | null
          parent: string | null
          revoked: boolean | null
          session_id: string | null
          token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      saml_providers: {
        Row: {
          attribute_mapping: Json | null
          created_at: string | null
          entity_id: string
          id: string
          metadata_url: string | null
          metadata_xml: string
          name_id_format: string | null
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id: string
          id: string
          metadata_url?: string | null
          metadata_xml: string
          name_id_format?: string | null
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id?: string
          id?: string
          metadata_url?: string | null
          metadata_xml?: string
          name_id_format?: string | null
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_providers_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      saml_relay_states: {
        Row: {
          created_at: string | null
          flow_state_id: string | null
          for_email: string | null
          id: string
          redirect_to: string | null
          request_id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          id: string
          redirect_to?: string | null
          request_id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          id?: string
          redirect_to?: string | null
          request_id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_relay_states_flow_state_id_fkey"
            columns: ["flow_state_id"]
            isOneToOne: false
            referencedRelation: "flow_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saml_relay_states_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_migrations: {
        Row: {
          version: string
        }
        Insert: {
          version: string
        }
        Update: {
          version?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          aal: Database["auth"]["Enums"]["aal_level"] | null
          created_at: string | null
          factor_id: string | null
          id: string
          ip: unknown | null
          not_after: string | null
          refreshed_at: string | null
          tag: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id: string
          ip?: unknown | null
          not_after?: string | null
          refreshed_at?: string | null
          tag?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id?: string
          ip?: unknown | null
          not_after?: string | null
          refreshed_at?: string | null
          tag?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sso_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sso_domains_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      sso_providers: {
        Row: {
          created_at: string | null
          disabled: boolean | null
          id: string
          resource_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          disabled?: boolean | null
          id: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          disabled?: boolean | null
          id?: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string
          instance_id: string | null
          invited_at: string | null
          is_anonymous: boolean
          is_sso_user: boolean
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id: string
          instance_id?: string | null
          invited_at?: string | null
          is_anonymous?: boolean
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string
          instance_id?: string | null
          invited_at?: string | null
          is_anonymous?: boolean
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3"
      code_challenge_method: "s256" | "plain"
      factor_status: "unverified" | "verified"
      factor_type: "totp" | "webauthn" | "phone"
      oauth_registration_type: "dynamic" | "manual"
      one_time_token_type:
        | "confirmation_token"
        | "reauthentication_token"
        | "recovery_token"
        | "email_change_token_new"
        | "email_change_token_current"
        | "phone_change_token"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  catalog: {
    Tables: {
      service_booking_rules: {
        Row: {
          buffer_minutes: number | null
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          duration_minutes: number | null
          id: string
          max_advance_booking_days: number | null
          min_advance_booking_hours: number | null
          service_id: string
          total_duration_minutes: number | null
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          buffer_minutes?: number | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          duration_minutes?: number | null
          id?: string
          max_advance_booking_days?: number | null
          min_advance_booking_hours?: number | null
          service_id: string
          total_duration_minutes?: number | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          buffer_minutes?: number | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          duration_minutes?: number | null
          id?: string
          max_advance_booking_days?: number | null
          min_advance_booking_hours?: number | null
          service_id?: string
          total_duration_minutes?: number | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_booking_rules_service"
            columns: ["service_id"]
            isOneToOne: true
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          depth: number | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          path: string[] | null
          salon_id: string
          slug: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          depth?: number | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          path?: string[] | null
          salon_id: string
          slug: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          depth?: number | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          path?: string[] | null
          salon_id?: string
          slug?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_core_norm_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_pricing: {
        Row: {
          base_price: number
          commission_rate: number | null
          cost: number | null
          created_at: string
          created_by_id: string | null
          currency_code: string
          current_price: number | null
          deleted_at: string | null
          deleted_by_id: string | null
          id: string
          is_taxable: boolean
          profit_margin: number | null
          sale_price: number | null
          service_id: string
          tax_rate: number | null
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          base_price: number
          commission_rate?: number | null
          cost?: number | null
          created_at?: string
          created_by_id?: string | null
          currency_code?: string
          current_price?: number | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          is_taxable?: boolean
          profit_margin?: number | null
          sale_price?: number | null
          service_id: string
          tax_rate?: number | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          base_price?: number
          commission_rate?: number | null
          cost?: number | null
          created_at?: string
          created_by_id?: string | null
          currency_code?: string
          current_price?: number | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          is_taxable?: boolean
          profit_margin?: number | null
          sale_price?: number | null
          service_id?: string
          tax_rate?: number | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_pricing_service"
            columns: ["service_id"]
            isOneToOne: true
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          description: string | null
          discontinued_at: string | null
          id: string
          is_active: boolean
          is_bookable: boolean
          is_featured: boolean
          name: string
          salon_id: string
          slug: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          description?: string | null
          discontinued_at?: string | null
          id?: string
          is_active?: boolean
          is_bookable?: boolean
          is_featured?: boolean
          name: string
          salon_id: string
          slug: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          description?: string | null
          discontinued_at?: string | null
          id?: string
          is_active?: boolean
          is_bookable?: boolean
          is_featured?: boolean
          name?: string
          salon_id?: string
          slug?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_services_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_services: {
        Row: {
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          duration_override: number | null
          id: string
          is_available: boolean
          notes: string | null
          performed_count: number | null
          price_override: number | null
          proficiency_level:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          rating_average: number | null
          rating_count: number | null
          service_id: string
          staff_id: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          duration_override?: number | null
          id?: string
          is_available?: boolean
          notes?: string | null
          performed_count?: number | null
          price_override?: number | null
          proficiency_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          rating_average?: number | null
          rating_count?: number | null
          service_id: string
          staff_id: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          duration_override?: number | null
          id?: string
          is_available?: boolean
          notes?: string | null
          performed_count?: number | null
          price_override?: number | null
          proficiency_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          rating_average?: number | null
          rating_count?: number | null
          service_id?: string
          staff_id?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_services_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_dynamic_pricing: {
        Args: {
          p_appointment_time: string
          p_base_price: number
          p_salon_id: string
          p_service_id: string
        }
        Returns: number
      }
      calculate_service_duration: {
        Args: { p_service_id: string; p_variant_id?: string }
        Returns: number
      }
      calculate_service_price: {
        Args: {
          p_booking_time?: string
          p_customer_id?: string
          p_service_id: string
        }
        Returns: number
      }
      check_is_package: {
        Args: { p_service_id: string }
        Returns: boolean
      }
      get_service_with_details: {
        Args: Record<PropertyKey, never> | { p_service_id: string }
        Returns: {
          category_name: string
          description: string
          duration_minutes: number
          price: number
          service_id: string
          service_name: string
        }[]
      }
      search_services_fulltext: {
        Args: { p_salon_id?: string; search_query: string }
        Returns: {
          description: string
          id: string
          name: string
          rank: number
        }[]
      }
      search_services_optimized: {
        Args: { p_salon_id?: string; search_query: string }
        Returns: {
          description: string
          id: string
          name: string
          similarity: number
        }[]
      }
      update_service_with_version: {
        Args: {
          p_expected_version: number
          p_service_id: string
          p_updates: Json
        }
        Returns: boolean
      }
      user_can_manage_service: {
        Args: { service_uuid: string }
        Returns: boolean
      }
      validate_coupon: {
        Args: {
          p_amount: number
          p_coupon_code: string
          p_customer_id: string
          p_salon_id: string
        }
        Returns: {
          discount_amount: number
          discount_type: string
          is_valid: boolean
          message: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  communication: {
    Tables: {
      message_threads: {
        Row: {
          appointment_id: string | null
          created_at: string
          customer_id: string
          id: string
          last_message_at: string | null
          last_message_by_id: string | null
          metadata: Json
          priority: Database["public"]["Enums"]["thread_priority"]
          salon_id: string
          staff_id: string | null
          status: Database["public"]["Enums"]["thread_status"]
          subject: string | null
          unread_count_customer: number
          unread_count_staff: number
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          last_message_at?: string | null
          last_message_by_id?: string | null
          metadata?: Json
          priority?: Database["public"]["Enums"]["thread_priority"]
          salon_id: string
          staff_id?: string | null
          status?: Database["public"]["Enums"]["thread_status"]
          subject?: string | null
          unread_count_customer?: number
          unread_count_staff?: number
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          last_message_at?: string | null
          last_message_by_id?: string | null
          metadata?: Json
          priority?: Database["public"]["Enums"]["thread_priority"]
          salon_id?: string
          staff_id?: string | null
          status?: Database["public"]["Enums"]["thread_status"]
          subject?: string | null
          unread_count_customer?: number
          unread_count_staff?: number
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          context_id: string | null
          context_type: string | null
          created_at: string
          deleted_at: string | null
          deleted_by_id: string | null
          edited_at: string | null
          from_user_id: string
          id: string
          is_deleted: boolean
          is_edited: boolean
          is_read: boolean
          metadata: Json | null
          read_at: string | null
          to_user_id: string
          updated_at: string
        }
        Insert: {
          content: string
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by_id?: string | null
          edited_at?: string | null
          from_user_id: string
          id?: string
          is_deleted?: boolean
          is_edited?: boolean
          is_read?: boolean
          metadata?: Json | null
          read_at?: string | null
          to_user_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by_id?: string | null
          edited_at?: string | null
          from_user_id?: string
          id?: string
          is_deleted?: boolean
          is_edited?: boolean
          is_read?: boolean
          metadata?: Json | null
          read_at?: string | null
          to_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      webhook_queue: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string
          headers: Json | null
          id: string
          last_error: string | null
          max_attempts: number | null
          next_retry_at: string | null
          payload: Json
          status: string | null
          updated_at: string
          url: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          headers?: Json | null
          id?: string
          last_error?: string | null
          max_attempts?: number | null
          next_retry_at?: string | null
          payload: Json
          status?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          headers?: Json | null
          id?: string
          last_error?: string | null
          max_attempts?: number | null
          next_retry_at?: string | null
          payload?: Json
          status?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_notification_batch: {
        Args: { p_batch_size?: number; p_worker_id?: string }
        Returns: {
          notification_id: string
          queue_id: string
        }[]
      }
      cleanup_stale_locks: {
        Args: { p_timeout_minutes?: number }
        Returns: number
      }
      complete_notification: {
        Args: { p_queue_id: string; p_worker_id?: string }
        Returns: boolean
      }
      fail_notification: {
        Args: {
          p_error_message: string
          p_queue_id: string
          p_retry?: boolean
          p_worker_id?: string
        }
        Returns: boolean
      }
      get_or_create_thread: {
        Args: {
          p_appointment_id?: string
          p_customer_id: string
          p_salon_id: string
          p_staff_id?: string
          p_subject?: string
        }
        Returns: string
      }
      get_unread_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_unread_counts: {
        Args: { p_user_id: string }
        Returns: {
          messages: number
          notifications: number
          total: number
        }[]
      }
      mark_notifications_read: {
        Args: { p_notification_ids?: string[]; p_user_id: string }
        Returns: number
      }
      process_webhook_queue: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_notification: {
        Args: {
          p_channels?: string[]
          p_data?: Json
          p_message: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  cron: {
    Tables: {
      job: {
        Row: {
          active: boolean
          command: string
          database: string
          jobid: number
          jobname: string | null
          nodename: string
          nodeport: number
          schedule: string
          username: string
        }
        Insert: {
          active?: boolean
          command: string
          database?: string
          jobid?: number
          jobname?: string | null
          nodename?: string
          nodeport?: number
          schedule: string
          username?: string
        }
        Update: {
          active?: boolean
          command?: string
          database?: string
          jobid?: number
          jobname?: string | null
          nodename?: string
          nodeport?: number
          schedule?: string
          username?: string
        }
        Relationships: []
      }
      job_run_details: {
        Row: {
          command: string | null
          database: string | null
          end_time: string | null
          job_pid: number | null
          jobid: number | null
          return_message: string | null
          runid: number
          start_time: string | null
          status: string | null
          username: string | null
        }
        Insert: {
          command?: string | null
          database?: string | null
          end_time?: string | null
          job_pid?: number | null
          jobid?: number | null
          return_message?: string | null
          runid?: number
          start_time?: string | null
          status?: string | null
          username?: string | null
        }
        Update: {
          command?: string | null
          database?: string | null
          end_time?: string | null
          job_pid?: number | null
          jobid?: number | null
          return_message?: string | null
          runid?: number
          start_time?: string | null
          status?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      alter_job: {
        Args: {
          active?: boolean
          command?: string
          database?: string
          job_id: number
          schedule?: string
          username?: string
        }
        Returns: undefined
      }
      schedule: {
        Args:
          | { command: string; job_name: string; schedule: string }
          | { command: string; schedule: string }
        Returns: number
      }
      schedule_in_database: {
        Args: {
          active?: boolean
          command: string
          database: string
          job_name: string
          schedule: string
          username?: string
        }
        Returns: number
      }
      unschedule: {
        Args: { job_id: number } | { job_name: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  engagement: {
    Tables: {
      customer_favorites: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          salon_id: string | null
          service_id: string | null
          staff_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          salon_id?: string | null
          service_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          salon_id?: string | null
          service_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      salon_reviews: {
        Row: {
          appointment_id: string | null
          cleanliness_rating: number | null
          comment: string | null
          created_at: string
          customer_id: string
          deleted_at: string | null
          deleted_by_id: string | null
          flagged_reason: string | null
          helpful_count: number | null
          id: string
          is_featured: boolean | null
          is_flagged: boolean | null
          is_verified: boolean | null
          rating: number
          responded_by_id: string | null
          response: string | null
          response_date: string | null
          salon_id: string
          service_quality_rating: number | null
          title: string | null
          updated_at: string
          value_rating: number | null
        }
        Insert: {
          appointment_id?: string | null
          cleanliness_rating?: number | null
          comment?: string | null
          created_at?: string
          customer_id: string
          deleted_at?: string | null
          deleted_by_id?: string | null
          flagged_reason?: string | null
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_flagged?: boolean | null
          is_verified?: boolean | null
          rating: number
          responded_by_id?: string | null
          response?: string | null
          response_date?: string | null
          salon_id: string
          service_quality_rating?: number | null
          title?: string | null
          updated_at?: string
          value_rating?: number | null
        }
        Update: {
          appointment_id?: string | null
          cleanliness_rating?: number | null
          comment?: string | null
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          deleted_by_id?: string | null
          flagged_reason?: string | null
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_flagged?: boolean | null
          is_verified?: boolean | null
          rating?: number
          responded_by_id?: string | null
          response?: string | null
          response_date?: string | null
          salon_id?: string
          service_quality_rating?: number | null
          title?: string | null
          updated_at?: string
          value_rating?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_salon_rating_stats: {
        Args: { p_salon_id: string }
        Returns: {
          average_rating: number
          rating_distribution: Json
          review_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  extensions: {
    Tables: {
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      hypopg_hidden_indexes: {
        Row: {
          am_name: unknown | null
          index_name: unknown | null
          indexrelid: unknown | null
          is_hypo: boolean | null
          schema_name: unknown | null
          table_name: unknown | null
        }
        Relationships: []
      }
      hypopg_list_indexes: {
        Row: {
          am_name: unknown | null
          index_name: string | null
          indexrelid: unknown | null
          schema_name: unknown | null
          table_name: unknown | null
        }
        Relationships: []
      }
      pg_stat_statements: {
        Row: {
          calls: number | null
          dbid: unknown | null
          jit_deform_count: number | null
          jit_deform_time: number | null
          jit_emission_count: number | null
          jit_emission_time: number | null
          jit_functions: number | null
          jit_generation_time: number | null
          jit_inlining_count: number | null
          jit_inlining_time: number | null
          jit_optimization_count: number | null
          jit_optimization_time: number | null
          local_blk_read_time: number | null
          local_blk_write_time: number | null
          local_blks_dirtied: number | null
          local_blks_hit: number | null
          local_blks_read: number | null
          local_blks_written: number | null
          max_exec_time: number | null
          max_plan_time: number | null
          mean_exec_time: number | null
          mean_plan_time: number | null
          min_exec_time: number | null
          min_plan_time: number | null
          minmax_stats_since: string | null
          plans: number | null
          query: string | null
          queryid: number | null
          rows: number | null
          shared_blk_read_time: number | null
          shared_blk_write_time: number | null
          shared_blks_dirtied: number | null
          shared_blks_hit: number | null
          shared_blks_read: number | null
          shared_blks_written: number | null
          stats_since: string | null
          stddev_exec_time: number | null
          stddev_plan_time: number | null
          temp_blk_read_time: number | null
          temp_blk_write_time: number | null
          temp_blks_read: number | null
          temp_blks_written: number | null
          toplevel: boolean | null
          total_exec_time: number | null
          total_plan_time: number | null
          userid: unknown | null
          wal_bytes: number | null
          wal_fpi: number | null
          wal_records: number | null
        }
        Relationships: []
      }
      pg_stat_statements_info: {
        Row: {
          dealloc: number | null
          stats_reset: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
        Returns: string
      }
      akeys: {
        Args: { "": unknown }
        Returns: string[]
      }
      armor: {
        Args: { "": string }
        Returns: string
      }
      avals: {
        Args: { "": unknown }
        Returns: string[]
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      daitch_mokotoff: {
        Args: { "": string }
        Returns: string[]
      }
      dearmor: {
        Args: { "": string }
        Returns: string
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dmetaphone: {
        Args: { "": string }
        Returns: string
      }
      dmetaphone_alt: {
        Args: { "": string }
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
          | { column_name: string; schema_name: string; table_name: string }
          | { column_name: string; table_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      each: {
        Args: { hs: unknown }
        Returns: Record<string, unknown>[]
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      gbt_bit_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gen_random_bytes: {
        Args: { "": number }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: { "": string }
        Returns: string
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      ghstore_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ghstore_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ghstore_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ghstore_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      ghstore_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      hstore: {
        Args: { "": string[] } | { "": Record<string, unknown> }
        Returns: unknown
      }
      hstore_hash: {
        Args: { "": unknown }
        Returns: number
      }
      hstore_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      hstore_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      hstore_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      hstore_send: {
        Args: { "": unknown }
        Returns: string
      }
      hstore_subscript_handler: {
        Args: { "": unknown }
        Returns: unknown
      }
      hstore_to_array: {
        Args: { "": unknown }
        Returns: string[]
      }
      hstore_to_json: {
        Args: { "": unknown }
        Returns: Json
      }
      hstore_to_json_loose: {
        Args: { "": unknown }
        Returns: Json
      }
      hstore_to_jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      hstore_to_jsonb_loose: {
        Args: { "": unknown }
        Returns: Json
      }
      hstore_to_matrix: {
        Args: { "": unknown }
        Returns: string[]
      }
      hstore_version_diag: {
        Args: { "": unknown }
        Returns: number
      }
      http: {
        Args: {
          request: Database["extensions"]["CompositeTypes"]["http_request"]
        }
        Returns: Database["extensions"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { content: string; content_type: string; uri: string }
          | { uri: string }
        Returns: Database["extensions"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { data: Json; uri: string } | { uri: string }
        Returns: Database["extensions"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["extensions"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["extensions"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["extensions"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { content: string; content_type: string; uri: string }
          | { data: Json; uri: string }
        Returns: Database["extensions"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["extensions"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      hypopg: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      hypopg_create_index: {
        Args: { sql_order: string }
        Returns: Record<string, unknown>[]
      }
      hypopg_drop_index: {
        Args: { indexid: unknown }
        Returns: boolean
      }
      hypopg_get_indexdef: {
        Args: { indexid: unknown }
        Returns: string
      }
      hypopg_hidden_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          indexid: unknown
        }[]
      }
      hypopg_hide_index: {
        Args: { indexid: unknown }
        Returns: boolean
      }
      hypopg_relation_size: {
        Args: { indexid: unknown }
        Returns: number
      }
      hypopg_reset: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hypopg_reset_index: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hypopg_unhide_all_indexes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hypopg_unhide_index: {
        Args: { indexid: unknown }
        Returns: boolean
      }
      index_advisor: {
        Args: { query: string }
        Returns: {
          errors: string[]
          index_statements: string[]
          startup_cost_after: Json
          startup_cost_before: Json
          total_cost_after: Json
          total_cost_before: Json
        }[]
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      json_matches_schema: {
        Args: { instance: Json; schema: Json }
        Returns: boolean
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb_matches_schema: {
        Args: { instance: Json; schema: Json }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: { schema: Json }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: { instance: Json; schema: Json }
        Returns: string[]
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pg_stat_statements: {
        Args: { showtext: boolean }
        Returns: Record<string, unknown>[]
      }
      pg_stat_statements_info: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
      pg_stat_statements_reset: {
        Args: {
          dbid?: unknown
          minmax_only?: boolean
          queryid?: number
          userid?: unknown
        }
        Returns: string
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: { "": string }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      skeys: {
        Args: { "": unknown }
        Returns: string[]
      }
      soundex: {
        Args: { "": string }
        Returns: string
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { format?: string; geom: unknown }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; rel?: number }
          | { geom: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; options?: string; radius: number }
          | { geom: unknown; quadsegs: number; radius: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["extensions"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["extensions"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["extensions"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["extensions"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { dm?: number; dx: number; dy: number; dz?: number; geom: unknown }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["extensions"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { font?: Json; letters: string }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { from_proj: string; geom: unknown; to_proj: string }
          | { from_proj: string; geom: unknown; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      svals: {
        Args: { "": unknown }
        Returns: string[]
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      text_soundex: {
        Args: { "": string }
        Returns: string
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v3: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_nil: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers:
          | Database["extensions"]["CompositeTypes"]["http_header"][]
          | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers:
          | Database["extensions"]["CompositeTypes"]["http_header"][]
          | null
        content: string | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
  graphql: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _internal_resolve: {
        Args: {
          extensions?: Json
          operationName?: string
          query: string
          variables?: Json
        }
        Returns: Json
      }
      comment_directive: {
        Args: { comment_: string }
        Returns: Json
      }
      exception: {
        Args: { message: string }
        Returns: string
      }
      get_schema_version: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      resolve: {
        Args: {
          extensions?: Json
          operationName?: string
          query: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  identity: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          id: string
          updated_at: string
          updated_by_id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id: string
          updated_at?: string
          updated_by_id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          updated_at?: string
          updated_by_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      profiles_metadata: {
        Row: {
          avatar_thumbnail_url: string | null
          avatar_url: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          interests: string[] | null
          profile_id: string
          search_vector: unknown | null
          social_profiles: Json | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_thumbnail_url?: string | null
          avatar_url?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          profile_id: string
          search_vector?: unknown | null
          social_profiles?: Json | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_thumbnail_url?: string | null
          avatar_url?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          profile_id?: string
          search_vector?: unknown | null
          social_profiles?: Json | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_metadata_profile"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_preferences: {
        Row: {
          country_code: string | null
          created_at: string
          currency_code: string | null
          id: string
          locale: string | null
          preferences: Json | null
          profile_id: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          currency_code?: string | null
          id?: string
          locale?: string | null
          preferences?: Json | null
          profile_id: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          currency_code?: string | null
          id?: string
          locale?: string | null
          preferences?: Json | null
          profile_id?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_preferences_profile"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          id: string
          is_active: boolean
          is_suspicious: boolean
          refresh_token: string | null
          session_token: string
          updated_at: string
          updated_by_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          is_active?: boolean
          is_suspicious?: boolean
          refresh_token?: string | null
          session_token: string
          updated_at?: string
          updated_by_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          is_active?: boolean
          is_suspicious?: boolean
          refresh_token?: string | null
          session_token?: string
          updated_at?: string
          updated_by_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          id: string
          is_active: boolean
          permissions: string[] | null
          role: Database["public"]["Enums"]["role_type"]
          salon_id: string | null
          updated_at: string
          updated_by_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          is_active?: boolean
          permissions?: string[] | null
          role: Database["public"]["Enums"]["role_type"]
          salon_id?: string | null
          updated_at?: string
          updated_by_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          is_active?: boolean
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["role_type"]
          salon_id?: string | null
          updated_at?: string
          updated_by_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          id: string | null
          impersonator_id: string | null
          ip_address: unknown | null
          is_success: boolean | null
          new_values: Json | null
          old_values: Json | null
          request_id: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          deleted_at?: never
          deleted_by_id?: never
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string | null
          impersonator_id?: string | null
          ip_address?: unknown | null
          is_success?: boolean | null
          new_values?: Json | null
          old_values?: Json | null
          request_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          deleted_at?: never
          deleted_by_id?: never
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string | null
          impersonator_id?: string | null
          ip_address?: unknown | null
          is_success?: boolean | null
          new_values?: Json | null
          old_values?: Json | null
          request_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_type: string | null
          id: string | null
          ip_address: unknown | null
          metadata: Json | null
          request_id: string | null
          salon_id: string | null
          severity: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          id?: string | null
          ip_address?: unknown | null
          metadata?: Json | null
          request_id?: never
          salon_id?: string | null
          severity?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          id?: string | null
          ip_address?: unknown | null
          metadata?: Json | null
          request_id?: never
          salon_id?: string | null
          severity?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      anonymize_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      check_rate_limit: {
        Args: {
          p_key: string
          p_max_requests?: number
          p_window_seconds?: number
        }
        Returns: boolean
      }
      decrypt_mfa_secret: {
        Args: {
          p_encrypted: string
          p_factor_id: string
          p_key_id: string
          p_nonce: string
        }
        Returns: string
      }
      decrypt_mfa_secret_vault: {
        Args: { encrypted: string }
        Returns: string
      }
      detect_access_anomaly: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      encrypt_mfa_secret: {
        Args: { p_factor_id: string; p_secret: string }
        Returns: Json
      }
      encrypt_mfa_secret_vault: {
        Args: { plaintext: string }
        Returns: string
      }
      get_my_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          created_at: string
          display_name: string
          first_name: string
          id: string
          is_active: boolean
          is_verified: boolean
          last_name: string
          updated_at: string
          username: string
        }[]
      }
      get_profile_summary: {
        Args: { p_user_id?: string }
        Returns: Json
      }
      get_user_salon_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      manage_my_mfa: {
        Args: { action: string; factor_name?: string; factor_type?: string }
        Returns: Json
      }
      user_has_salon_access: {
        Args: { check_salon_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  inventory: {
    Tables: {
      product_categories: {
        Row: {
          created_at: string
          created_by_id: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          salon_id: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          salon_id: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          salon_id?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_usage: {
        Row: {
          appointment_id: string
          cost_at_time: number | null
          created_at: string
          id: string
          location_id: string
          notes: string | null
          performed_by_id: string | null
          product_id: string
          quantity_used: number
          updated_at: string
        }
        Insert: {
          appointment_id: string
          cost_at_time?: number | null
          created_at?: string
          id?: string
          location_id: string
          notes?: string | null
          performed_by_id?: string | null
          product_id: string
          quantity_used: number
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          cost_at_time?: number | null
          created_at?: string
          id?: string
          location_id?: string
          notes?: string | null
          performed_by_id?: string | null
          product_id?: string
          quantity_used?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_usage_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_usage_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          cost_price: number | null
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_tracked: boolean | null
          name: string
          reorder_point: number | null
          reorder_quantity: number | null
          retail_price: number | null
          salon_id: string
          sku: string | null
          supplier_id: string | null
          unit_of_measure: string | null
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_tracked?: boolean | null
          name: string
          reorder_point?: number | null
          reorder_quantity?: number | null
          retail_price?: number | null
          salon_id: string
          sku?: string | null
          supplier_id?: string | null
          unit_of_measure?: string | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_tracked?: boolean | null
          name?: string
          reorder_point?: number | null
          reorder_quantity?: number | null
          retail_price?: number | null
          salon_id?: string
          sku?: string | null
          supplier_id?: string | null
          unit_of_measure?: string | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          purchase_order_id: string
          quantity_ordered: number
          quantity_received: number | null
          total_price: number | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          purchase_order_id: string
          quantity_ordered: number
          quantity_received?: number | null
          total_price?: number | null
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          purchase_order_id?: string
          quantity_ordered?: number
          quantity_received?: number | null
          total_price?: number | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchase_order_items_order"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_purchase_order_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery_at: string | null
          created_at: string
          created_by_id: string | null
          expected_delivery_at: string | null
          id: string
          notes: string | null
          order_number: string
          ordered_at: string
          salon_id: string
          shipping_cost: number | null
          status: string
          subtotal: number | null
          supplier_id: string | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          actual_delivery_at?: string | null
          created_at?: string
          created_by_id?: string | null
          expected_delivery_at?: string | null
          id?: string
          notes?: string | null
          order_number: string
          ordered_at?: string
          salon_id: string
          shipping_cost?: number | null
          status?: string
          subtotal?: number | null
          supplier_id?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          actual_delivery_at?: string | null
          created_at?: string
          created_by_id?: string | null
          expected_delivery_at?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          ordered_at?: string
          salon_id?: string
          shipping_cost?: number | null
          status?: string
          subtotal?: number | null
          supplier_id?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_product_usage: {
        Row: {
          created_at: string
          id: string
          is_optional: boolean
          product_id: string
          quantity_per_service: number
          service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_optional?: boolean
          product_id: string
          quantity_per_service?: number
          service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_optional?: boolean
          product_id?: string
          quantity_per_service?: number
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_product_usage_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_alerts: {
        Row: {
          alert_level: string
          alert_type: string
          created_at: string
          current_quantity: number | null
          id: string
          is_resolved: boolean
          location_id: string | null
          message: string | null
          product_id: string
          resolved_at: string | null
          resolved_by_id: string | null
          threshold_quantity: number | null
          updated_at: string
        }
        Insert: {
          alert_level: string
          alert_type: string
          created_at?: string
          current_quantity?: number | null
          id?: string
          is_resolved?: boolean
          location_id?: string | null
          message?: string | null
          product_id: string
          resolved_at?: string | null
          resolved_by_id?: string | null
          threshold_quantity?: number | null
          updated_at?: string
        }
        Update: {
          alert_level?: string
          alert_type?: string
          created_at?: string
          current_quantity?: number | null
          id?: string
          is_resolved?: boolean
          location_id?: string | null
          message?: string | null
          product_id?: string
          resolved_at?: string | null
          resolved_by_id?: string | null
          threshold_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stock_alerts_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_alerts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_levels: {
        Row: {
          available_quantity: number | null
          created_at: string
          id: string
          last_counted_at: string | null
          location_id: string
          product_id: string
          quantity: number
          reserved_quantity: number | null
          updated_at: string
        }
        Insert: {
          available_quantity?: number | null
          created_at?: string
          id?: string
          last_counted_at?: string | null
          location_id: string
          product_id: string
          quantity?: number
          reserved_quantity?: number | null
          updated_at?: string
        }
        Update: {
          available_quantity?: number | null
          created_at?: string
          id?: string
          last_counted_at?: string | null
          location_id?: string
          product_id?: string
          quantity?: number
          reserved_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stock_levels_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_levels_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_locations: {
        Row: {
          created_at: string
          created_by_id: string | null
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          location_id: string | null
          name: string
          salon_id: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          location_id?: string | null
          name: string
          salon_id: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          location_id?: string | null
          name?: string
          salon_id?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          cost_price: number | null
          created_at: string
          from_location_id: string | null
          id: string
          location_id: string
          movement_type: string
          notes: string | null
          performed_by_id: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          to_location_id: string | null
          updated_at: string
        }
        Insert: {
          cost_price?: number | null
          created_at?: string
          from_location_id?: string | null
          id?: string
          location_id: string
          movement_type: string
          notes?: string | null
          performed_by_id?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          to_location_id?: string | null
          updated_at?: string
        }
        Update: {
          cost_price?: number | null
          created_at?: string
          from_location_id?: string | null
          id?: string
          location_id?: string
          movement_type?: string
          notes?: string | null
          performed_by_id?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          to_location_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stock_movements_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string
          created_by_id: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          salon_id: string
          updated_at: string
          updated_by_id: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          created_by_id?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          salon_id: string
          updated_at?: string
          updated_by_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          created_by_id?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          salon_id?: string
          updated_at?: string
          updated_by_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_availability: {
        Args:
          | Record<PropertyKey, never>
          | { p_location_id: string; p_product_id: string; p_quantity: number }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  net: {
    Tables: {
      _http_response: {
        Row: {
          content: string | null
          content_type: string | null
          created: string
          error_msg: string | null
          headers: Json | null
          id: number | null
          status_code: number | null
          timed_out: boolean | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created?: string
          error_msg?: string | null
          headers?: Json | null
          id?: number | null
          status_code?: number | null
          timed_out?: boolean | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created?: string
          error_msg?: string | null
          headers?: Json | null
          id?: number | null
          status_code?: number | null
          timed_out?: boolean | null
        }
        Relationships: []
      }
      http_request_queue: {
        Row: {
          body: string | null
          headers: Json | null
          id: number
          method: string
          timeout_milliseconds: number
          url: string
        }
        Insert: {
          body?: string | null
          headers?: Json | null
          id?: number
          method: string
          timeout_milliseconds: number
          url: string
        }
        Update: {
          body?: string | null
          headers?: Json | null
          id?: number
          method?: string
          timeout_milliseconds?: number
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _await_response: {
        Args: { request_id: number }
        Returns: boolean
      }
      _encode_url_with_params_array: {
        Args: { params_array: string[]; url: string }
        Returns: string
      }
      _http_collect_response: {
        Args: { async?: boolean; request_id: number }
        Returns: Database["net"]["CompositeTypes"]["http_response_result"]
      }
      _urlencode_string: {
        Args: { string: string }
        Returns: string
      }
      check_worker_is_up: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      http_collect_response: {
        Args: { async?: boolean; request_id: number }
        Returns: Database["net"]["CompositeTypes"]["http_response_result"]
      }
      http_delete: {
        Args: {
          body?: Json
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      http_get: {
        Args: {
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      http_post: {
        Args: {
          body?: Json
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      wait_until_running: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      wake: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      worker_restart: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      request_status: "PENDING" | "SUCCESS" | "ERROR"
    }
    CompositeTypes: {
      http_response: {
        status_code: number | null
        headers: Json | null
        body: string | null
      }
      http_response_result: {
        status: Database["net"]["Enums"]["request_status"] | null
        message: string | null
        response: Database["net"]["CompositeTypes"]["http_response"] | null
      }
    }
  }
  organization: {
    Tables: {
      location_addresses: {
        Row: {
          accessibility_notes: string | null
          city: string
          country_code: string
          created_at: string
          created_by_id: string | null
          formatted_address: string | null
          landmark: string | null
          latitude: number | null
          location_id: string
          longitude: number | null
          neighborhood: string | null
          parking_instructions: string | null
          place_id: string | null
          postal_code: string
          state_province: string
          street_address: string
          street_address_2: string | null
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          accessibility_notes?: string | null
          city: string
          country_code?: string
          created_at?: string
          created_by_id?: string | null
          formatted_address?: string | null
          landmark?: string | null
          latitude?: number | null
          location_id: string
          longitude?: number | null
          neighborhood?: string | null
          parking_instructions?: string | null
          place_id?: string | null
          postal_code: string
          state_province: string
          street_address: string
          street_address_2?: string | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          accessibility_notes?: string | null
          city?: string
          country_code?: string
          created_at?: string
          created_by_id?: string | null
          formatted_address?: string | null
          landmark?: string | null
          latitude?: number | null
          location_id?: string
          longitude?: number | null
          neighborhood?: string | null
          parking_instructions?: string | null
          place_id?: string | null
          postal_code?: string
          state_province?: string
          street_address?: string
          street_address_2?: string | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_addresses_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "salon_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      operating_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          close_time: string
          created_at: string
          created_by_id: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          deleted_at: string | null
          deleted_by_id: string | null
          effective_from: string | null
          effective_until: string | null
          id: string
          is_closed: boolean
          open_time: string
          salon_id: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          close_time: string
          created_at?: string
          created_by_id?: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          deleted_at?: string | null
          deleted_by_id?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          is_closed?: boolean
          open_time: string
          salon_id: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string
          created_at?: string
          created_by_id?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          deleted_at?: string | null
          deleted_by_id?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          is_closed?: boolean
          open_time?: string
          salon_id?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_operating_hours_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_chains: {
        Row: {
          billing_email: string | null
          brand_colors: Json | null
          brand_guidelines: string | null
          corporate_email: string | null
          corporate_phone: string | null
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          features: Json | null
          headquarters_address: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          legal_name: string | null
          logo_url: string | null
          metrics_calculated_at: string | null
          name: string
          owner_id: string | null
          salon_count: number | null
          settings: Json | null
          slug: string
          subscription_tier: string | null
          total_customer_count: number | null
          total_staff_count: number | null
          updated_at: string
          updated_by_id: string | null
          verified_at: string | null
          website: string | null
        }
        Insert: {
          billing_email?: string | null
          brand_colors?: Json | null
          brand_guidelines?: string | null
          corporate_email?: string | null
          corporate_phone?: string | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          features?: Json | null
          headquarters_address?: string | null
          id: string
          is_active?: boolean | null
          is_verified?: boolean | null
          legal_name?: string | null
          logo_url?: string | null
          metrics_calculated_at?: string | null
          name: string
          owner_id?: string | null
          salon_count?: number | null
          settings?: Json | null
          slug: string
          subscription_tier?: string | null
          total_customer_count?: number | null
          total_staff_count?: number | null
          updated_at?: string
          updated_by_id?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          billing_email?: string | null
          brand_colors?: Json | null
          brand_guidelines?: string | null
          corporate_email?: string | null
          corporate_phone?: string | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          features?: Json | null
          headquarters_address?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          legal_name?: string | null
          logo_url?: string | null
          metrics_calculated_at?: string | null
          name?: string
          owner_id?: string | null
          salon_count?: number | null
          settings?: Json | null
          slug?: string
          subscription_tier?: string | null
          total_customer_count?: number | null
          total_staff_count?: number | null
          updated_at?: string
          updated_by_id?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      salon_contact_details: {
        Row: {
          booking_email: string | null
          booking_url: string | null
          created_at: string
          created_by_id: string | null
          facebook_url: string | null
          hours_display_text: string | null
          instagram_url: string | null
          linkedin_url: string | null
          primary_email: string | null
          primary_phone: string | null
          salon_id: string
          secondary_phone: string | null
          telegram_username: string | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          updated_by_id: string | null
          website_url: string | null
          whatsapp_number: string | null
          youtube_url: string | null
        }
        Insert: {
          booking_email?: string | null
          booking_url?: string | null
          created_at?: string
          created_by_id?: string | null
          facebook_url?: string | null
          hours_display_text?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          primary_email?: string | null
          primary_phone?: string | null
          salon_id: string
          secondary_phone?: string | null
          telegram_username?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          updated_by_id?: string | null
          website_url?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Update: {
          booking_email?: string | null
          booking_url?: string | null
          created_at?: string
          created_by_id?: string | null
          facebook_url?: string | null
          hours_display_text?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          primary_email?: string | null
          primary_phone?: string | null
          salon_id?: string
          secondary_phone?: string | null
          telegram_username?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          updated_by_id?: string | null
          website_url?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_contact_details_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: true
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_descriptions: {
        Row: {
          amenities: string[] | null
          awards: string[] | null
          cancellation_policy: string | null
          certifications: string[] | null
          created_at: string
          created_by_id: string | null
          full_description: string | null
          languages_spoken: string[] | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          payment_methods: string[] | null
          salon_id: string
          short_description: string | null
          specialties: string[] | null
          updated_at: string
          updated_by_id: string | null
          welcome_message: string | null
        }
        Insert: {
          amenities?: string[] | null
          awards?: string[] | null
          cancellation_policy?: string | null
          certifications?: string[] | null
          created_at?: string
          created_by_id?: string | null
          full_description?: string | null
          languages_spoken?: string[] | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          payment_methods?: string[] | null
          salon_id: string
          short_description?: string | null
          specialties?: string[] | null
          updated_at?: string
          updated_by_id?: string | null
          welcome_message?: string | null
        }
        Update: {
          amenities?: string[] | null
          awards?: string[] | null
          cancellation_policy?: string | null
          certifications?: string[] | null
          created_at?: string
          created_by_id?: string | null
          full_description?: string | null
          languages_spoken?: string[] | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          payment_methods?: string[] | null
          salon_id?: string
          short_description?: string | null
          specialties?: string[] | null
          updated_at?: string
          updated_by_id?: string | null
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_descriptions_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: true
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_locations: {
        Row: {
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          id: string
          is_active: boolean
          is_primary: boolean
          name: string
          salon_id: string
          slug: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          name: string
          salon_id: string
          slug: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          name?: string
          salon_id?: string
          slug?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_salon_locations_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_media: {
        Row: {
          brand_colors: Json | null
          cover_image_url: string | null
          created_at: string
          gallery_urls: string[] | null
          logo_url: string | null
          salon_id: string
          social_links: Json | null
          updated_at: string
        }
        Insert: {
          brand_colors?: Json | null
          cover_image_url?: string | null
          created_at?: string
          gallery_urls?: string[] | null
          logo_url?: string | null
          salon_id: string
          social_links?: Json | null
          updated_at?: string
        }
        Update: {
          brand_colors?: Json | null
          cover_image_url?: string | null
          created_at?: string
          gallery_urls?: string[] | null
          logo_url?: string | null
          salon_id?: string
          social_links?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_salon_media_salon"
            columns: ["salon_id"]
            isOneToOne: true
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_metrics: {
        Row: {
          created_at: string
          employee_count: number | null
          rating_average: number | null
          rating_count: number | null
          salon_id: string
          total_bookings: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_count?: number | null
          rating_average?: number | null
          rating_count?: number | null
          salon_id: string
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_count?: number | null
          rating_average?: number | null
          rating_count?: number | null
          salon_id?: string
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_salon_metrics_salon"
            columns: ["salon_id"]
            isOneToOne: true
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_settings: {
        Row: {
          booking_lead_time_hours: number | null
          cancellation_hours: number | null
          created_at: string
          features: string[] | null
          is_accepting_bookings: boolean
          max_bookings_per_day: number | null
          max_services: number | null
          max_staff: number | null
          salon_id: string
          subscription_expires_at: string | null
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          booking_lead_time_hours?: number | null
          cancellation_hours?: number | null
          created_at?: string
          features?: string[] | null
          is_accepting_bookings?: boolean
          max_bookings_per_day?: number | null
          max_services?: number | null
          max_staff?: number | null
          salon_id: string
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          booking_lead_time_hours?: number | null
          cancellation_hours?: number | null
          created_at?: string
          features?: string[] | null
          is_accepting_bookings?: boolean
          max_bookings_per_day?: number | null
          max_services?: number | null
          max_staff?: number | null
          salon_id?: string
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_salon_settings_salon"
            columns: ["salon_id"]
            isOneToOne: true
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          business_name: string | null
          business_type: string | null
          chain_id: string | null
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          established_at: string | null
          id: string
          name: string
          owner_id: string
          slug: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          chain_id?: string | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          established_at?: string | null
          id?: string
          name: string
          owner_id: string
          slug: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          chain_id?: string | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          established_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          slug?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_salons_chain"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "salon_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_salons_chain"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "salon_chains_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_profiles: {
        Row: {
          bio: string | null
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          experience_years: number | null
          id: string
          salon_id: string
          title: string | null
          updated_at: string
          updated_by_id: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          experience_years?: number | null
          id?: string
          salon_id: string
          title?: string | null
          updated_at?: string
          updated_by_id?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          experience_years?: number | null
          id?: string
          salon_id?: string
          title?: string | null
          updated_at?: string
          updated_by_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_profiles_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      salon_chains_summary: {
        Row: {
          created_at: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          owner_id: string | null
          salon_count: number | null
          slug: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          owner_id?: string | null
          salon_count?: number | null
          slug?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          owner_id?: string | null
          salon_count?: number | null
          slug?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: { p_usename: string }
        Returns: {
          password: string
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  private: {
    Tables: {
      api_keys: {
        Row: {
          api_key_encrypted: string
          api_secret_encrypted: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          salon_id: string | null
          service_name: string
          updated_at: string | null
          webhook_secret_encrypted: string | null
        }
        Insert: {
          api_key_encrypted: string
          api_secret_encrypted?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          salon_id?: string | null
          service_name: string
          updated_at?: string | null
          webhook_secret_encrypted?: string | null
        }
        Update: {
          api_key_encrypted?: string
          api_secret_encrypted?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          salon_id?: string | null
          service_name?: string
          updated_at?: string | null
          webhook_secret_encrypted?: string | null
        }
        Relationships: []
      }
      encryption_keys: {
        Row: {
          algorithm: string | null
          created_at: string
          id: string
          is_active: boolean | null
          key_name: string
          key_value: string
          rotation_date: string | null
        }
        Insert: {
          algorithm?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          key_name: string
          key_value: string
          rotation_date?: string | null
        }
        Update: {
          algorithm?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          key_name?: string
          key_value?: string
          rotation_date?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          salon_id: string | null
          stripe_payment_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          salon_id?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          salon_id?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      idempotency_keys: {
        Row: {
          created_at: string
          deleted_at: string | null
          expires_at: string | null
          idempotency_key: string
          operation_type: string
          result: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          idempotency_key: string
          operation_type: string
          result: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          idempotency_key?: string
          operation_type?: string
          result?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end_at: string
          current_period_start_at: string
          customer_id: string
          deleted_at: string | null
          id: string
          metadata: Json | null
          plan_id: string
          salon_id: string
          status: string
          stripe_subscription_id: string | null
          subscription_type: string | null
          trial_end_at: string | null
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end_at: string
          current_period_start_at: string
          customer_id: string
          deleted_at?: string | null
          id?: string
          metadata?: Json | null
          plan_id: string
          salon_id: string
          status: string
          stripe_subscription_id?: string | null
          subscription_type?: string | null
          trial_end_at?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end_at?: string
          current_period_start_at?: string
          customer_id?: string
          deleted_at?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string
          salon_id?: string
          status?: string
          stripe_subscription_id?: string | null
          subscription_type?: string | null
          trial_end_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_sensitive_data: {
        Row: {
          background_check_date: string | null
          background_check_status: string | null
          bank_account_encrypted: string | null
          created_at: string
          credit_score: number | null
          ssn_encrypted: string | null
          tax_id_encrypted: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          background_check_date?: string | null
          background_check_status?: string | null
          bank_account_encrypted?: string | null
          created_at?: string
          credit_score?: number | null
          ssn_encrypted?: string | null
          tax_id_encrypted?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          background_check_date?: string | null
          background_check_status?: string | null
          bank_account_encrypted?: string | null
          created_at?: string
          credit_score?: number | null
          ssn_encrypted?: string | null
          tax_id_encrypted?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      decrypt_pii: {
        Args: { encrypted_data: string }
        Returns: string
      }
      encrypt_pii: {
        Args: { plain_text: string }
        Returns: string
      }
      get_accessible_salons: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_api_config: {
        Args: { p_salon_id: string; p_service: string }
        Returns: Json
      }
      get_encryption_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_my_financial_transactions: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          amount: number
          created_at: string
          id: string
          salon_name: string
          status: string
          transaction_type: string
        }[]
      }
      get_user_accessible_salons: {
        Args: { p_user_id: string }
        Returns: string[]
      }
      get_user_role: {
        Args: { p_user_id?: string }
        Returns: string
      }
      get_user_role_for_salon: {
        Args: { p_salon_id: string }
        Returns: Database["public"]["Enums"]["role_type"]
      }
      get_user_salons: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_sensitive_data: {
        Args: { p_user_id: string }
        Returns: Json
      }
      has_mfa_verification: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_customer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_salon_manager: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      is_salon_owner: {
        Args: { check_salon_id: string }
        Returns: boolean
      }
      is_salon_staff: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      is_staff_member: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      require_mfa: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_salon_access: {
        Args: { check_salon_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
      appointment_services: {
        Row: {
          appointment_id: string | null
          category_name: string | null
          confirmation_code: string | null
          created_at: string | null
          currency_code: string | null
          current_price: number | null
          customer_id: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string | null
          sale_price: number | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          service_description: string | null
          service_id: string | null
          service_name: string | null
          service_price: number | null
          service_slug: string | null
          staff_id: string | null
          staff_name: string | null
          staff_title: string | null
          start_time: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_appointment_services_appointment"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_services_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          confirmation_code: string | null
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          service_count: number | null
          service_names: string | null
          staff_avatar: string | null
          staff_id: string | null
          staff_name: string | null
          staff_title: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          total_price: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_appointments_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_times: {
        Row: {
          block_type: string | null
          created_at: string | null
          created_by_id: string | null
          created_by_name: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string | null
          is_active: boolean | null
          is_recurring: boolean | null
          reason: string | null
          recurrence_pattern: string | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          staff_id: string | null
          staff_name: string | null
          staff_title: string | null
          start_time: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_blocked_times_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_favorites: {
        Row: {
          business_name: string | null
          category_name: string | null
          created_at: string | null
          currency_code: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          id: string | null
          notes: string | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          service_description: string | null
          service_id: string | null
          service_name: string | null
          service_price: number | null
          service_slug: string | null
          staff_avatar: string | null
          staff_id: string | null
          staff_name: string | null
          staff_title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer_favorites_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customer_favorites_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      operating_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          close_time: string | null
          created_at: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"] | null
          deleted_at: string | null
          effective_from: string | null
          effective_until: string | null
          hours_display: string | null
          id: string | null
          is_closed: boolean | null
          open_time: string | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_operating_hours_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_thumbnail_url: string | null
          avatar_url: string | null
          country_code: string | null
          cover_image_url: string | null
          created_at: string | null
          currency_code: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          email: string | null
          email_confirmed_at: string | null
          email_verified: boolean | null
          full_name: string | null
          id: string | null
          interests: string[] | null
          last_sign_in_at: string | null
          locale: string | null
          phone: string | null
          preferences: Json | null
          social_profiles: Json | null
          status: string | null
          tags: string[] | null
          timezone: string | null
          updated_at: string | null
          username: string | null
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
      salon_chains_view: {
        Row: {
          billing_email: string | null
          brand_colors: Json | null
          brand_guidelines: string | null
          corporate_email: string | null
          corporate_phone: string | null
          created_at: string | null
          deleted_at: string | null
          features: Json | null
          headquarters_address: string | null
          id: string | null
          is_active: boolean | null
          is_verified: boolean | null
          legal_name: string | null
          logo_url: string | null
          name: string | null
          owner_id: string | null
          salon_count: number | null
          settings: Json | null
          slug: string | null
          subscription_tier: string | null
          total_staff_count: number | null
          updated_at: string | null
          verified_at: string | null
          website: string | null
        }
        Insert: {
          billing_email?: string | null
          brand_colors?: Json | null
          brand_guidelines?: string | null
          corporate_email?: string | null
          corporate_phone?: string | null
          created_at?: string | null
          deleted_at?: string | null
          features?: Json | null
          headquarters_address?: string | null
          id?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          legal_name?: string | null
          logo_url?: string | null
          name?: string | null
          owner_id?: string | null
          salon_count?: never
          settings?: Json | null
          slug?: string | null
          subscription_tier?: string | null
          total_staff_count?: never
          updated_at?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          billing_email?: string | null
          brand_colors?: Json | null
          brand_guidelines?: string | null
          corporate_email?: string | null
          corporate_phone?: string | null
          created_at?: string | null
          deleted_at?: string | null
          features?: Json | null
          headquarters_address?: string | null
          id?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          legal_name?: string | null
          logo_url?: string | null
          name?: string | null
          owner_id?: string | null
          salon_count?: never
          settings?: Json | null
          slug?: string | null
          subscription_tier?: string | null
          total_staff_count?: never
          updated_at?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      salon_media_view: {
        Row: {
          brand_colors: Json | null
          business_name: string | null
          cover_image_url: string | null
          created_at: string | null
          gallery_image_count: number | null
          gallery_urls: string[] | null
          logo_url: string | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          social_links: Json | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_salon_media_salon"
            columns: ["salon_id"]
            isOneToOne: true
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_reviews_view: {
        Row: {
          appointment_id: string | null
          cleanliness_rating: number | null
          comment: string | null
          created_at: string | null
          customer_avatar: string | null
          customer_id: string | null
          customer_name: string | null
          helpful_count: number | null
          id: string | null
          is_featured: boolean | null
          is_flagged: boolean | null
          is_verified: boolean | null
          overall_rating: number | null
          rating: number | null
          responded_by_id: string | null
          responded_by_name: string | null
          response: string | null
          response_date: string | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          service_quality_rating: number | null
          title: string | null
          updated_at: string | null
          value_rating: number | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_reviews_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          amenities: string[] | null
          booking_email: string | null
          booking_lead_time_hours: number | null
          booking_url: string | null
          brand_colors: Json | null
          business_name: string | null
          business_type: string | null
          cancellation_hours: number | null
          cancellation_policy: string | null
          chain_id: string | null
          city: string | null
          country_code: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          email: string | null
          established_at: string | null
          facebook_url: string | null
          features: string[] | null
          formatted_address: string | null
          full_address: string | null
          gallery_urls: string[] | null
          id: string | null
          instagram_url: string | null
          is_accepting_bookings: boolean | null
          is_primary: boolean | null
          landmark: string | null
          languages_spoken: string[] | null
          latitude: number | null
          location_active: boolean | null
          location_id: string | null
          location_name: string | null
          location_slug: string | null
          logo_url: string | null
          longitude: number | null
          max_bookings_per_day: number | null
          name: string | null
          neighborhood: string | null
          owner_id: string | null
          parking_instructions: string | null
          payment_methods: string[] | null
          phone: string | null
          postal_code: string | null
          rating: number | null
          review_count: number | null
          secondary_phone: string | null
          services_count: number | null
          short_description: string | null
          slug: string | null
          specialties: string[] | null
          staff_count: number | null
          state_province: string | null
          status: string | null
          street_address: string | null
          street_address_2: string | null
          subscription_tier: string | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string | null
          website_url: string | null
          welcome_message: string | null
          whatsapp_number: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_salons_chain"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "salon_chains_view"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories_view: {
        Row: {
          active_services_count: number | null
          created_at: string | null
          deleted_at: string | null
          depth: number | null
          id: string | null
          is_active: boolean | null
          name: string | null
          parent_category_name: string | null
          parent_category_slug: string | null
          parent_id: string | null
          path: string[] | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          slug: string | null
          subcategories_count: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_categories_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_categories_core_norm_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "service_categories_view"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          buffer_minutes: number | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          currency_code: string | null
          current_price: number | null
          deleted_at: string | null
          deleted_by_id: string | null
          description: string | null
          discontinued_at: string | null
          duration_minutes: number | null
          id: string | null
          is_active: boolean | null
          is_bookable: boolean | null
          is_featured: boolean | null
          max_advance_booking_days: number | null
          min_advance_booking_hours: number | null
          name: string | null
          price: number | null
          sale_price: number | null
          salon_id: string | null
          slug: string | null
          status: string | null
          total_duration_minutes: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_services_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_services_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          avatar_thumbnail_url: string | null
          avatar_url: string | null
          bio: string | null
          business_name: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          email: string | null
          experience_years: number | null
          full_name: string | null
          id: string | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          services_count: number | null
          status: string | null
          title: string | null
          total_appointments: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_profiles_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "fk_staff_schedules_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_services: {
        Row: {
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          currency_code: string | null
          default_duration: number | null
          default_price: number | null
          duration_override: number | null
          effective_duration: number | null
          effective_price: number | null
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
          sale_price: number | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          service_description: string | null
          service_id: string | null
          service_is_active: boolean | null
          service_name: string | null
          service_slug: string | null
          staff_avatar: string | null
          staff_bio: string | null
          staff_id: string | null
          staff_name: string | null
          staff_title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_profiles_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_staff_services_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_staff_services_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      tables_without_primary_keys: {
        Row: {
          schema_name: unknown | null
          table_name: unknown | null
        }
        Relationships: []
      }
      time_off_requests_view: {
        Row: {
          created_at: string | null
          duration_days: number | null
          end_at: string | null
          id: string | null
          is_auto_reschedule: boolean | null
          is_notify_customers: boolean | null
          reason: string | null
          request_type: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by_id: string | null
          reviewed_by_name: string | null
          salon_id: string | null
          salon_name: string | null
          salon_slug: string | null
          staff_id: string | null
          staff_name: string | null
          staff_title: string | null
          staff_user_id: string | null
          start_at: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_time_off_requests_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_salon"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
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
        Returns: Json
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
      get_user_staff_ids: {
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
        Args:
          | { p_salon_id: string }
          | { target_salon_id: string; user_uuid?: string }
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
  realtime: {
    Tables: {
      messages: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      schema_migrations: {
        Row: {
          inserted_at: string | null
          version: number
        }
        Insert: {
          inserted_at?: string | null
          version: number
        }
        Update: {
          inserted_at?: string | null
          version?: number
        }
        Relationships: []
      }
      subscription: {
        Row: {
          claims: Json
          claims_role: unknown
          created_at: string
          entity: unknown
          filters: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id: number
          subscription_id: string
        }
        Insert: {
          claims: Json
          claims_role?: unknown
          created_at?: string
          entity: unknown
          filters?: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id?: never
          subscription_id: string
        }
        Update: {
          claims?: Json
          claims_role?: unknown
          created_at?: string
          entity?: unknown
          filters?: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id?: never
          subscription_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_rls: {
        Args: { max_record_bytes?: number; wal: Json }
        Returns: Database["realtime"]["CompositeTypes"]["wal_rls"][]
      }
      broadcast_changes: {
        Args: {
          event_name: string
          level?: string
          new: Record<string, unknown>
          old: Record<string, unknown>
          operation: string
          table_name: string
          table_schema: string
          topic_name: string
        }
        Returns: undefined
      }
      build_prepared_statement_sql: {
        Args: {
          columns: Database["realtime"]["CompositeTypes"]["wal_column"][]
          entity: unknown
          prepared_statement_name: string
        }
        Returns: string
      }
      cast: {
        Args: { type_: unknown; val: string }
        Returns: Json
      }
      check_equality_op: {
        Args: {
          op: Database["realtime"]["Enums"]["equality_op"]
          type_: unknown
          val_1: string
          val_2: string
        }
        Returns: boolean
      }
      is_visible_through_filters: {
        Args: {
          columns: Database["realtime"]["CompositeTypes"]["wal_column"][]
          filters: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
        }
        Returns: boolean
      }
      list_changes: {
        Args: {
          max_changes: number
          max_record_bytes: number
          publication: unknown
          slot_name: unknown
        }
        Returns: Database["realtime"]["CompositeTypes"]["wal_rls"][]
      }
      quote_wal2json: {
        Args: { entity: unknown }
        Returns: string
      }
      send: {
        Args: { event: string; payload: Json; private?: boolean; topic: string }
        Returns: undefined
      }
      to_regrole: {
        Args: { role_name: string }
        Returns: unknown
      }
      topic: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      action: "INSERT" | "UPDATE" | "DELETE" | "TRUNCATE" | "ERROR"
      equality_op: "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "in"
    }
    CompositeTypes: {
      user_defined_filter: {
        column_name: string | null
        op: Database["realtime"]["Enums"]["equality_op"] | null
        value: string | null
      }
      wal_column: {
        name: string | null
        type_name: string | null
        type_oid: unknown | null
        value: Json | null
        is_pkey: boolean | null
        is_selectable: boolean | null
      }
      wal_rls: {
        wal: Json | null
        is_rls_enabled: boolean | null
        subscription_ids: string[] | null
        errors: string[] | null
      }
    }
  }
  realtime_system: {
    Tables: {
      active_subscriptions: {
        Row: {
          channel_id: string
          connection_id: string
          filters: Json | null
          id: string
          last_activity: string | null
          message_count: number | null
          salon_id: string | null
          subscribed_at: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          connection_id: string
          filters?: Json | null
          id?: string
          last_activity?: string | null
          message_count?: number | null
          salon_id?: string | null
          subscribed_at?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          connection_id?: string
          filters?: Json | null
          id?: string
          last_activity?: string | null
          message_count?: number | null
          salon_id?: string | null
          subscribed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_subscriptions_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "subscription_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "active_subscriptions_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "user_connections"
            referencedColumns: ["connection_id"]
          },
        ]
      }
      event_queue: {
        Row: {
          channel_name: string
          created_at: string
          delivered: boolean | null
          delivery_attempts: number | null
          event_type: string
          expires_at: string | null
          id: string
          max_delivery_attempts: number | null
          payload: Json
          priority: number | null
          scheduled_for: string | null
          target_salons: string[] | null
          target_users: string[] | null
          updated_at: string | null
        }
        Insert: {
          channel_name: string
          created_at?: string
          delivered?: boolean | null
          delivery_attempts?: number | null
          event_type: string
          expires_at?: string | null
          id?: string
          max_delivery_attempts?: number | null
          payload: Json
          priority?: number | null
          scheduled_for?: string | null
          target_salons?: string[] | null
          target_users?: string[] | null
          updated_at?: string | null
        }
        Update: {
          channel_name?: string
          created_at?: string
          delivered?: boolean | null
          delivery_attempts?: number | null
          event_type?: string
          expires_at?: string | null
          id?: string
          max_delivery_attempts?: number | null
          payload?: Json
          priority?: number | null
          scheduled_for?: string | null
          target_salons?: string[] | null
          target_users?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_channels: {
        Row: {
          access_level: string | null
          channel_name: string
          channel_type: string
          created_at: string
          current_subscribers: number | null
          description: string | null
          enabled: boolean | null
          id: string
          max_subscribers: number | null
          rate_limit_per_minute: number | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          channel_name: string
          channel_type: string
          created_at?: string
          current_subscribers?: number | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          max_subscribers?: number | null
          rate_limit_per_minute?: number | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          channel_name?: string
          channel_type?: string
          created_at?: string
          current_subscribers?: number | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          max_subscribers?: number | null
          rate_limit_per_minute?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          connection_id: string
          connection_type: string
          created_at: string
          id: string
          ip_address: unknown | null
          last_seen: string | null
          metadata: Json | null
          salon_id: string | null
          subscriptions: Json | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          connection_id: string
          connection_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          last_seen?: string | null
          metadata?: Json | null
          salon_id?: string | null
          subscriptions?: Json | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          connection_id?: string
          connection_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          last_seen?: string | null
          metadata?: Json | null
          salon_id?: string | null
          subscriptions?: Json | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      broadcast_event: {
        Args: {
          p_channel_name: string
          p_event_type: string
          p_payload: Json
          p_priority?: number
          p_scheduled_for?: string
          p_target_salons?: string[]
          p_target_users?: string[]
        }
        Returns: Json
      }
      create_notification: {
        Args: {
          p_action_data?: Json
          p_action_url?: string
          p_delivery_method?: string[]
          p_message: string
          p_notification_type: string
          p_priority?: string
          p_salon_id?: string
          p_title: string
          p_user_id: string
        }
        Returns: Json
      }
      disconnect_connection: {
        Args: { p_connection_id: string }
        Returns: Json
      }
      get_connection_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      mark_notification_read: {
        Args: { p_notification_id: string; p_user_id: string }
        Returns: Json
      }
      process_event_delivery: {
        Args: { p_event_id: string }
        Returns: number
      }
      register_connection: {
        Args: {
          p_connection_id: string
          p_connection_type?: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_salon_id?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: Json
      }
      subscribe_to_channel: {
        Args: {
          p_channel_name: string
          p_connection_id: string
          p_filters?: Json
        }
        Returns: Json
      }
      unsubscribe_from_channel: {
        Args: { p_channel_name: string; p_connection_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  scheduling: {
    Tables: {
      appointment_services: {
        Row: {
          appointment_id: string
          created_at: string
          created_by_id: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          service_id: string
          staff_id: string | null
          start_time: string | null
          status: string | null
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string
          created_by_id?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          service_id: string
          staff_id?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string
          created_by_id?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          service_id?: string
          staff_id?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_appointment_services_appointment"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          confirmation_code: string | null
          created_at: string
          created_by_id: string | null
          customer_id: string
          duration_minutes: number | null
          end_time: string
          id: string
          salon_id: string
          service_count: number | null
          staff_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          confirmation_code?: string | null
          created_at?: string
          created_by_id?: string | null
          customer_id: string
          duration_minutes?: number | null
          end_time: string
          id?: string
          salon_id: string
          service_count?: number | null
          staff_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          confirmation_code?: string | null
          created_at?: string
          created_by_id?: string | null
          customer_id?: string
          duration_minutes?: number | null
          end_time?: string
          id?: string
          salon_id?: string
          service_count?: number | null
          staff_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: []
      }
      blocked_times: {
        Row: {
          block_type: string
          created_at: string
          created_by_id: string
          deleted_at: string | null
          deleted_by_id: string | null
          end_time: string
          id: string
          is_active: boolean
          is_recurring: boolean
          reason: string | null
          recurrence_pattern: string | null
          salon_id: string
          staff_id: string | null
          start_time: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          block_type: string
          created_at?: string
          created_by_id: string
          deleted_at?: string | null
          deleted_by_id?: string | null
          end_time: string
          id?: string
          is_active?: boolean
          is_recurring?: boolean
          reason?: string | null
          recurrence_pattern?: string | null
          salon_id: string
          staff_id?: string | null
          start_time: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          block_type?: string
          created_at?: string
          created_by_id?: string
          deleted_at?: string | null
          deleted_by_id?: string | null
          end_time?: string
          id?: string
          is_active?: boolean
          is_recurring?: boolean
          reason?: string | null
          recurrence_pattern?: string | null
          salon_id?: string
          staff_id?: string | null
          start_time?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: []
      }
      staff_schedules: {
        Row: {
          break_end: string | null
          break_start: string | null
          created_at: string
          created_by_id: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          deleted_at: string | null
          deleted_by_id: string | null
          effective_from: string | null
          effective_until: string | null
          end_time: string
          id: string
          is_active: boolean
          salon_id: string
          staff_id: string
          start_time: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          created_at?: string
          created_by_id?: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          deleted_at?: string | null
          deleted_by_id?: string | null
          effective_from?: string | null
          effective_until?: string | null
          end_time: string
          id?: string
          is_active?: boolean
          salon_id: string
          staff_id: string
          start_time: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          created_at?: string
          created_by_id?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          deleted_at?: string | null
          deleted_by_id?: string | null
          effective_from?: string | null
          effective_until?: string | null
          end_time?: string
          id?: string
          is_active?: boolean
          salon_id?: string
          staff_id?: string
          start_time?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: []
      }
      time_off_requests: {
        Row: {
          created_at: string
          created_by_id: string | null
          deleted_at: string | null
          deleted_by_id: string | null
          end_at: string
          id: string
          is_auto_reschedule: boolean | null
          is_notify_customers: boolean | null
          reason: string | null
          request_type: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by_id: string | null
          salon_id: string
          staff_id: string
          start_at: string
          status: string
          updated_at: string
          updated_by_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          end_at: string
          id?: string
          is_auto_reschedule?: boolean | null
          is_notify_customers?: boolean | null
          reason?: string | null
          request_type: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by_id?: string | null
          salon_id: string
          staff_id: string
          start_at: string
          status: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          deleted_at?: string | null
          deleted_by_id?: string | null
          end_at?: string
          id?: string
          is_auto_reschedule?: boolean | null
          is_notify_customers?: boolean | null
          reason?: string | null
          request_type?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by_id?: string | null
          salon_id?: string
          staff_id?: string
          start_at?: string
          status?: string
          updated_at?: string
          updated_by_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      appointment_summary: {
        Row: {
          appointment_count: number | null
          appointment_date: string | null
          cancelled_count: number | null
          completed_count: number | null
          salon_id: string | null
          staff_id: string | null
          unique_customers: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      batch_update_appointment_status: {
        Args: {
          p_appointment_ids: string[]
          p_new_status: Database["public"]["Enums"]["appointment_status"]
          p_reason?: string
        }
        Returns: number
      }
      check_appointment_conflict: {
        Args: {
          p_end_time: string
          p_exclude_appointment_id?: string
          p_salon_id: string
          p_staff_id: string
          p_start_time: string
        }
        Returns: boolean
      }
      check_resource_availability: {
        Args: {
          p_end_time: string
          p_exclude_appointment_id?: string
          p_resource_id: string
          p_salon_id: string
          p_start_time: string
        }
        Returns: boolean
      }
      check_staff_availability: {
        Args: {
          p_end_time: string
          p_exclude_appointment_id?: string
          p_staff_id: string
          p_start_time: string
        }
        Returns: boolean
      }
      create_appointment_record: {
        Args: {
          p_customer_id: string
          p_duration_minutes: number
          p_salon_id: string
          p_staff_id: string
          p_start_time: string
          p_total_amount: number
        }
        Returns: string
      }
      create_appointment_with_services: {
        Args: {
          p_customer_id: string
          p_salon_id: string
          p_services: Json
          p_staff_id: string
          p_start_time: string
        }
        Returns: string
      }
      get_appointment_stats: {
        Args: { p_end_date: string; p_salon_id: string; p_start_date: string }
        Returns: {
          avg_service_duration: number
          cancelled_appointments: number
          completed_appointments: number
          no_show_appointments: number
          total_appointments: number
          total_revenue: number
        }[]
      }
      link_appointment_services: {
        Args: { p_appointment_id: string; p_services: Json; p_staff_id: string }
        Returns: number
      }
      log_appointment_creation: {
        Args: {
          p_appointment_id: string
          p_customer_id: string
          p_services: Json
          p_total_amount: number
        }
        Returns: undefined
      }
      validate_and_calculate_services: {
        Args: { p_services: Json }
        Returns: {
          is_valid: boolean
          total_amount: number
          total_duration: number
        }[]
      }
      validate_and_create_appointment: {
        Args:
          | Record<PropertyKey, never>
          | {
              p_customer_id: string
              p_end_time: string
              p_salon_id: string
              p_service_id: string
              p_staff_id: string
              p_start_time: string
            }
        Returns: string
      }
      validate_appointment_overlap: {
        Args:
          | Record<PropertyKey, never>
          | {
              p_end_time: string
              p_exclude_appointment_id?: string
              p_salon_id: string
              p_staff_id: string
              p_start_time: string
            }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  security: {
    Tables: {
      access_monitoring: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          is_granted: boolean
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_granted: boolean
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_granted?: boolean
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_configuration: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          setting_name: string
          setting_value: Json
          updated_at: string | null
          updated_by_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_name: string
          setting_value: Json
          updated_at?: string | null
          updated_by_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_name?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by_id?: string | null
        }
        Relationships: []
      }
      permission_matrix: {
        Row: {
          conditions: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          is_mfa_required: boolean | null
          operation: string
          resource_type: string
          role_name: string
          updated_at: string | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_mfa_required?: boolean | null
          operation: string
          resource_type: string
          role_name: string
          updated_at?: string | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_mfa_required?: boolean | null
          operation?: string
          resource_type?: string
          role_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limit_rules: {
        Row: {
          applies_to: string
          block_duration_seconds: number | null
          created_at: string
          created_by_id: string | null
          description: string | null
          endpoint: string
          id: string
          is_active: boolean
          max_requests: number
          metadata: Json | null
          method: string | null
          priority: number
          role_filter: Database["public"]["Enums"]["role_type"] | null
          rule_name: string
          updated_at: string
          updated_by_id: string | null
          window_seconds: number
        }
        Insert: {
          applies_to: string
          block_duration_seconds?: number | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          endpoint: string
          id?: string
          is_active?: boolean
          max_requests: number
          metadata?: Json | null
          method?: string | null
          priority?: number
          role_filter?: Database["public"]["Enums"]["role_type"] | null
          rule_name: string
          updated_at?: string
          updated_by_id?: string | null
          window_seconds: number
        }
        Update: {
          applies_to?: string
          block_duration_seconds?: number | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean
          max_requests?: number
          metadata?: Json | null
          method?: string | null
          priority?: number
          role_filter?: Database["public"]["Enums"]["role_type"] | null
          rule_name?: string
          updated_at?: string
          updated_by_id?: string | null
          window_seconds?: number
        }
        Relationships: []
      }
      rate_limit_tracking: {
        Row: {
          blocked_until: string | null
          created_at: string
          endpoint: string
          identifier: string
          identifier_type: string
          last_blocked_at: string | null
          last_request_at: string | null
          metadata: Json | null
          request_count: number
          updated_at: string
          user_agent: string | null
          window_start_at: string
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string
          endpoint: string
          identifier: string
          identifier_type: string
          last_blocked_at?: string | null
          last_request_at?: string | null
          metadata?: Json | null
          request_count?: number
          updated_at?: string
          user_agent?: string | null
          window_start_at: string
        }
        Update: {
          blocked_until?: string | null
          created_at?: string
          endpoint?: string
          identifier?: string
          identifier_type?: string
          last_blocked_at?: string | null
          last_request_at?: string | null
          metadata?: Json | null
          request_count?: number
          updated_at?: string
          user_agent?: string | null
          window_start_at?: string
        }
        Relationships: []
      }
      session_security: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          is_blocked: boolean | null
          last_activity_at: string | null
          session_id: string
          suspicious_score: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_blocked?: boolean | null
          last_activity_at?: string | null
          session_id: string
          suspicious_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_blocked?: boolean | null
          last_activity_at?: string | null
          session_id?: string
          suspicious_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_setting: {
        Args: { p_setting_name: string }
        Returns: Json
      }
      get_security_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: number
          status: string
          threshold: number
        }[]
      }
      log_security_event: {
        Args: {
          p_description: string
          p_event_type: string
          p_metadata?: Json
          p_severity: string
        }
        Returns: string
      }
      require_mfa_for_operation: {
        Args: { p_operation: string }
        Returns: boolean
      }
      secure_user_lookup: {
        Args: { user_email: string }
        Returns: {
          role_info: Json
          user_id: string
        }[]
      }
      user_has_salon_access: {
        Args: { p_salon_id: string }
        Returns: boolean
      }
      validate_and_sanitize_input: {
        Args: { p_input: string; p_input_type?: string }
        Returns: string
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_leaf_prefixes: {
        Args: { bucket_ids: string[]; names: string[] }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      lock_top_prefixes: {
        Args: { bucket_ids: string[]; names: string[] }
        Returns: undefined
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v1_optimised: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  supabase_migrations: {
    Tables: {
      schema_migrations: {
        Row: {
          created_by: string | null
          idempotency_key: string | null
          name: string | null
          statements: string[] | null
          version: string
        }
        Insert: {
          created_by?: string | null
          idempotency_key?: string | null
          name?: string | null
          statements?: string[] | null
          version: string
        }
        Update: {
          created_by?: string | null
          idempotency_key?: string | null
          name?: string | null
          statements?: string[] | null
          version?: string
        }
        Relationships: []
      }
      seed_files: {
        Row: {
          hash: string
          path: string
        }
        Insert: {
          hash: string
          path: string
        }
        Update: {
          hash?: string
          path?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  utility: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_indexing_optimization_report: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: string
          metric: string
          section: string
          value: string
        }[]
      }
      generate_refactoring_report: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: string
          notes: string
          priority: string
          report_section: string
        }[]
      }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_error: {
        Args: {
          p_context?: Json
          p_error_detail?: string
          p_error_message: string
          p_function_name: string
        }
        Returns: undefined
      }
      validate_not_empty: {
        Args: { p_field_name?: string; p_value: string }
        Returns: string
      }
      validate_positive: {
        Args: { p_field_name?: string; p_value: number }
        Returns: number
      }
      validate_uuid: {
        Args: { p_field_name?: string; p_value: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  vault: {
    Tables: {
      secrets: {
        Row: {
          created_at: string
          description: string
          id: string
          key_id: string | null
          name: string | null
          nonce: string | null
          secret: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      decrypted_secrets: {
        Row: {
          created_at: string | null
          decrypted_secret: string | null
          description: string | null
          id: string | null
          key_id: string | null
          name: string | null
          nonce: string | null
          secret: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_secret?: never
          description?: string | null
          id?: string | null
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_secret?: never
          description?: string | null
          id?: string | null
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _crypto_aead_det_decrypt: {
        Args: {
          additional: string
          context?: string
          key_id: number
          message: string
          nonce?: string
        }
        Returns: string
      }
      _crypto_aead_det_encrypt: {
        Args: {
          additional: string
          context?: string
          key_id: number
          message: string
          nonce?: string
        }
        Returns: string
      }
      _crypto_aead_det_noncegen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_secret: {
        Args: {
          new_description?: string
          new_key_id?: string
          new_name?: string
          new_secret: string
        }
        Returns: string
      }
      update_secret: {
        Args: {
          new_description?: string
          new_key_id?: string
          new_name?: string
          new_secret?: string
          secret_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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

export const Constants = {
  admin: {
    Enums: {},
  },
  analytics: {
    Enums: {},
  },
  app_realtime: {
    Enums: {},
  },
  archive: {
    Enums: {},
  },
  audit: {
    Enums: {},
  },
  auth: {
    Enums: {
      aal_level: ["aal1", "aal2", "aal3"],
      code_challenge_method: ["s256", "plain"],
      factor_status: ["unverified", "verified"],
      factor_type: ["totp", "webauthn", "phone"],
      oauth_registration_type: ["dynamic", "manual"],
      one_time_token_type: [
        "confirmation_token",
        "reauthentication_token",
        "recovery_token",
        "email_change_token_new",
        "email_change_token_current",
        "phone_change_token",
      ],
    },
  },
  catalog: {
    Enums: {},
  },
  communication: {
    Enums: {},
  },
  cron: {
    Enums: {},
  },
  engagement: {
    Enums: {},
  },
  extensions: {
    Enums: {},
  },
  graphql: {
    Enums: {},
  },
  graphql_public: {
    Enums: {},
  },
  identity: {
    Enums: {},
  },
  inventory: {
    Enums: {},
  },
  net: {
    Enums: {
      request_status: ["PENDING", "SUCCESS", "ERROR"],
    },
  },
  organization: {
    Enums: {},
  },
  pgbouncer: {
    Enums: {},
  },
  private: {
    Enums: {},
  },
  public: {
    Enums: {
      appointment_status: [
        "draft",
        "pending",
        "confirmed",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
        "rescheduled",
      ],
      audit_category: [
        "authentication",
        "data_modification",
        "access_control",
        "system_monitoring",
        "compliance",
        "maintenance",
        "security",
        "performance",
      ],
      audit_event_type: [
        "user_action",
        "system_event",
        "data_access",
        "authentication",
        "authorization",
        "api_call",
        "security_event",
      ],
      audit_severity: ["info", "debug", "warning", "error", "critical"],
      billing_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "cancelled",
      ],
      compliance_type: [
        "gdpr",
        "hipaa",
        "sox",
        "pci_dss",
        "ccpa",
        "iso27001",
        "security_audit",
        "data_retention",
      ],
      data_operation: ["INSERT", "UPDATE", "DELETE"],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      incident_severity: ["low", "medium", "high", "critical"],
      incident_status: [
        "detected",
        "investigating",
        "contained",
        "resolved",
        "false_positive",
      ],
      invoice_status: [
        "draft",
        "sent",
        "viewed",
        "partially_paid",
        "paid",
        "overdue",
        "cancelled",
        "refunded",
      ],
      loyalty_transaction_type: [
        "earned",
        "redeemed",
        "expired",
        "adjusted",
        "bonus",
      ],
      notification_channel: ["email", "sms", "push", "in_app", "whatsapp"],
      notification_status: [
        "queued",
        "sending",
        "sent",
        "delivered",
        "opened",
        "clicked",
        "failed",
        "bounced",
        "unsubscribed",
      ],
      notification_type: [
        "appointment_confirmation",
        "appointment_reminder",
        "appointment_cancelled",
        "appointment_rescheduled",
        "promotion",
        "review_request",
        "loyalty_update",
        "staff_message",
        "system_alert",
        "welcome",
        "birthday",
        "other",
      ],
      payment_method: [
        "cash",
        "card",
        "online",
        "wallet",
        "loyalty_points",
        "gift_card",
        "other",
      ],
      payment_method_type: [
        "card",
        "bank_account",
        "paypal",
        "stripe",
        "cash",
        "check",
        "crypto",
        "other",
      ],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "partially_refunded",
        "cancelled",
      ],
      period_type: [
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "yearly",
      ],
      proficiency_level: [
        "trainee",
        "beginner",
        "intermediate",
        "advanced",
        "expert",
        "master",
      ],
      purchase_order_status: [
        "draft",
        "submitted",
        "approved",
        "ordered",
        "partially_received",
        "received",
        "cancelled",
      ],
      referral_status: [
        "pending",
        "accepted",
        "completed",
        "expired",
        "cancelled",
      ],
      review_status: [
        "pending",
        "approved",
        "rejected",
        "flagged",
        "hidden",
        "deleted",
      ],
      role_type: [
        "super_admin",
        "platform_admin",
        "tenant_owner",
        "salon_owner",
        "salon_manager",
        "senior_staff",
        "staff",
        "junior_staff",
        "customer",
        "vip_customer",
        "guest",
      ],
      security_incident_type: [
        "failed_login",
        "brute_force",
        "suspicious_activity",
        "data_breach",
        "unauthorized_access",
        "privilege_escalation",
        "high_risk_event",
        "malware_detected",
        "sql_injection",
        "xss_attempt",
      ],
      service_status: ["active", "inactive", "discontinued", "seasonal"],
      staff_status: [
        "available",
        "busy",
        "break",
        "off_duty",
        "vacation",
        "sick_leave",
        "training",
      ],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "cancelled",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "paused",
      ],
      thread_priority: ["low", "normal", "high", "urgent"],
      thread_status: ["open", "in_progress", "resolved", "closed", "archived"],
      time_off_status: ["pending", "approved", "rejected", "cancelled"],
    },
  },
  realtime: {
    Enums: {
      action: ["INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR"],
      equality_op: ["eq", "neq", "lt", "lte", "gt", "gte", "in"],
    },
  },
  realtime_system: {
    Enums: {},
  },
  scheduling: {
    Enums: {},
  },
  security: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS"],
    },
  },
  supabase_migrations: {
    Enums: {},
  },
  utility: {
    Enums: {},
  },
  vault: {
    Enums: {},
  },
} as const
