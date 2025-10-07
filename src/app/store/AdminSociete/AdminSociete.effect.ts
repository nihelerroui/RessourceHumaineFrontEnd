// src/app/state/admin-societe.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as AdminSocieteActions from './AdminSociete.actions';
import { AdminSocieteService } from 'src/app/admin-societe.service';

@Injectable()
export class AdminSocieteEffects {
    constructor(
        private actions$: Actions,
        private adminSocieteService: AdminSocieteService
      ) {}

  loadSocietesByAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminSocieteActions.loadSocietesByAdmin),
      mergeMap(action =>
        this.adminSocieteService.getSocieteByAdmin(action.adminId).pipe(
          map(societes => AdminSocieteActions.loadSocietesByAdminSuccess({ societes })),
          catchError(error => of(AdminSocieteActions.loadSocietesByAdminFailure({ error })))
        )
      )
    )
  );


}