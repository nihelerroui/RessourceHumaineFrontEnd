import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  map,
  catchError,
  exhaustMap,
  tap,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { of } from "rxjs";
import { AuthenticationService } from "../../core/services/auth.service";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import * as SocieteActions from "src/app/store/societe/societe.actions";
import { Router } from "@angular/router";
import { TokenStorageService } from "src/app/core/services/token-storage.service";
import { Consultant } from "src/app/models/consultant.models";
import { selectSocieteList } from "../societe/societe.selectors";
import { Store } from "@ngrx/store";
import * as ConsultantActions from "../consultant/consultant.actions";
import {LoginRequest } from "src/app/models/loginRequest.model";
import { ConsultantService } from "src/app/core/services/consultant.service";

@Injectable()
export class AuthenticationEffects {
  constructor(
    private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private store: Store,
    private consultantService:ConsultantService
  ) {}

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.createUser),
      mergeMap(({ request }) =>
        this.AuthenticationService.createUser(request).pipe(
          map((user) => AuthActions.createUserSuccess({ user })),
          catchError((error) => of(AuthActions.createUserFailure({ error })))
        )
      )
    )
  );

  createConsultant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.createConsultant),
      mergeMap(({ request }) =>
        this.AuthenticationService.createConsultant(request).pipe(
          map((consultant) =>
            AuthActions.createConsultantSuccess({ consultant })
          ),
          catchError((error) =>
            of(AuthActions.createConsultantFailure({ error }))
          )
        )
      )
    )
  );

  createPersonalDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.createPersonalDetails),
      mergeMap(({ request }) =>
        this.AuthenticationService.createPersonalDetails(request).pipe(
          map((personalDetails) =>
            AuthActions.createPersonalDetailsSuccess({ personalDetails })
          ),
          catchError((error) =>
            of(AuthActions.createPersonalDetailsFailure({ error }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      switchMap(({ userId, request }) =>
        this.AuthenticationService.updateUser(userId, request).pipe(
          map((user) => AuthActions.updateUserSuccess({ user })),
          catchError((error) => of(AuthActions.updateUserFailure({ error })))
        )
      )
    )
  );

  updateConsultant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateConsultant),
      switchMap(({ consultantId, request }) =>
        this.AuthenticationService.updateConsultant(consultantId, request).pipe(
          map((consultant) =>
            AuthActions.updateConsultantSuccess({ consultant })
          ),
          catchError((error) =>
            of(AuthActions.updateConsultantFailure({ error }))
          )
        )
      )
    )
  );


  loadConsultants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadConsultants),
      switchMap(() =>
        this.AuthenticationService.loadConsultants().pipe(
          map((consultants: Consultant[]) =>
            AuthActions.loadConsultantsSuccess({ consultants })
          ),
          catchError((error) =>
            of(AuthActions.loadConsultantsFailure({ error }))
          )
        )
      )
    )
  );


 
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) => {
        const signinRequest = new LoginRequest({
          email,
          password,
        });
        return this.AuthenticationService.signin(signinRequest).pipe(
          map((user) => {
            if (user) {
              localStorage.setItem("currentUser", JSON.stringify(user));
              localStorage.setItem("token", user.token);
            }

            return AuthActions.loginSuccess({ user, email });
          }),
          catchError(
            (error) => of(AuthActions.loginFailure({ error })) // Closing parenthesis added here
          )
        );
      })
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap((action) => console.log("test", JSON.stringify(action))),
      switchMap((action) => [
        ConsultantActions.loadConsultantByMail({ email: action.email }),
      ])
    )
  );
  loadConsultantByMail$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ConsultantActions.loadConsultantByMail),
    mergeMap((action) =>
      this.consultantService.getConsultantByMail(action.email).pipe(
        map((consultant) =>
          ConsultantActions.loadConsultantByMailSuccess({ consultant })
        ),
        catchError((error) =>
          of(ConsultantActions.loadConsultantByMailFailure({ error }))
        )
      )
    )
  )
);
redirectAfterLoadConsultant$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(ConsultantActions.loadConsultantByMailSuccess),
      tap(() => 
      {const returnUrl = sessionStorage.getItem("returnUrl") || "/";
      this.router.navigateByUrl(returnUrl);
      sessionStorage.removeItem("returnUrl");}
      
      )
    ),
  { dispatch: false }
);
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {}),
      exhaustMap(() => of(AuthActions.logoutSuccess()))
    )
  );

  loadAdminSocietes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAdminSocietes),
      switchMap(() =>
        this.AuthenticationService.getAdminSocietes().pipe(
          map((societes) => AuthActions.loadAdminSocietesSuccess({ societes })),
          catchError((error) =>
            of(AuthActions.loadAdminSocietesFailure({ error }))
          )
        )
      )
    )
  );

addMissingAdminSocietes$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.loadAdminSocietesSuccess),
    withLatestFrom(this.store.select(selectSocieteList)),
    mergeMap(([action, existingSocietes]) => {
      const existingNames = new Set(
        existingSocietes.map(s => s.nom.trim().toLowerCase())
      );

      const newSocietes = action.societes.filter(apiSociete =>
        !existingNames.has(apiSociete.name.trim().toLowerCase())
      );

      return newSocietes.map(apiSociete =>
        SocieteActions.addSociete({
          societe: {
            societeId: apiSociete.societeId,
            nom: apiSociete.name,
            adresse: apiSociete.adresse || '',
            contact: apiSociete.contact || '',
            email: apiSociete.email || '',
            numSiret: apiSociete.numSiret || '',
            numTva: apiSociete.numTva || '',
            telephone: apiSociete.telephone || '',
            responsable: apiSociete.contact || ''
          }
        })
      );
    })
  )
);



  updatePersonalDetailsWithFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updatePersonalDetailsWithFiles),
      exhaustMap(({ personalDetailsId, dto, files }) =>
        this.AuthenticationService.updatePersonalDetailsWithFiles(
          personalDetailsId,
          dto,
          files
        ).pipe(
          map((personalDetails) =>
            AuthActions.updatePersonalDetailsWithFilesSuccess({
              personalDetails,
            })
          ),
          catchError((error) =>
            of(AuthActions.updatePersonalDetailsWithFilesFailure({ error }))
          )
        )
      )
    )
  );


  forgotPassword$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.forgotPassword),
    mergeMap(({ email }) =>
      this.AuthenticationService.forgotPassword(email).pipe(
        map((response: { message: string }) =>
          AuthActions.forgotPasswordSuccess({ message: response.message })
        ),
        catchError((error) =>
          of(AuthActions.forgotPasswordFailure({ error: error.message }))
        )
      )
    )
  )
);


  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      mergeMap(({ token, newPassword }) =>
        this.AuthenticationService.resetPassword(token, newPassword).pipe(
          map(() => AuthActions.resetPasswordSuccess({ message: 'Mot de passe modifié avec succès' })),
          catchError(err => of(AuthActions.resetPasswordFailure({ error: err.error.message || 'Erreur serveur' })))
        )
      )
    )
  );

  loadUserImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserImage),
      mergeMap(() =>
        this.AuthenticationService.getUserImage().then(image =>
          AuthActions.loadUserImageSuccess({ image: image || '' })
        ).catch(error =>
          AuthActions.loadUserImageFailure({ error: error.message })
        )
      )
    )
  );
}
