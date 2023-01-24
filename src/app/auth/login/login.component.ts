import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      login: ['demo@demo.demo', Validators.required],
      password: ['demodemo', Validators.required],
    });
  }

  onSubmit(): void {
    this.submitDisabled$.next(true);
    this._authService
      .login(this.form.value)
      .catch((error) => {
        console.error(error);
        this.submitDisabled$.next(false);
      })
      .then((data) => {
        if (data && data.user) {
          this._router.navigateByUrl('home');
        } else {
          this._notificationService.show(
            'Login or password is incorrect',
            'danger'
          );
        }
        this.submitDisabled$.next(false);
      });
  }
}
