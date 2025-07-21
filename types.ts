



import { HarmCategory, HarmBlockThreshold } from "@google/genai";
import * as GameTemplates from './templates'; // Import all templates
import { Operation as JsonPatchOperation } from 'fast-json-patch'; // Import Operation from fast-json-patch
import { VIETNAMESE } from "./constants";

// Re-export necessary types from GameTemplates
export type EquipmentTypeValues = GameTemplates.EquipmentTypeValues;
export type EconomyLocationTypeValues = GameTemplates.EconomyLocationTypeValues;
export type AnyLocationType = GameTemplates.AnyLocationType;
export type ItemCategoryValues = GameTemplates.ItemCategoryValues;
export type ProfessionType = GameTemplates.ProfessionType;
export type CongPhapType = GameTemplates.CongPhapType;
export type SkillTypeValues = GameTemplates.SkillTypeValues;
export type CongPhapGrade = GameTemplates.CongPhapGrade;
export type LinhKiCategory = GameTemplates.LinhKiCategory;
export type LinhKiActivationType = GameTemplates.LinhKiActivationType;
export type ProfessionGrade = GameTemplates.ProfessionGrade;
export type EquipmentRarity = GameTemplates.EquipmentRarity;

// MANUALLY DEFINED TYPES THAT WERE MISSING
export type EquipmentSlotId = 'mainWeapon' | 'offHandWeapon' | 'head' | 'body' | 'hands' | 'legs' | 'artifact' | 'pet' | 'accessory1' | 'accessory2';
export type EquipmentSlotConfig = { id: EquipmentSlotId; labelKey: keyof typeof VIETNAMESE; accepts: EquipmentTypeValues[]; };

export const DIALOGUE_MARKER = '$$';

export const GENRE_VALUES_FOR_TYPE = [
  "Tu Tiên (Mặc định)", "Võ Hiệp", "Tiên Hiệp", "Huyền Huyễn", "Cung Đấu", "Linh Dị", "Khoa Huyễn", "Tây Phương Fantasy", "Ngôn Tình", "Đô Thị", "Mạt Thế", "Võng Du", "Thể Thao", "Kinh Dị", "Khác (Tự định nghĩa)"
] as const;
export type GenreType = typeof GENRE_VALUES_FOR_TYPE[number];
export type CustomGenreType = "Khác (Tự định nghĩa)";

export const TU_CHAT_TIERS = ["Phế Phẩm", "Hạ Đẳng", "Trung Đẳng", "Thượng Đẳng", "Cực Phẩm", "Tiên Phẩm", "Thần Phẩm"] as const;
export type TuChatTier = typeof TU_CHAT_TIERS[number];

export const PROFICIENCY_TIERS = ["Sơ Nhập", "Tiểu Thành", "Đại Thành", "Viên Mãn", "Xuất Thần Nhập Hóa"] as const;
export type ProficiencyTier = typeof PROFICIENCY_TIERS[number];

// For Dynamic NPC System
export type NPCAlignment = 'Lợi Kỷ' | 'Vị Tha' | 'Hỗn Loản' | 'Nguyên Tắc' | 'Trung Lập';
export type NPCRelationshipType = 'Bạn Bè' | 'Kẻ Thù' | 'Đối Thủ' | 'Tình Yêu' | 'Gia Đình' | 'Người Quen' | 'Chủ Nhân' | 'Nô Lệ';
export interface NPCRelationship {
  type: NPCRelationshipType;
  intensity: number; // -100 to 100
}
export interface NPCDynamicState {
  alignment: NPCAlignment;
  relationships: Record<string, NPCRelationship>; // Key is NPC ID
  needs: {
    'Dục Vọng': number;
    'Tham Vọng': number;
    'An Toàn': number;
    'Giải Trí': number;
  };
  currentGoal: string;
  secret: string;
  currentLocationId: string;
  mood: 'Vui Vẻ' | 'Hài Lòng' | 'Bình Thường' | 'Bực Bội' | 'Giận Dữ' | 'Nghi Ngờ';
}

