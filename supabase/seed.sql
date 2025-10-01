-- Seed script for Enorae platform demo data
-- This creates sample data for testing and demonstration

-- Clear existing demo data (be careful in production!)
-- DELETE FROM appointments WHERE created_at > '2025-01-01';
-- DELETE FROM services WHERE created_at > '2025-01-01';
-- DELETE FROM staff_profiles WHERE created_at > '2025-01-01';
-- DELETE FROM salons WHERE created_at > '2025-01-01';
-- DELETE FROM profiles WHERE created_at > '2025-01-01';

-- Create demo users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'customer@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'business@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'admin@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'staff1@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('55555555-5555-5555-5555-555555555555', 'staff2@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create user profiles
INSERT INTO profiles (id, email, full_name, phone, role, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'customer@demo.com', 'John Customer', '+1234567890', 'customer', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'business@demo.com', 'Sarah Business', '+1234567891', 'business', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'admin@demo.com', 'Admin User', '+1234567892', 'admin', now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'staff1@demo.com', 'Emily Stylist', '+1234567893', 'staff', now(), now()),
  ('55555555-5555-5555-5555-555555555555', 'staff2@demo.com', 'Michael Barber', '+1234567894', 'staff', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create demo salons
INSERT INTO organization.salons (id, name, slug, business_name, business_type, owner_id, created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Luxe Beauty Studio', 'luxe-beauty-studio', 'Luxe Beauty Studio LLC', 'beauty_salon', '22222222-2222-2222-2222-222222222222', now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Urban Cuts Barbershop', 'urban-cuts', 'Urban Cuts Inc', 'barbershop', '22222222-2222-2222-2222-222222222222', now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Zen Spa & Wellness', 'zen-spa', 'Zen Spa & Wellness Center', 'spa', '22222222-2222-2222-2222-222222222222', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create salon locations
INSERT INTO organization.salon_locations (id, salon_id, address, city, state, zip_code, country, is_primary, created_at)
VALUES
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '123 Beauty Lane', 'New York', 'NY', '10001', 'USA', true, now()),
  ('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '456 Barber Street', 'Los Angeles', 'CA', '90001', 'USA', true, now()),
  ('33333333-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '789 Wellness Ave', 'Miami', 'FL', '33101', 'USA', true, now())
ON CONFLICT (id) DO NOTHING;

-- Create services
INSERT INTO catalog.services (id, salon_id, name, description, duration, price, is_active, created_at, updated_at)
VALUES
  -- Luxe Beauty Studio services
  ('11111111-1111-1111-1111-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Haircut & Style', 'Professional haircut and styling', 60, 75.00, true, now(), now()),
  ('22222222-2222-2222-2222-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hair Color', 'Full hair coloring service', 120, 150.00, true, now(), now()),
  ('33333333-3333-3333-3333-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Manicure & Pedicure', 'Complete nail care service', 90, 85.00, true, now(), now()),
  ('44444444-4444-4444-4444-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Facial Treatment', 'Rejuvenating facial treatment', 60, 95.00, true, now(), now()),

  -- Urban Cuts services
  ('11111111-1111-1111-1111-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Classic Haircut', 'Traditional mens haircut', 30, 35.00, true, now(), now()),
  ('22222222-2222-2222-2222-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Beard Trim & Shape', 'Professional beard grooming', 30, 25.00, true, now(), now()),
  ('33333333-3333-3333-3333-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Hot Towel Shave', 'Luxury hot towel shave', 45, 45.00, true, now(), now()),

  -- Zen Spa services
  ('11111111-1111-1111-1111-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Swedish Massage', 'Relaxing full body massage', 60, 120.00, true, now(), now()),
  ('22222222-2222-2222-2222-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Deep Tissue Massage', 'Therapeutic deep tissue massage', 90, 180.00, true, now(), now()),
  ('33333333-3333-3333-3333-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Aromatherapy Session', 'Essential oil therapy session', 60, 95.00, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create staff profiles
INSERT INTO organization.staff_profiles (id, salon_id, user_id, full_name, role, specialties, is_active, created_at, updated_at)
VALUES
  ('aaaa1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Emily Stylist', 'stylist', ARRAY['haircut', 'coloring', 'styling'], true, now(), now()),
  ('aaaa2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Michael Barber', 'barber', ARRAY['mens cuts', 'beard trim'], true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create sample appointments
INSERT INTO scheduling.appointments (id, salon_id, customer_id, staff_id, start_time, end_time, status, total_price, created_at, updated_at)
VALUES
  ('appt1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111',
   now() + interval '1 day', now() + interval '1 day' + interval '1 hour', 'confirmed', 75.00, now(), now()),

  ('appt2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111',
   now() + interval '3 days', now() + interval '3 days' + interval '2 hours', 'pending', 150.00, now(), now()),

  ('appt3333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222',
   now() - interval '7 days', now() - interval '7 days' + interval '1 hour', 'completed', 85.00, now() - interval '7 days', now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;

-- Link services to appointments
INSERT INTO scheduling.appointment_services (appointment_id, service_id, price, created_at)
VALUES
  ('appt1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-aaaaaaaaaaaa', 75.00, now()),
  ('appt2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-aaaaaaaaaaaa', 150.00, now()),
  ('appt3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-aaaaaaaaaaaa', 85.00, now())
ON CONFLICT DO NOTHING;

-- Create staff schedules
INSERT INTO scheduling.staff_schedules (staff_id, salon_id, day_of_week, start_time, end_time, is_available, created_at)
VALUES
  ('aaaa1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '09:00', '17:00', true, now()),
  ('aaaa1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '09:00', '17:00', true, now()),
  ('aaaa1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '09:00', '17:00', true, now()),
  ('aaaa1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '09:00', '17:00', true, now()),
  ('aaaa1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '09:00', '17:00', true, now()),
  ('aaaa2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '10:00', '18:00', true, now()),
  ('aaaa2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '10:00', '18:00', true, now()),
  ('aaaa2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '10:00', '18:00', true, now()),
  ('aaaa2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '10:00', '18:00', true, now()),
  ('aaaa2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '10:00', '18:00', true, now())
ON CONFLICT DO NOTHING;

-- Add some transactions
INSERT INTO inventory.transactions (appointment_id, amount, status, payment_intent_id, customer_id, created_at, updated_at)
VALUES
  ('appt3333-3333-3333-3333-333333333333', 85.00, 'succeeded', 'pi_demo_completed', '11111111-1111-1111-1111-111111111111', now() - interval '7 days', now() - interval '7 days')
ON CONFLICT DO NOTHING;

-- Output success message
DO $$
BEGIN
  RAISE NOTICE 'Demo data seeded successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Demo Accounts:';
  RAISE NOTICE '- Customer: customer@demo.com / password123';
  RAISE NOTICE '- Business: business@demo.com / password123';
  RAISE NOTICE '- Admin: admin@demo.com / password123';
  RAISE NOTICE '- Staff 1: staff1@demo.com / password123';
  RAISE NOTICE '- Staff 2: staff2@demo.com / password123';
  RAISE NOTICE '';
  RAISE NOTICE 'Demo Salons:';
  RAISE NOTICE '- Luxe Beauty Studio';
  RAISE NOTICE '- Urban Cuts Barbershop';
  RAISE NOTICE '- Zen Spa & Wellness';
END $$;