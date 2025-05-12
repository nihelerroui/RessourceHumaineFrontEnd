import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, tap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthenticationService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, registerUser, registerUserSuccess, registerUserFailure, updateUser, updateUserSuccess, updateUserFailure } from './authentication.actions';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import Swal from 'sweetalert2';
import { loadUsers } from '../user/user.actions';

@Injectable()
export class AuthenticationEffects {

  constructor(
    private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private tokenStorage: TokenStorageService, 
    private router: Router
  ) {}

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      exhaustMap(({ request }) =>
        this.AuthenticationService.register(request).pipe(
          tap(() => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Utilisateur créé avec succès',
              confirmButtonText: 'OK'
            });
          }),
          mergeMap(() => [
            registerUserSuccess(),
            loadUsers() // Charger les utilisateurs après enregistrement
          ]),
          catchError(error => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: error?.message || 'Erreur lors de l’inscription',
              confirmButtonText: 'Fermer'
            });
            return of(registerUserFailure({ error: error?.message || 'Erreur lors de l’inscription' }));
          })
        )
      )
    )
  );
  
  
  
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      exhaustMap(({ userId, request }) =>
        this.AuthenticationService.modifyUser(userId, request).pipe(
          map(response => updateUserSuccess({ response })),
          catchError(error => of(updateUserFailure({ error: error?.error || 'Erreur lors de la mise à jour' })))
        )
      )
    )
  );
  
  

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) =>
        this.AuthenticationService.login({ email, password }).pipe(
          tap(response => {
            const token = response.accessToken;
            this.tokenStorage.saveToken(token);
            this.tokenStorage.saveUser({ email });
  
            const returnUrl = sessionStorage.getItem('returnUrl') || '/';
            this.router.navigateByUrl(returnUrl);
            sessionStorage.removeItem('returnUrl');
          }),
          map(response => loginSuccess({ user: { email } })), 
          catchError(error =>
            of(loginFailure({ error: error.message || 'Erreur lors de la connexion' }))
          )
        )
      )
    )
  );
  
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );



}