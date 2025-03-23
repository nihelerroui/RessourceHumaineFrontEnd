// src/app/store/Authentication/authentication.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as AuthActions from './authentication.actions';
import { AuthenticationService } from '../../core/services/authentication.service';
import { AdminRegisterRequest } from '../../models/admin-register-request.model';  // <-- Import here

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
      switchMap(({ credentials }) => {
        // Create the AdminRegisterRequest object with all required fields
        const registerData: AdminRegisterRequest = {
          email: credentials.email,
          password: credentials.password,
          role: credentials.role,  // Ensure role is provided from credentials
          enabled: credentials.enabled,  // Ensure enabled flag is set (true/false)
          fullName: credentials.fullName,  // Ensure fullName is available
          name: credentials.name,  // Ensure name is provided
          prenom: credentials.prenom,  // Ensure prenom is available
          telephone: credentials.telephone,  // Ensure telephone is available
          typeLibelle: credentials.typeLibelle,  // Ensure typeLibelle is provided
          dateRecrutement: credentials.dateRecrutement,  // Ensure dateRecrutement is available (can be null)
          dateSortie: credentials.dateSortie,  // Ensure dateSortie is available (can be null)
          fonction: credentials.fonction,  // Ensure fonction is available
          matricule: credentials.matricule,  // Ensure matricule is provided
          commercial: credentials.commercial,  // Ensure commercial flag is available
          // Optional fields
          attestations: credentials.attestations,
          bic: credentials.bic,
          bisTer: credentials.bisTer,
          carteGrise: credentials.carteGrise,
          cni: credentials.cni,
          codePostal: credentials.codePostal,
          complementAdr: credentials.complementAdr,
          contart: credentials.contart,
          dateDebCni: credentials.dateDebCni,
          dateFinCni: credentials.dateFinCni,
          iban: credentials.iban,
          kbis: credentials.kbis,
          navigo: credentials.navigo,
          nomRue: credentials.nomRue,
          numRue: credentials.numRue,
          nummss: credentials.nummss,
          photo: credentials.photo,
          rib: credentials.rib,
          urssaf: credentials.urssaf,
          ville: credentials.ville,
        };

        // Call the register method from the AuthenticationService
        return this.authService.register(registerData).pipe(
          map(authResponse => AuthActions.registerSuccess({ authResponse })),
          catchError(error =>
            of(AuthActions.registerFailure({ error: error.message }))
          )
        );
      })
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
