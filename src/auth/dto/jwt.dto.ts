export interface JwtDto {
  userId: string;
  sub: string;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}
