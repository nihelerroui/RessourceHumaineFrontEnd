import { GrantedAuthority } from "./garanted-authority.model";

export interface UserDetails {
  getAuthorities(): GrantedAuthority[];
  getUsername(): string;
  isAccountNonExpired(): boolean;
  isAccountNonLocked(): boolean;
  isCredentialsNonExpired(): boolean;
  isEnabled(): boolean;
}