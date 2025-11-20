


type BloodGroup =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE';

/**
 * Blood compatibility matrix
 * Key: Recipient blood group
 * Value: Array of donor blood groups that can donate
 */

// O- can only take from O-

const compatibilityMatrix: Record<BloodGroup, BloodGroup[]> = {
    O_NEGATIVE: ['O_NEGATIVE'],
  O_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE'],
  B_NEGATIVE: ['O_NEGATIVE', 'B_NEGATIVE'],
  B_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE', 'B_NEGATIVE', 'B_POSITIVE'],
  A_NEGATIVE: ['O_NEGATIVE', 'A_NEGATIVE'],
  A_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE', 'A_NEGATIVE', 'A_POSITIVE'],
  AB_NEGATIVE: ['O_NEGATIVE', 'B_NEGATIVE', 'A_NEGATIVE', 'AB_NEGATIVE'],
  AB_POSITIVE: [
    'O_NEGATIVE',
    'O_POSITIVE',
    'B_NEGATIVE',
    'B_POSITIVE',
    'A_NEGATIVE',
    'A_POSITIVE',
    'AB_NEGATIVE',
    'AB_POSITIVE',
  ], 
}

/**
 * Get compatible donor blood groups for a recipient
 * @param recipientBloodGroup - Blood group of the recipient
 * @returns Array of compatible donor blood groups
 */

export function getCompatibleDonors(
    recipientBloodGroup: BloodGroup
): BloodGroup[] {
    return compatibilityMatrix[recipientBloodGroup] || []
}

/**
 * Check if a donor can donate to a recipient
 * @param donorBloodGroup - Blood group of the donor
 * @param recipientBloodGroup - Blood group of the recipient
 * @returns true if compatible, false otherwise
 */


export function canDonate(
    donorBloodGroup: BloodGroup,
    recipientBloodGroup: BloodGroup
):  boolean {
    const compatibleDonors = getCompatibleDonors(recipientBloodGroup)
    return compatibleDonors.includes(donorBloodGroup)
}

/**
 * Get recipients that a donor can donate to
 * @param donorBloodGroup - Blood group of the donor
 * @returns Array of recipient blood groups
 */


export function getCompatibleRecipients(
    donorBloodGroup: BloodGroup
): BloodGroup[] {
    const recipients: BloodGroup[] = []

    for(const [recipient, donors] of Object.entries(compatibilityMatrix)) {
        if(donors.includes(donorBloodGroup)) {
            recipients.push(recipient as BloodGroup)
        }
    }
    return recipients
}
