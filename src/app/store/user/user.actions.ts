import { createAction, props } from '@ngrx/store';
import { User } from '../../models/auth.models';

export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());


  export const toggleUserStatus = createAction(
    '[User] Toggle Status',
    props<{ userId: number }>()
  );
  
  export const toggleUserStatusSuccess = createAction(
    '[User] Toggle Status Success',
    props<{ userId: number; enabled: boolean }>()
  );
  
  export const toggleUserStatusFailure = createAction(
    '[User] Toggle Status Failure',
    props<{ error: any }>()
  );
  