// Action types for AI response in world tick
export type NPCActionType = 'INTERNAL_STATE_UPDATE' | 'TRAVEL' | 'INTERACT_NPC' | 'QUEST_OFFER' | 'SEND_MESSAGE';
export interface NPCAction {
    actorId: string;
    type: NPCActionType;
    payload: any; // e.g., { mood: 'Giận Dữ' } or { targetLocationId: 'loc-id' } or { recipient: 'player', subject: '...', content: '...' }
    reason: string;
    outcomeDescription: string;
}

export enum GameScreen {
  Initial = 'Initial', GameSetup = 'GameSetup', Gameplay = 'Gameplay', Combat = 'Combat', ApiSettings = 'ApiSettings',
  LoadGameSelection = 'LoadGameSelection', StorageSettings = 'StorageSettings', ImportExport = 'ImportExport', Equipment = 'Equipment', 
  Map = 'Map', Auction = 'Auction', Cultivation = 'Cultivation',
  CompanionManagement = 'CompanionManagement',
  PrisonerManagement = 'PrisonerManagement',
  CompanionEquipment = 'CompanionEquipment',
  SlaveAuction = 'SlaveAuction',
  Rules = 'Rules',
  SpiritCauldron = 'SpiritCauldron',
  EventHub = 'EventHub', // NEW
}

export type StorageType = 'local';

export interface StorageSettings {
  storageType: StorageType;
}

export type StatusEffectType = 'buff' | 'debuff' | 'neutral';

export interface StatusEffect {
  id: string; name: string; description: string; type: StatusEffectType; durationTurns: number;
  statModifiers: Partial<Record<keyof Omit<PlayerStats, 'realm' | 'currency' | 'isInCombat' | 'turn' | 'hieuUngBinhCanh' | 'activeStatusEffects' | 'sinhLuc' | 'linhLuc' | 'kinhNghiem' | 'baseMaxKinhNghiem' | 'baseMaxLinhLuc' | 'baseMaxSinhLuc' | 'baseSucTanCong' | 'spiritualRoot' | 'specialPhysique' | 'professions' | 'tuChat' | 'playerSpecialStatus'>, string | number>>;
  specialEffects: string[]; icon?: string; source?: string;
}

export interface Profession {
  type: ProfessionType;
  level: number;
  exp: number;
  maxExp: number;
}

export interface PlayerSpecialStatus {
    type: 'prisoner' | 'slave';
    ownerName: string;
    willpower: number; // Mental fortitude
    resistance: number; // Hostility
    obedience: number; // Willingness to obey
    fear?: number; // Fear towards the owner
    trust?: number; // Trust in the owner;
}

export interface PlayerStats {
  baseMaxSinhLuc: number; baseMaxLinhLuc: number; baseSucTanCong: number; baseMaxKinhNghiem: number;
  sinhLuc: number; maxSinhLuc: number; linhLuc: number; maxLinhLuc: number; sucTanCong: number; kinhNghiem: number; maxKinhNghiem: number;
  realm: string; currency: number; isInCombat: boolean; turn: number; hieuUngBinhCanh: boolean;
  activeStatusEffects: StatusEffect[];
  spiritualRoot: string;
  specialPhysique: string;
  tuChat?: TuChatTier;
  professions: Profession[];
  thoNguyen: number;
  maxThoNguyen: number;
  playerSpecialStatus?: PlayerSpecialStatus | null;
}

export type Item = GameTemplates.InventoryItem;
export type Skill = GameTemplates.SkillTemplate;
export type NPC = GameTemplates.NPCTemplate;
export type YeuThu = GameTemplates.YeuThuTemplate;
export type Faction = GameTemplates.FactionTemplate;

export interface PersonBase {
  id: string;
  name: string;
  title?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác' | 'Không rõ';
  race?: string;
  description: string;
  affinity: number;
  avatarUrl?: string;
  realm?: string;
  tuChat?: TuChatTier;
  spiritualRoot?: string;
  specialPhysique?: string;
  stats?: Partial<PlayerStats>;
  dynamicState?: NPCDynamicState;
}

export interface ComplexCompanionBase extends PersonBase {
  entityType: 'wife' | 'slave';
  willpower: number;
  obedience: number;
  skills: Skill[];
  equippedItems: Record<EquipmentSlotId, Item['id'] | null>;
  isBinhCanh?: boolean;
  binhCanhCounter?: number;
  lastCultivationTurn?: number;
}

export type Wife = ComplexCompanionBase & { entityType: 'wife' };
export type Slave = ComplexCompanionBase & { 
  entityType: 'slave';
  value?: number;
};

