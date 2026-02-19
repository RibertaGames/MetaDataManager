// { fieldKey: { langCode: "value" } }
export type MetadataFields = Record<string, Record<string, string>>;

export interface MetadataResponse {
  fields: MetadataFields;
}

export interface MetadataSaveRequest {
  projectId: string;
  fields: MetadataFields;
}

export interface TranslateRequest {
  text: string;
  sourceLang: string;
  targetLangs: string[];
}

export interface TranslateResponse {
  translations: Record<string, string>; // deeplLang -> translatedText
}
