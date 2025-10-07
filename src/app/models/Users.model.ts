import { UserDetails } from "./UserDetails.model";
import { GrantedAuthority } from "./garanted-authority.model";


export class Users implements UserDetails {
  usersId: number;
  mail: string;
  password: string;
  roles: string;
  enabled: boolean;
  token: string | null;
  tokenCreationDate: string | null;

  constructor(init?: Partial<Users>) {
    Object.assign(this, init);
  }

  getId(): number {
    return this.usersId;
  }

  getOwner(): number {
    return this.usersId;
  }

  getAuthorities(): GrantedAuthority[] {
    const authorities: GrantedAuthority[] = [];
    if (this.roles.indexOf(",") > 0) {
      this.roles.split(",").forEach((role) => {
        authorities.push({ authority: role });
      });
    } else if (this.roles.length > 0) {
      authorities.push({ authority: this.roles });
    }
    return authorities;
  }

  getUsername(): string {
    return this.mail;
  }

  isAccountNonExpired(): boolean {
    return true;
  }

  isAccountNonLocked(): boolean {
    return true;
  }

  isCredentialsNonExpired(): boolean {
    return true;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}