export type Prisoner = PersonBase & {
  entityType: 'prisoner';
  willpower: number;
  resistance: number;
  obedience: number;
};

export interface Master extends PersonBase {
  mood: NPCDynamicState['mood'];
  needs: Partial<NPCDynamicState['needs']>;
  currentGoal: string;
  favor: number; // 0-100
};

export interface QuestObjective {
  id: string; text: string; completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  objectives: QuestObjective[];
}

export interface GameLocation extends GameTemplates.LocationTemplate {
    ownerFactionId?: string;
    fortificationLevel?: number; // 0-100
    resourcesGenerated?: Array<{ resource: string, amount: number }>;
    connections?: LocationConnection[];
}

export interface Region {
  id: string;
  name: string;
  description: string;
}

export interface WorldLoreEntry {
    id: string;
    title: string;
    content: string;
}

export interface Companion {
    id: string;
    name: string;
    description: string;
    hp: number;
    maxHp: number;
    atk: number;
    mana?: number;
    maxMana?: number;
    skills?: string[]; // IDs of skills
}

export type MessageType = 'narration' | 'player_action' | 'system' | 'error' | 'page_summary' | 'event_summary' | 'bulletin';
export interface GameMessage {
    id: string;
    type: MessageType;
    content: string;
    timestamp: number;
    choices?: AiChoice[];
    isPlayerInput?: boolean;
    turnNumber: number;
}

export interface ParsedAiResponse {
    narration: string;
    choices: AiChoice[];
    tags: string[];
    systemMessage?: string;
}

export interface AiChoice {
    text: string;
}

export interface WorldDate {
  day: number;
  month: number;
  year: number;
}

export interface Mail {
  id: string;
  senderId: string;
  senderName: string;
  subject: string;
  content: string;
  turnReceived: number;
  isRead: boolean;
  relatedQuestId?: string;
}

export interface KnowledgeBase {
    playerStats: PlayerStats;
    inventory: Item[];
    equippedItems: Record<EquipmentSlotId, Item['id'] | null>;
    playerSkills: Skill[];
    allQuests: Quest[];
    discoveredNPCs: NPC[];
    discoveredYeuThu: YeuThu[];
    discoveredLocations: GameLocation[];
    discoveredFactions: Faction[];
    realmProgressionList: string[];
    currentRealmBaseStats: Record<string, RealmBaseStatDefinition>;
    worldConfig: WorldSettings | null;
    companions: Companion[];
    worldLore: WorldLoreEntry[];
    worldDate: WorldDate;
    pageSummaries: Record<number, string>;
    currentPageHistory: number[];
    lastSummarizedTurn: number;
    turnHistory: TurnHistoryEntry[];
    autoSaveTurnCounter: number;
    currentAutoSaveSlotIndex: number;
    autoSaveSlotIds: (string | null)[];
    manualSaveId: string | null;
    manualSaveName: string | null;
    playerAvatarData?: string;
    discoveredRegions: Region[];
    currentLocationId?: string;
    auctionState: AuctionState | null;
    slaveAuctionState: SlaveAuctionState | null;
    pendingCombat: { opponentIds: string[]; surrenderedNpcIds: string[] } | null;
    postCombatState: CombatEndPayload | null;
    userRules: UserRule[];
    prisoners: Prisoner[];
    wives: Wife[];
    slaves: Slave[];
    master: Master | null;
    ragVectorStore?: VectorStore;
    worldEvents: WorldEvent[];
    worldBulletin: BulletinEntry[];
    playerMailbox: Mail[]; // NEW: Mailbox for proactive NPC communication
}

