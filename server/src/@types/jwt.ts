export {};

export enum JwtType {
  Access = "access",
  Refresh = "refresh",
}

export type jwtPayload = {
  sub: string;
  jti: string;
  type: JwtType;
};
