import { createAction, props } from '@ngrx/store';
import { Societe } from 'src/app/models/societe.model';


export const loadSocietesByAdmin = createAction(
    '[AdminSociete] Load Societes By Admin',
    props<{ adminId: number }>()
  );
  
  export const loadSocietesByAdminSuccess = createAction(
    '[AdminSociete] Load Societes By Admin Success',
    props<{ societes: Societe[] }>()
  );
  
  export const loadSocietesByAdminFailure = createAction(
    '[AdminSociete] Load Societes By Admin Failure',
    props<{ error: any }>()
  );