export interface StartingSkill {
    name: string;
    description: string;
    skillType?: SkillTypeValues;
    baseDamage?: number;
    baseHealing?: number;
    damageMultiplier?: number;
    healingMultiplier?: number;
    manaCost?: number;
    cooldown?: number;
    specialEffects?: string;
    congPhapDetails?: { type?: CongPhapType; grade?: CongPhapGrade; weaponFocus?: string; };
    linhKiDetails?: { category?: LinhKiCategory; activation?: LinhKiActivationType; };
    professionDetails?: { type?: ProfessionType; grade?: ProfessionGrade; skillDescription?: string; };
    camThuatDetails?: { sideEffects?: string; };
    thanThongDetails?: {};
}
export interface StartingItem {
    name: string;
    description: string;
    quantity: number;
    category: ItemCategoryValues;
    rarity: EquipmentRarity;
    value: number;
    itemRealm?: string;
    aiPreliminaryType?: string;
    equipmentDetails?: Partial<{ type: EquipmentTypeValues; slot: string; uniqueEffectsString: string; statBonusesString: string; statBonuses: Partial<Pick<PlayerStats, 'sucTanCong' | 'maxSinhLuc' | 'maxLinhLuc'>>; uniqueEffects: string[]; }>;
    potionDetails?: Partial<{ type: GameTemplates.PotionTypeValues; effectsString: string; effects: string[]; durationTurns: number; cooldownTurns: number }>;
    materialDetails?: Partial<{ type: GameTemplates.MaterialTypeValues }>;
    questItemDetails?: Partial<{ questIdAssociated: string }>;
    miscDetails?: Partial<{ usable: boolean; consumable: boolean }>;
    congPhapDetails?: Partial<{ congPhapType: GameTemplates.CongPhapType, expBonusPercentage: number }>;
    linhKiDetails?: Partial<{ skillToLearnJSON: string }>;
    professionSkillBookDetails?: Partial<{ professionToLearn: ProfessionType }>;
    professionToolDetails?: Partial<{ professionRequired: ProfessionType }>;
}

export interface StartingNPC {
    name: string;
    personality: string;
    initialAffinity: number;
    details: string;
    gender: 'Nam' | 'Nữ' | 'Khác' | 'Không rõ';
    race: string;
    realm?: string;
    avatarUrl?: string;
    tuChat?: TuChatTier;
    relationshipToPlayer?: string;
    spiritualRoot?: string;
    specialPhysique?: string;
    thoNguyen?: number;
    maxThoNguyen?: number;
    dynamicAlignment?: NPCDynamicState['alignment'];
    dynamicMood?: NPCDynamicState['mood'];
    dynamicGoal?: string;
    dynamicSecret?: string;
}

export interface StartingYeuThu {
    name: string;
    species: string;
    description: string;
    realm?: string;
    isHostile: boolean;
}

export interface StartingLore {
    title: string;
    content: string;
}

export interface StartingLocation {
    name: string;
    description: string;
    isSafeZone: boolean;
    regionId?: string;
    mapX?: number;
    mapY?: number;
    locationType: GameTemplates.LocationTypeValues;
}

export interface StartingFaction {
    name: string;
    description: string;
    alignment: GameTemplates.FactionAlignmentValues;
    initialPlayerReputation: number;
}

export interface NsfwDescriptionStyleMap {
    'Hoa Mỹ': string; 'Trần Tục': string; 'Gợi Cảm': string; 'Mạnh Bạo (BDSM)': string;
}
export type NsfwDescriptionStyle = keyof NsfwDescriptionStyleMap;
export type ViolenceLevel = 'Nhẹ Nhàng' | 'Thực Tế' | 'Cực Đoan';
export type StoryTone = 'Tích Cực' | 'Trung Tính' | 'Đen Tối' | 'Dâm Dục' | 'Hoang Dâm' | 'Dâm Loạn';

export interface RaceCultivationSystem {
  id: string;
  raceName: string;
  realmSystem: string;
}

export interface StartingEvent {
    name: string;
    eventType: WorldEvent['eventType'];
    description: string;
    locationKeyword: string;
    delayDays: number;
    durationDays: number;
}

