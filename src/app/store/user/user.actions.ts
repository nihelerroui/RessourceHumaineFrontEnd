import { createAction, props } from '@ngrx/store';
import { User } from '../../models/auth.models';



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
  
