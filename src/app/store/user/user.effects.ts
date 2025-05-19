import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { toggleUserStatus, toggleUserStatusSuccess, toggleUserStatusFailure } from './user.actions';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private authService: AuthenticationService) {}



  toggleUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleUserStatus),
      exhaustMap(({ userId }) =>
        this.authService.toggleUserStatus(userId).pipe(
          map((res) => toggleUserStatusSuccess({ userId, enabled: res.enabled })),
          catchError(error => of(toggleUserStatusFailure({ error })))
        )
      )
    )
  );
  
}
