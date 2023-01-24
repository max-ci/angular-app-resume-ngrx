import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userToken$: Observable<string | null>;

  constructor(private _auth: AngularFireAuth, private _router: Router) {
    this.userToken$ = this._auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return from(user.getIdToken());
        }
        return of(null);
      })
    );
  }

  login(formValue: { login: string; password: string }) {
    return this._auth.signInWithEmailAndPassword(
      formValue.login,
      formValue.password
    );
  }

  logout(): void {
    this._auth
      .signOut()
      .catch((error) => {
        console.error(error);
      })
      .then(() => {
        this._router.navigateByUrl('login');
      });
  }
}
