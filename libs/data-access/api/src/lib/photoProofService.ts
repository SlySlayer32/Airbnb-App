import {
  PhotoCaptureResult,
  PhotoProofRequirement,
  PhotoProofStatus,
  PhotoProofValidation,
} from '@airbnb/core-domain-models';

/**
 * Photo Proof Service - Manages photo requirements and validation for cleaning sessions
 */
export class PhotoProofService {
  static async generatePhotoRequirements(
    sessionId: string,
    sessionType: string,
    propertyRooms: number
  ): Promise<PhotoProofRequirement[]> {
    const requirements: PhotoProofRequirement[] = [];

    const baseRequirements: PhotoProofRequirement[] = [
      {
        id: `${sessionId}_before_cleaning`,
        session_id: sessionId,
        category: 'before_cleaning',
        area_name: 'Overall Property',
        is_required: true,
        is_completed: false,
        created_at: new Date().toISOString(),
      },
      {
        id: `${sessionId}_after_cleaning`,
        session_id: sessionId,
        category: 'after_cleaning',
        area_name: 'Overall Property',
        is_required: true,
        is_completed: false,
        created_at: new Date().toISOString(),
      },
    ];

    requirements.push(...baseRequirements);

    if (sessionType === 'checkout_clean' || sessionType === 'deep_clean') {
      const highTouchAreas = [
        'Kitchen Countertops',
        'Bathroom Sinks',
        'Toilet Areas',
        'Bedroom Surfaces',
      ];

      highTouchAreas.forEach((area, index) => {
        requirements.push({
          id: `${sessionId}_specific_${index}`,
          session_id: sessionId,
          category: 'specific_area',
          area_name: area,
          is_required: true,
          is_completed: false,
          created_at: new Date().toISOString(),
        });
      });
    }

    if (propertyRooms > 2) {
      requirements.push({
        id: `${sessionId}_living_area`,
        session_id: sessionId,
        category: 'specific_area',
        area_name: 'Living Area',
        is_required: true,
        is_completed: false,
        created_at: new Date().toISOString(),
      });
    }

    return requirements;
  }

  static async getPhotoProofStatus(
    sessionId: string
  ): Promise<PhotoProofStatus> {
    const mockRequirements: PhotoProofRequirement[] = [
      {
        id: `${sessionId}_before_cleaning`,
        session_id: sessionId,
        category: 'before_cleaning',
        area_name: 'Overall Property',
        is_required: true,
        is_completed: false,
        created_at: new Date().toISOString(),
      },
      {
        id: `${sessionId}_after_cleaning`,
        session_id: sessionId,
        category: 'after_cleaning',
        area_name: 'Overall Property',
        is_required: true,
        is_completed: false,
        created_at: new Date().toISOString(),
      },
    ];

    const totalRequired = mockRequirements.filter(
      req => req.is_required
    ).length;
    const totalCompleted = mockRequirements.filter(
      req => req.is_completed
    ).length;
    const missingCategories = mockRequirements
      .filter(req => req.is_required && !req.is_completed)
      .map(req => req.category);

    return {
      session_id: sessionId,
      total_required: totalRequired,
      total_completed: totalCompleted,
      is_complete: totalCompleted >= totalRequired,
      missing_categories: missingCategories,
      requirements: mockRequirements,
    };
  }

  static async validatePhotoProof(
    sessionId: string
  ): Promise<PhotoProofValidation> {
    const status = await this.getPhotoProofStatus(sessionId);
    const completionPercentage =
      status.total_required > 0
        ? Math.round((status.total_completed / status.total_required) * 100)
        : 100;

    const canComplete = status.is_complete;
    const validationMessage = canComplete
      ? 'All required photos have been captured. Session can be completed.'
      : `${status.total_required - status.total_completed} photo(s) still required before completion.`;

    return {
      can_complete_session: canComplete,
      missing_photos: status.requirements.filter(
        req => req.is_required && !req.is_completed
      ),
      completion_percentage: completionPercentage,
      validation_message: validationMessage,
    };
  }

  static async capturePhoto(
    sessionId: string,
    category: string,
    areaName: string
  ): Promise<PhotoCaptureResult> {
    const mockPhotoUrl = `https://example.com/photos/${sessionId}_${category}_${Date.now()}.jpg`;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      photo_url: mockPhotoUrl,
      category,
      area_name: areaName,
    };
  }

  static async markPhotoCompleted(
    _sessionId: string,
    _requirementId: string,
    _photoUrl: string
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  static async getSessionPhotoRequirements(
    sessionId: string
  ): Promise<PhotoProofRequirement[]> {
    const status = await this.getPhotoProofStatus(sessionId);
    return status.requirements;
  }

  static async hasPhotoRequirements(sessionId: string): Promise<boolean> {
    const status = await this.getPhotoProofStatus(sessionId);
    return status.total_required > 0;
  }
}
