/**
 * Firm Expo — DM Campaign Orchestration Service
 * Handles campaign creation, audience validation, approval state transitions, and launch.
 */

import { 
  DMCampaign, 
  EligibleContact, 
  OptOutRecord, 
  ScheduledMessageItem, 
  DMCampaignStatus 
} from '../../types';
import { MessagingEligibilityService } from './eligibility';
import { TemplateRenderer } from './template-renderer';

export class DMCampaignService {
  /**
   * Prepares and validates a campaign before scheduling or submission
   */
  public static validateCampaign(
    campaign: Partial<DMCampaign>,
    contacts: EligibleContact[],
    suppressionList: OptOutRecord[]
  ): {
    isValid: boolean;
    errors: string[];
    eligibleContacts: EligibleContact[];
    excludedContacts: Array<{ contact: EligibleContact; reason: string }>;
  } {
    const errors: string[] = [];

    if (!campaign.name || campaign.name.trim().length === 0) {
      errors.push('Campaign name is required.');
    }

    if (!campaign.objective) {
      errors.push('Campaign objective must be selected.');
    }

    if (!campaign.platform) {
      errors.push('Target messaging platform is required.');
    }

    if (!campaign.accountId) {
      errors.push('Connected Meta account is required.');
    }

    if (!campaign.messageBody || campaign.messageBody.trim().length === 0) {
      errors.push('Message copy is required.');
    }

    // Filter contacts by chosen platform
    const platformContacts = contacts.filter(c => c.platform === campaign.platform);
    const { eligible, excluded } = MessagingEligibilityService.filterEligibleAudience(
      platformContacts,
      suppressionList
    );

    if (eligible.length === 0) {
      errors.push('No eligible recipients found within the active 24-hour messaging window. Cold outbound DMs to arbitrary users or followers are prohibited by Meta Graph API policy.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      eligibleContacts: eligible,
      excludedContacts: excluded.map(e => ({ contact: e.contact, reason: e.result.reason }))
    };
  }

  /**
   * Converts an approved campaign into scheduled queue items
   */
  public static generateScheduledQueueItems(
    campaign: DMCampaign,
    eligibleContacts: EligibleContact[],
    scheduledTimeISO?: string
  ): ScheduledMessageItem[] {
    const scheduledFor = scheduledTimeISO || new Date(Date.now() + 60000).toISOString();

    return eligibleContacts.map(contact => {
      const render = TemplateRenderer.render(campaign.messageBody, {
        firstName: contact.displayName.split(' ')[0] || contact.username,
        fullName: contact.displayName,
        companyName: contact.displayName || 'your team',
        eventName: campaign.firmExpoEventName || 'Firm Expo 2026',
        registrationLink: 'https://firmexpo.com/events/register'
      });

      return {
        id: `sch-${Date.now()}-${contact.id}`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        contactId: contact.id,
        recipientName: contact.displayName,
        recipientIdentifier: contact.platformRecipientId,
        platform: campaign.platform,
        renderedBody: render.renderedText,
        scheduledFor,
        status: 'pending',
        eligibilityRechecked: false,
        eligibilityPassed: true,
        idempotencyKey: `idem-${campaign.id}-${contact.platformRecipientId}`
      };
    });
  }
}