export interface WorldSettings {
    saveGameName: string;
    theme: string;
    settingDescription: string;
    writingStyle: string;
    difficulty: 'Dễ' | 'Thường' | 'Khó' | 'Ác Mộng';
    deathConsequence: 'capture' | 'reincarnation';
    currencyName: string;
    playerName: string;
    playerGender: 'Nam' | 'Nữ' | 'Khác';
    playerRace: string;
    playerPersonality: string;
    playerBackstory: string;
    playerGoal: string;
    playerStartingTraits: string;
    playerSpiritualRoot: string;
    playerSpecialPhysique: string;
    playerThoNguyen?: number;
    playerMaxThoNguyen?: number;
    startingCurrency?: number;
    startingSkills: StartingSkill[];
    startingItems: StartingItem[];
    startingNPCs: StartingNPC[];
    startingYeuThu: StartingYeuThu[];
    startingLore: StartingLore[];
    startingLocations: StartingLocation[];
    startingFactions: StartingFaction[];
    startingEvents: StartingEvent[];
    nsfwMode?: boolean;
    nsfwDescriptionStyle?: NsfwDescriptionStyle;
    violenceLevel?: ViolenceLevel;
    storyTone?: StoryTone;
    originalStorySummary?: string;
    genre: GenreType;
    customGenreName?: string;
    isCultivationEnabled: boolean;
    raceCultivationSystems: RaceCultivationSystem[];
    yeuThuRealmSystem: string;
    canhGioiKhoiDau: string;
    startingDate: WorldDate;
    playerAvatarUrl?: string;
}

export interface GeneratedWorldElements {
    startingSkills: StartingSkill[];
    startingItems: StartingItem[];
    startingNPCs: StartingNPC[];
    startingLore: StartingLore[];
    startingYeuThu: StartingYeuThu[];
    startingLocations: StartingLocation[];
    startingFactions: StartingFaction[];
    startingEvents: StartingEvent[];
    raceCultivationSystems: RaceCultivationSystem[];
    yeuThuRealmSystem: string;
    genre: GenreType;
    isCultivationEnabled: boolean;
    nsfwDescriptionStyle: NsfwDescriptionStyle;
    violenceLevel: ViolenceLevel;
    storyTone: StoryTone;
    worldTheme?: string;
    worldSettingDescription?: string;
    worldWritingStyle?: string;
    currencyName?: string;
    playerName?: string;
    playerGender?: 'Nam' | 'Nữ' | 'Khác';
    playerRace?: string;
    playerPersonality?: string;
    playerBackstory?: string;
    playerGoal?: string;
    playerStartingTraits?: string;
    playerAvatarUrl?: string;
    originalStorySummary?: string;
    canhGioiKhoiDau?: string;
    customGenreName?: string;
    startingDate?: WorldDate;
    playerSpiritualRoot?: string;
    playerSpecialPhysique?: string;
    playerThoNguyen?: number;
    playerMaxThoNguyen?: number;
    startingCurrency?: number;
}

export type PlayerActionInputType = 'action' | 'story';
export type ResponseLength = 'default' | 'short' | 'medium' | 'long';
export type SafetySetting = { category: HarmCategory; threshold: HarmBlockThreshold; };
export type AvatarGenerationEngine = 'imagen-3.0' | 'gemini-2.0-flash';

