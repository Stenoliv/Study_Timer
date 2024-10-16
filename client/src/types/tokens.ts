export type TokensType = {
  access: string | null;
  refresh: string | null;
};

export enum JwtType {
  Access = "access",
  Refresh = "refresh",
}
