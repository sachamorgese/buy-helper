export const SETTINGS_KEY = "settingsData";
export const SETTINGS_NAME = "settingsName";
export const SETTINGS_ID = "settingsId";
export const SETTINGS_PARTNER_ID = "settingsPartnerId";
export const PARTNER_SETTINGS = "partnerSettings";

export type ListItem = { title: string; checked?: boolean };

export type List = {
  needs: ListItem[];
  wants: ListItem[];
  desires: ListItem[];
};

export type DataKeys = keyof List;

export const RECEIVED_MESSAGE_TYPES = {
  NEW_ID: "new-id",
  ID_FOUND: "id-found",
  PARTNER_SETTINGS: "partner-settings",
  PARTNER_LIST: "partner-list",
} as const;

export const SENT_MESSAGE_TYPES = {
  LIST: "list",
  USERS: "users",
  SETTINGS: "settings",
  NAME: "name",
  PARTNER_ID: "partner-id",
  GET_PARTNER_SETTINGS: "get-partner-settings",
  GET_PARTNER_LIST: "get-partner-list",
} as const;

export type NewId = {
  id: string;
};

export type PartnerList = {
  content: string;
};

export type Message =
  | {
      type: typeof RECEIVED_MESSAGE_TYPES.NEW_ID;
      data: NewId;
    }
  | {
      type: typeof RECEIVED_MESSAGE_TYPES.PARTNER_SETTINGS;
      data: PartnerList;
    }
  | {
      type: typeof RECEIVED_MESSAGE_TYPES.PARTNER_LIST;
      data: PartnerList;
    }
  | {
      type: typeof RECEIVED_MESSAGE_TYPES.ID_FOUND;
      data: NewId;
    };
