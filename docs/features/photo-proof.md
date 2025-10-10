# Photo Proof System Feature

**Status**: ✅ Implemented (Phase 1)  
**User Role**: cleaner (upload), property_owner (view)  
**Priority**: Critical (quality control)

---

## What This Feature Does

Requires cleaners to upload minimum number of photos before marking a cleaning session as complete. Provides visual proof of work quality to property owners, eliminating "he said, she said" disputes.

---

## User Story

**As a property owner**, I want to see photos of completed cleanings, so that I can verify quality before the next guest arrives and have proof if guests complain.

**As a cleaner**, I want a clear system for documenting my work with photos, so that I'm protected from false quality complaints and can prove I did the job properly.

---

## User Flow

### When Cleaner Tries to Complete Session

1. Cleaner finishes cleaning property
2. Taps "Mark Complete" button on active session card
3. **PhotoProofGate modal appears full-screen**
4. Shows photo requirements:
   ```
   Upload Photos (0/3)
   
   Required Photos:
   ☐ Kitchen (counters, sink, appliances)
   ☐ Bathroom (toilet, shower, sink)  
   ☐ Living Area (floors, furniture)
   ```

---

### Taking Photos

1. Cleaner taps "Kitchen" photo requirement
2. Choice appears: "Take Photo" or "Choose from Gallery"
3. Selects "Take Photo" → Camera opens
4. Takes photo → Photo appears in thumbnail
5. Requirement changes to ✓ Kitchen (green checkmark)
6. Progress updates: "1/3 photos"
7. Repeat for bathroom and living area

**Result**: "3/3 photos" → "Finish" button enables

---

### Completing with Photos

1. All 3 required photos uploaded
2. Optional: Add completion notes ("Extra cleaning in kitchen")
3. Tap "Finish" button
4. Photos upload to Supabase Storage
5. Session marked as 'completed'
6. Owner receives notification with photo links

---

## Photo Requirements by Session Type

### Standard Cleaning (checkout_clean, checkin_prep)
**Minimum 3 photos**:
- Kitchen
- Bathroom
- Living area

### Deep Cleaning
**Minimum 5 photos**:
- Kitchen
- Bathroom
- Living area
- Bedrooms
- Outdoor areas

### Property-Specific Additions
- **Has pool**: Add pool area photo
- **Has hot tub**: Add hot tub photo
- **Special areas**: Add photos for any custom areas

---

## Technical Implementation

### Photo Requirement Generation
```typescript
PhotoProofService.generatePhotoRequirements(
  sessionId: string,
  sessionType: string,
  propertyRooms: number
): PhotoProofRequirement[]

// Returns array of required photos based on:
// - Session type (standard vs deep clean)
// - Property features (pool, hot tub, etc.)
// - Room count
```

### Photo Validation
```typescript
PhotoProofService.validatePhotoProof(
  sessionId: string
): PhotoProofValidation

// Returns:
{
  can_complete_session: boolean,
  missing_photos: PhotoProofRequirement[],
  completion_percentage: number,
  validation_message: string
}
```

### Photo Upload
```typescript
PhotoProofService.capturePhoto(
  sessionId: string,
  photoType: string,
  imageUri: string
): Promise<string>

// Uploads to Supabase Storage
// Path: /cleaning-photos/{sessionId}/{photoType}.jpg
// Returns: Public URL
```

---

## Storage Structure

### Supabase Storage Bucket: cleaning-photos
```
cleaning-photos/
├── {sessionId}/
│   ├── kitchen_1704123456789.jpg
│   ├── bathroom_1704123467890.jpg
│   ├── living_area_1704123478901.jpg
│   └── pool_1704123489012.jpg
```

### File Naming Convention
`{category}_{timestamp}.jpg`

**Benefits**:
- Organized by session
- Unique filenames (timestamp)
- Easy to identify photo type

---

## Business Rules Enforced

### Cannot Complete Without Photos
- "Mark Complete" button disabled until photos uploaded
- UI shows progress: "2/3 photos - upload 1 more"
- Error shown if trying to bypass: "Photos required to complete session"

### Photo Metadata Tracked
- Session ID
- Upload timestamp
- File size
- Photo category (kitchen, bathroom, etc.)
- Uploaded by (cleaner user ID)

**Why**: Audit trail, dispute resolution, quality verification

---

## UI/UX Design

### Photo Proof Gate Modal
- Full-screen modal (cannot dismiss until complete or cancel)
- Header: "Upload Completion Photos"
- Progress indicator: Large "3/5" with progress bar
- Photo grid: 2 columns on mobile
- Each requirement shows:
  - Icon for category
  - Category name
  - Checkmark when complete
  - Thumbnail when uploaded

### Camera Integration
- Uses Expo Camera for photo capture
- Alternative: Expo ImagePicker for gallery selection
- Preview before confirming
- Retake option if photo blurry

---

## Error Handling

### Photo Upload Fails
**Error**: Network timeout or Supabase error

**Handling**:
- Show error message: "Upload failed. Check your connection."
- Photo remains in local cache
- Retry button appears
- Can attempt upload again

### Invalid Photo Format
**Error**: User selects non-image file

**Handling**:
- Validate MIME type (image/jpeg, image/png, image/webp)
- Show error: "Please select a valid image file"
- Requirement remains unchecked

---

## Edge Cases

### Cleaner Closes App Mid-Upload
- Photos saved to local AsyncStorage
- Resume upload on app reopen
- Progress preserved

### Owner Views Photos Before All Uploaded
- Shows partial photos with "Upload in progress"
- Updates real-time as photos arrive

### Photo Too Large
- Compress image before upload (Phase 2)
- Currently accepts up to 5MB per photo

---

## Testing Scenarios

### Happy Path
1. Complete cleaning ✓
2. Tap "Mark Complete" ✓
3. PhotoProofGate appears ✓
4. Upload 3 photos via camera ✓
5. Tap "Finish" ✓
6. Session marked complete ✓

### Try to Skip Photos
1. Complete cleaning ✓
2. Tap "Mark Complete" ✓
3. PhotoProofGate appears ✓
4. Tap "Cancel" ✓
5. Back to active session (still in_progress) ✓
6. Cannot complete without photos ✓

### Upload Fails
1. Take photos ✓
2. Lose network connection ✗
3. Tap "Finish" ✗
4. Upload fails ✗
5. Error shown with retry ✓
6. Reconnect and retry ✓
7. Upload succeeds ✓

---

## Success Criteria

Feature succeeds when:
- ✅ 100% of completed sessions have photos
- ✅ Zero sessions marked complete without photos
- ✅ Photo upload success rate > 95%
- ✅ Dispute rate < 1% (photos prevent disputes)
- ✅ Owners trust cleaner work quality
- ✅ Cleaners feel protected from false complaints

---

**Implementation**: `services/photoProofService.ts`, `components/PhotoProofGate.tsx`  
**Database**: `photo_proof_requirements` table  
**Storage**: Supabase Storage bucket: `cleaning-photos`