export interface ApiConfig {
    apiKeySource: 'system' | 'user';
    userApiKeys: string[];
    model: string;
    economyModel: string;
    safetySettings: SafetySetting[];
    autoGenerateNpcAvatars: boolean;
    avatarGenerationEngine: AvatarGenerationEngine;
    ragTopK: number;
}
export interface SaveGameMeta {
    id: string;
    name: string;
    timestamp: Date;
    size?: number;
}
export interface SaveGameData {
    id?: string | number;
    name: string;
    timestamp: Date | string;
    knowledgeBase: KnowledgeBase;
    gameMessages: GameMessage[];
    appVersion: string;
    userId?: string;
}
export interface RealmBaseStatDefinition {
    hpBase: number; hpInc: number; mpBase: number; mpInc: number; atkBase: number; atkInc: number; expBase: number; expInc: number;
}
export interface TurnHistoryEntry {
    turnNumber: number;
    type: 'keyframe' | 'delta';
    knowledgeBaseSnapshot: KnowledgeBase;
    gameMessagesSnapshot: GameMessage[];
    knowledgeBaseDelta?: JsonPatchOperation[];
    gameMessagesDelta?: JsonPatchOperation[];
}
export interface StyleSettingProperty {
    fontFamily?: string; fontSize?: string; textColor?: string; backgroundColor?: string;
}
export interface StyleSettings {
    narration: StyleSettingProperty;
    playerAction: StyleSettingProperty;
    choiceButton: StyleSettingProperty;
    keywordHighlight: StyleSettingProperty;
    dialogueHighlight: StyleSettingProperty;
}
export interface AvatarUploadHandlers {
    onUpdatePlayerAvatar: (newAvatarUrl: string) => void;
    onUpdateNpcAvatar: (npcId: string, newAvatarUrl: string) => void;
}
export interface LocationConnection {
    targetLocationId: string;
    isDiscovered: boolean;
    travelTimeTurns?: number;
    description?: string;
}
export type SearchMethod = "Hỏi Thăm Dân Địa Phương" | "Tra Cứu Cổ Tịch / Bản Đồ Cũ" | "Dùng Thần Thức / Linh Cảm" | "Đi Lang Thang Vô Định";
export const SEARCH_METHODS: SearchMethod[] = ["Hỏi Thăm Dân Địa Phương", "Tra Cứu Cổ Tịch / Bản Đồ Cũ", "Dùng Thần Thức / Linh Cảm", "Đi Lang Thang Vô Định"];
export interface FindLocationParams {
    locationTypes: GameTemplates.LocationTypeValues[];
    isSafeZone: boolean | null;
    keywords: string;
    searchMethod: SearchMethod;
}
export type CombatDisposition = 'kill' | 'capture' | 'release';
export type CombatDispositionMap = Record<string, CombatDisposition>; // Key is NPC ID
export interface CombatEndPayload {
    outcome: 'victory' | 'defeat' | 'escaped' | 'surrendered';
    summary: string;
    finalPlayerState: PlayerStats;
    dispositions: CombatDispositionMap;
    opponentIds: string[];
}
export interface AuctionCommentaryEntry { id: string; text: string; timestamp: number; }
export interface AuctionNPC { id: string; name: string; realm: string; currency: number; }
export type AuctionItem = Item & {
    ownerId?: 'player' | 'system' | string;
    startingPrice: number;
    currentBid: number;
    buyoutPrice: number;
    highestBidderId?: string; // Player or NPC id
};
export interface AuctionState {
    isOpen: boolean;
    items: AuctionItem[];
    auctionNPCs: AuctionNPC[];
    currentItemIndex: number;
    auctioneerCommentary: AuctionCommentaryEntry[];
    lastBidTime: number;
    auctioneerCallCount: number;
    locationId: string;
}
export type AuctionSlave = Slave & {
    ownerId?: 'player' | 'system' | string; // NPC id
    startingPrice: number;
    currentBid: number;
    buyoutPrice: number;
    highestBidderId?: string; // Player or NPC id
};
export interface SlaveAuctionState {
    isOpen: boolean;
    items: AuctionSlave[];
    auctionNPCs: AuctionNPC[];
    currentItemIndex: number;
    auctioneerCommentary: AuctionCommentaryEntry[];
    lastBidTime: number;
    auctioneerCallCount: number;
    locationId: string;
}
export interface UserRule { id: string; text: string; isActive: boolean; }
export interface ClassifiedRule {
    classification: 'WORLD_BUILDING' | 'BEHAVIOR_MODIFICATION' | 'UNKNOWN';
    payload: string;
}
export interface VectorMetadata {
    entityId: string;
    entityType: 'item' | 'skill' | 'quest' | 'npc' | 'location' | 'lore' | 'faction' | 'yeuThu' | 'wife' | 'slave' | 'prisoner' | 'master';
    text: string;
}
export interface VectorStore {
    vectors: number[][];
    metadata: VectorMetadata[];
}
export interface WorldEvent {
    id: string;
    name: string;
    eventType: 'Cơ hội' | 'Thách thức' | 'Xung đột' | 'Bí ẩn';
    currentPhase: 'Pending' | 'Active' | 'Cooldown' | 'Finished';
    phaseDescription: string;
    locationId?: string;
    factionsInvolved?: string[];
    startDate: WorldDate;
    endDate: WorldDate;
    relatedEntities?: string[]; // IDs of items, NPCs, etc.
}
export interface BulletinEntry {
    id: string;
    turn: number;
    category: 'Chính Trị' | 'Kinh Tế' | 'Tu Luyện' | 'Bí Cảnh' | 'Tin Đồn';
    headline: string;
    content: string;
    isRead: boolean;
}

export type EventScale = 'Cá Nhân' | 'Khu Vực' | 'Toàn Cõi'; // NEW
export interface PlayerCreatedEvent { // NEW
    name: string;
    eventType: WorldEvent['eventType'];
    description: string;
    scale: EventScale;
}