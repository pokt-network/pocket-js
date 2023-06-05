export const FEATURE_UPGRADE_ONLY_HEIGHT = 1
export const FEATURE_UPGRADE_KEY = 'FEATURE'

// This is not really used, just filling in for an empty value since proto was not optional
export const OLD_UPGRADE_HEIGHT_EMPTY_VALUE = 0

export enum GovParameter {
  APPLICATION_ApplicationStakeMinimum = 'application/ApplicationStakeMinimum',
  APPLICATION_AppUnstakingTime = 'application/AppUnstakingTime',
  APPLICATION_BaseRelaysPerPOKT = 'application/BaseRelaysPerPOKT',
  APPLICATION_MaxApplications = 'application/MaxApplications',
  APPLICATION_MaximumChains = 'application/MaximumChains',
  APPLICATION_ParticipationRateOn = 'application/ParticipationRateOn',
  APPLICATION_StabilityAdjustment = 'application/StabilityAdjustment',
  AUTH_MaxMemoCharacters = 'auth/MaxMemoCharacters',
  AUTH_TxSigLimit = 'auth/TxSigLimit',
  GOV_Acl = 'gov/acl',
  GOV_DaoOwner = 'gov/daoOwner',
  GOV_Upgrade = 'gov/upgrade',
  POCKETCORE_ClaimExpiration = 'pocketcore/ClaimExpiration',
  AUTH_FeeMultipliers = 'auth/FeeMultipliers',
  POCKETCORE_ReplayAttackBurnMultiplier = 'pocketcore/ReplayAttackBurnMultiplier',
  POS_ProposerPercentage = 'pos/ProposerPercentage',
  POCKETCORE_ClaimSubmissionWindow = 'pocketcore/ClaimSubmissionWindow',
  POCKETCORE_MinimumNumberOfProofs = 'pocketcore/MinimumNumberOfProofs',
  POCKETCORE_SessionNodeCount = 'pocketcore/SessionNodeCount',
  POCKETCORE_SupportedBlockchains = 'pocketcore/SupportedBlockchains',
  POS_BlocksPerSession = 'pos/BlocksPerSession',
  POS_DAOAllocation = 'pos/DAOAllocation',
  POS_DowntimeJailDuration = 'pos/DowntimeJailDuration',
  POS_MaxEvidenceAge = 'pos/MaxEvidenceAge',
  POS_MaximumChains = 'pos/MaximumChains',
  POS_MaxJailedBlocks = 'pos/MaxJailedBlocks',
  POS_MaxValidators = 'pos/MaxValidators',
  POS_MinSignedPerWindow = 'pos/MinSignedPerWindow',
  POS_RelaysToTokensMultiplier = 'pos/RelaysToTokensMultiplier',
  POS_SignedBlocksWindow = 'pos/SignedBlocksWindow',
  POS_SlashFractionDoubleSign = 'pos/SlashFractionDoubleSign',
  POS_SlashFractionDowntime = 'pos/SlashFractionDowntime',
  POS_StakeDenom = 'pos/StakeDenom',
  POS_StakeMinimum = 'pos/StakeMinimum',
  POS_UnstakingTime = 'pos/UnstakingTime',
  POS_ServicerStakeWeightMultiplier = 'pos/ServicerStakeWeightMultiplier'
}

export enum DAOAction {
  Transfer = 'dao_transfer',
  Burn = 'dao_burn',
}
