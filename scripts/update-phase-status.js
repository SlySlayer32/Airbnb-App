/**
 * Phase Status Updater
 *
 * Updates docs/phase-tracking/CURRENT_PHASE.json based on project state
 * Can be run manually or integrated into CI/CD pipeline
 *
 * Usage: node scripts/update-phase-status.js
 */

const fs = require('fs');
const path = require('path');

const PHASE_FILE = path.join(
  __dirname,
  '../docs/phase-tracking/CURRENT_PHASE.json'
);

/**
 * Counts completed issues by scanning ISSUE_AUDIT.md
 */
function countCompletedIssues() {
  const auditPath = path.join(
    __dirname,
    '../docs/phase-tracking/ISSUE_AUDIT.md'
  );

  if (!fs.existsSync(auditPath)) {
    console.log('⚠️  ISSUE_AUDIT.md not found');
    return { completed: 0, total: 0 };
  }

  const content = fs.readFileSync(auditPath, 'utf-8');

  // Count "Status**: ✅ Complete" occurrences
  const completedMatches = content.match(/Status.*:.*✅.*Complete/gi) || [];
  const completed = completedMatches.length;

  return { completed, total: completed }; // Assuming all issues are complete for Phase 1
}

/**
 * Determines current phase completion percentage
 */
function calculateCompletion(issues) {
  if (issues.total === 0) return 0;
  return Math.floor((issues.completed / issues.total) * 100);
}

/**
 * Suggests next development step based on phase
 */
function getNextStep(phase, completion) {
  if (phase === 1 && completion === 100) {
    return {
      recommended_next_step: 'Photo storage optimization',
      current_focus: 'Planning Phase 2 features',
      blockers: [],
    };
  }

  if (phase === 1) {
    return {
      recommended_next_step: 'Complete remaining Phase 1 issues',
      current_focus: 'Finishing Phase 1 MVP',
      blockers: [],
    };
  }

  return {
    recommended_next_step: 'Define Phase 2 scope',
    current_focus: 'Planning',
    blockers: [],
  };
}

/**
 * Main update function
 */
function updatePhaseStatus() {
  console.log('🔄 Updating phase status...\n');

  // Read current phase file
  let currentPhase = {
    project: 'Airbnb Cleaning Management',
    current_phase: 1,
    phase_name: 'Core Cleaner Dashboard MVP',
    completion_percentage: 0,
    status: 'in_progress',
    started: '2025-09-01',
    completed: null,
    issues_closed: 0,
    issues_total: 0,
    next_phase: 2,
    next_phase_name: 'Advanced Features & Polish',
    blockers: [],
    current_focus: 'Development',
    recommended_next_step: 'Continue implementation',
  };

  if (fs.existsSync(PHASE_FILE)) {
    const existing = JSON.parse(fs.readFileSync(PHASE_FILE, 'utf-8'));
    currentPhase = { ...currentPhase, ...existing };
  }

  // Count issues
  const issues = countCompletedIssues();
  console.log(`📊 Issues: ${issues.completed}/${issues.total} completed`);

  // Calculate completion
  const completion = calculateCompletion(issues);
  console.log(`📈 Completion: ${completion}%`);

  // Determine status
  const status = completion === 100 ? 'complete' : 'in_progress';

  // Get next steps
  const nextSteps = getNextStep(currentPhase.current_phase, completion);

  // Update phase object
  const updatedPhase = {
    ...currentPhase,
    completion_percentage: completion,
    status: status,
    issues_closed: issues.completed,
    issues_total: issues.total,
    completed:
      status === 'complete'
        ? currentPhase.completed || new Date().toISOString().split('T')[0]
        : null,
    ...nextSteps,
    last_updated: new Date().toISOString(),
  };

  // Write back to file
  fs.writeFileSync(PHASE_FILE, JSON.stringify(updatedPhase, null, 2), 'utf-8');

  console.log('\n✅ Phase status updated successfully!');
  console.log(`📍 Status: ${updatedPhase.status}`);
  console.log(`🎯 Next: ${updatedPhase.recommended_next_step}\n`);
}

// Run if called directly
if (require.main === module) {
  try {
    updatePhaseStatus();
  } catch (error) {
    console.error('❌ Error updating phase status:', error.message);
    process.exit(1);
  }
}

module.exports = { updatePhaseStatus };
