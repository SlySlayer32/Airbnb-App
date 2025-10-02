import { supabase } from '../lib/supabase';
import { 
  PhotoProofRequirement, 
  PhotoProofStatus, 
  PhotoCaptureResult, 
  PhotoProofValidation,
  CleaningSession 
} from '../types';

/**
 * Photo Proof Service - Manages photo requirements and validation for cleaning sessions
 * 
 * Business Purpose: Ensures property owners receive visual proof of completed cleaning
 * by requiring photos before sessions can be marked complete.
 */
export class PhotoProofService {
  
  /**
   * Generate photo requirements for a cleaning session
   * Business Rule: Different session types require different photo evidence
   */
  static async generatePhotoRequirements(sessionId: string, sessionType: string, propertyRooms: number): Promise<PhotoProofRequirement[]> {
    try {
      const requirements: PhotoProofRequirement[] = [];
      
      // Base requirements for all cleaning sessions
      const baseRequirements = [
        {
          id: `${sessionId}_before_cleaning`,
          session_id: sessionId,
          category: 'before_cleaning' as const,
          area_name: 'Overall Property',
          is_required: true,
          is_completed: false,
          created_at: new Date().toISOString()
        },
        {
          id: `${sessionId}_after_cleaning`,
          session_id: sessionId,
          category: 'after_cleaning' as const,
          area_name: 'Overall Property',
          is_required: true,
          is_completed: false,
          created_at: new Date().toISOString()
        }
      ];

      requirements.push(...baseRequirements);

      // Additional requirements based on session type
      if (sessionType === 'checkout_clean' || sessionType === 'deep_clean') {
        // High-touch areas for checkout cleans
        const highTouchAreas = [
          'Kitchen Countertops',
          'Bathroom Sinks',
          'Toilet Areas',
          'Bedroom Surfaces'
        ];

        highTouchAreas.forEach((area, index) => {
          requirements.push({
            id: `${sessionId}_specific_${index}`,
            session_id: sessionId,
            category: 'specific_area' as const,
            area_name: area,
            is_required: true,
            is_completed: false,
            created_at: new Date().toISOString()
          });
        });
      }

      // Room-specific requirements based on property size
      if (propertyRooms > 2) {
        requirements.push({
          id: `${sessionId}_living_area`,
          session_id: sessionId,
          category: 'specific_area' as const,
          area_name: 'Living Area',
          is_required: true,
          is_completed: false,
          created_at: new Date().toISOString()
        });
      }

      return requirements;
    } catch (error) {
      console.error('Error generating photo requirements:', error);
      throw new Error('Failed to generate photo requirements');
    }
  }

  /**
   * Get photo proof status for a session
   * Business Rule: Track completion percentage and missing requirements
   */
  static async getPhotoProofStatus(sessionId: string): Promise<PhotoProofStatus> {
    try {
      // For Phase 1, we'll use mock data since we don't have Supabase storage yet
      const mockRequirements: PhotoProofRequirement[] = [
        {
          id: `${sessionId}_before_cleaning`,
          session_id: sessionId,
          category: 'before_cleaning',
          area_name: 'Overall Property',
          is_required: true,
          is_completed: false,
          created_at: new Date().toISOString()
        },
        {
          id: `${sessionId}_after_cleaning`,
          session_id: sessionId,
          category: 'after_cleaning',
          area_name: 'Overall Property',
          is_required: true,
          is_completed: false,
          created_at: new Date().toISOString()
        }
      ];

      const totalRequired = mockRequirements.filter(req => req.is_required).length;
      const totalCompleted = mockRequirements.filter(req => req.is_completed).length;
      const missingCategories = mockRequirements
        .filter(req => req.is_required && !req.is_completed)
        .map(req => req.category);

      return {
        session_id: sessionId,
        total_required: totalRequired,
        total_completed: totalCompleted,
        is_complete: totalCompleted >= totalRequired,
        missing_categories: missingCategories,
        requirements: mockRequirements
      };
    } catch (error) {
      console.error('Error getting photo proof status:', error);
      throw new Error('Failed to get photo proof status');
    }
  }

  /**
   * Validate if session can be completed based on photo requirements
   * Business Rule: Block completion until all required photos are provided
   */
  static async validatePhotoProof(sessionId: string): Promise<PhotoProofValidation> {
    try {
      const status = await this.getPhotoProofStatus(sessionId);
      
      const completionPercentage = status.total_required > 0 
        ? Math.round((status.total_completed / status.total_required) * 100)
        : 100;

      const canComplete = status.is_complete;
      
      let validationMessage = '';
      if (canComplete) {
        validationMessage = 'All required photos have been captured. Session can be completed.';
      } else {
        const missingCount = status.total_required - status.total_completed;
        validationMessage = `${missingCount} photo(s) still required before completion.`;
      }

      return {
        can_complete_session: canComplete,
        missing_photos: status.requirements.filter(req => req.is_required && !req.is_completed),
        completion_percentage: completionPercentage,
        validation_message: validationMessage
      };
    } catch (error) {
      console.error('Error validating photo proof:', error);
      throw new Error('Failed to validate photo proof');
    }
  }

  /**
   * Capture photo for a specific requirement (Phase 1 placeholder)
   * Business Rule: Photos must be captured for each required category
   */
  static async capturePhoto(
    sessionId: string, 
    category: string, 
    areaName: string
  ): Promise<PhotoCaptureResult> {
    try {
      // Phase 1: Mock photo capture - in Phase 2 this will integrate with Supabase Storage
      const mockPhotoUrl = `https://example.com/photos/${sessionId}_${category}_${Date.now()}.jpg`;
      
      // Simulate photo capture delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        photo_url: mockPhotoUrl,
        category,
        area_name: areaName
      };
    } catch (error) {
      console.error('Error capturing photo:', error);
      return {
        success: false,
        error: 'Failed to capture photo. Please try again.',
        category,
        area_name: areaName
      };
    }
  }

  /**
   * Mark a photo requirement as completed
   * Business Rule: Update completion status and track completion time
   */
  static async markPhotoCompleted(
    sessionId: string, 
    requirementId: string, 
    photoUrl: string
  ): Promise<boolean> {
    try {
      // Phase 1: Mock completion - in Phase 2 this will update Supabase
      console.log(`Photo completed for session ${sessionId}, requirement ${requirementId}`);
      
      // Simulate database update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error marking photo completed:', error);
      return false;
    }
  }

  /**
   * Get photo requirements for a session with completion status
   * Business Rule: Show cleaners exactly what photos are needed
   */
  static async getSessionPhotoRequirements(sessionId: string): Promise<PhotoProofRequirement[]> {
    try {
      const status = await this.getPhotoProofStatus(sessionId);
      return status.requirements;
    } catch (error) {
      console.error('Error getting session photo requirements:', error);
      throw new Error('Failed to get session photo requirements');
    }
  }

  /**
   * Check if session has photo proof requirements enabled
   * Business Rule: Some session types may not require photos
   */
  static async hasPhotoRequirements(sessionId: string): Promise<boolean> {
    try {
      const status = await this.getPhotoProofStatus(sessionId);
      return status.total_required > 0;
    } catch (error) {
      console.error('Error checking photo requirements:', error);
      return false;
    }
  }
}
