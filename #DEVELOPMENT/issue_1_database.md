# 📊 Database Schema Implementation

**Epic**: Enhanced Property Management System  
**Phase**: 1 - Database Foundation  
**Priority**: Critical  
**Estimated Time**: 2-3 days  

## Overview
Implement the complete database schema that supports the enhanced property-cleaner workflow. This includes new tables for cleaning sessions, linen requirements, real-time updates, and a comprehensive notification system.

## Requirements

### Core Tables to Implement
- [ ] **Enhanced `properties` table** with access info, amenities, cleaning logistics
- [ ] **`cleaning_sessions` table** for booking workflow with guest counts and timing
- [ ] **`linen_requirements` table** for configurable needs per guest count  
- [ ] **`cleaning_updates` table** for real-time cleaner-to-owner communication
- [ ] **`property_issues` table** for problem reporting and tracking
- [ ] **`notifications` table** for multi-channel alerts
- [ ] **`cleaner_performance` table** for tracking metrics

### Security Implementation
- [ ] Row Level Security (RLS) policies for multi-tenant access
- [ ] Property owners can only access their properties
- [ ] Cleaners can only see assigned properties and sessions
- [ ] Secure storage of sensitive data (access codes, WiFi passwords)

### Database Functions & Triggers
- [ ] Auto-create user profiles on signup
- [ ] Generate default linen requirements for new properties
- [ ] Automatic invoice number generation
- [ ] Ticket number generation for maintenance

## Acceptance Criteria

### Data Access Control
- [ ] Property owners cannot see other owners' properties
- [ ] Cleaners only see properties with assigned cleaning sessions
- [ ] Team members are scoped to their property owner
- [ ] Sensitive access information is properly encrypted

### Relationship Integrity
- [ ] Foreign key constraints properly implemented
- [ ] Cascade deletes configured appropriately
- [ ] Unique constraints on critical fields (invoice numbers, ticket numbers)
- [ ] Proper indexing for performance on filtered queries

### Sample Data Validation
- [ ] Can create properties with full access information
- [ ] Can generate cleaning sessions with guest count and timing
- [ ] Linen requirements automatically created for different guest counts
- [ ] Notifications can be created and retrieved by user
- [ ] Cleaning updates can be posted and retrieved in chronological order

## Implementation Details

### Schema File Location
```
development/enhanced_database_schema.sql
```

### Key Features
1. **Access Management**: Secure storage of lockbox codes, smart lock codes, WiFi credentials
2. **Cleaning Logistics**: Supply locations, vacuum storage, linen storage details
3. **Session Lifecycle**: From scheduling through completion with status tracking
4. **Communication**: Real-time updates, photo URLs, issue escalation
5. **Performance Tracking**: Cleaner metrics, completion rates, average duration

### Critical Fields
```sql
-- Properties table additions
access_method: key_lockbox | smart_lock | doorman | owner_present | other
access_code: TEXT (encrypted)
wifi_name: TEXT
wifi_password: TEXT (encrypted)
max_occupancy: INTEGER
special_areas: TEXT[]

-- Cleaning sessions
guest_count: INTEGER NOT NULL
checkin_time: TIMESTAMP WITH TIME ZONE
checkout_time: TIMESTAMP WITH TIME ZONE  
scheduled_cleaning_time: TIMESTAMP WITH TIME ZONE
cancellation_notice_hours: INTEGER
```

## Testing Checklist

### Database Operations
- [ ] Create property with all enhanced fields
- [ ] Generate cleaning session with linen requirements
- [ ] Post cleaning updates with photos
- [ ] Test cancellation workflow with reason tracking
- [ ] Verify notification creation and delivery

### Security Testing  
- [ ] RLS policies prevent cross-tenant access
- [ ] Sensitive data properly protected
- [ ] User authentication required for all operations
- [ ] Audit trail for critical changes

### Performance Testing
- [ ] Property queries under 200ms with proper indexing
- [ ] Session retrieval efficient for mobile users
- [ ] Update posting doesn't block other operations
- [ ] Bulk operations (linen requirements) perform well

## Migration Strategy

### New Installation
1. Run complete schema file in Supabase
2. Verify all tables created successfully
3. Test RLS policies with test users
4. Generate sample data for development

### Existing Data Migration
If migrating from current system:
1. Export existing properties data
2. Map to new enhanced structure
3. Generate default linen requirements
4. Create initial cleaning sessions
5. Verify data integrity

## Files Changed
- `app/lib/supabase.ts` - Update connection if needed
- `development/enhanced_database_schema.sql` - Complete schema
- Environment variables for database credentials

## Dependencies
- Supabase project with appropriate permissions
- Database admin access for schema changes
- Environment variables configured

## Risks & Mitigation
- **Data loss during migration**: Take full backup before changes
- **RLS policy conflicts**: Test with multiple user roles
- **Performance issues**: Implement proper indexing from start
- **Sensitive data exposure**: Use encryption for access codes

## Definition of Done
- [ ] All tables created successfully in Supabase
- [ ] RLS policies tested and working
- [ ] Sample data can be created and retrieved
- [ ] Performance benchmarks met
- [ ] Security audit passed for sensitive data
- [ ] Migration documentation completed