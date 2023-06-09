export interface SocialAccount {
  platform: string;
  handle?: string;
  access_token: string;
  last_login_at?: string;
  creation_time?: string;
  refresh_token?: string;
  scopes?: string[];
  hasError?: boolean;
}
