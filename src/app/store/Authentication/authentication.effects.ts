import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as AuthActions from './authentication.actions';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class AuthenticationEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthenticationService
  ) {}

  // Effect to perform login
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(authResponse =>
            AuthActions.loginSuccess({
              accessToken: authResponse.accessToken,
              tokenType: authResponse.tokenType
            })
          ),
          catchError(error =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Effect to perform registration
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ credentials }) =>
        this.authService.register(credentials).pipe(
          map(authResponse => AuthActions.registerSuccess({ authResponse })),
          catchError(error =>
            of(AuthActions.registerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Effect to get user details using the authenticated token
  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getUser),
      switchMap(() =>
        this.authService.getUser().pipe(
          map(user => AuthActions.getUserSuccess({ user })),
          catchError(error =>
            of(AuthActions.getUserFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
