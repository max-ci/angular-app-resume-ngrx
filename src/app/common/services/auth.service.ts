import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userToken$: Observable<string | null>;

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.userToken$ = this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return from(user.getIdToken());
        }
        return of(null);
      })
    );
  }

  login(formValue: { login: string; password: string }) {
    return this.auth.signInWithEmailAndPassword(
      formValue.login,
      formValue.password
    );
  }

  logout(): void {
    this.auth
      .signOut()
      .catch((error) => {
        console.error(error);
      })
      .then(() => {
        this.router.navigateByUrl('login');
      });
  }
}
