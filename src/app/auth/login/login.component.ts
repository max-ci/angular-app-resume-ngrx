import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';
import { NotificationService } from 'src/app/common/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      login: ['demo@demo.demo', Validators.required],
      password: ['demodemo', Validators.required],
    });
  }

  onSubmit(): void {
    this.submitDisabled$.next(true);
    this.authService
      .login(this.form.value)
      .catch((error) => {
        console.error(error);
        this.submitDisabled$.next(false);
      })
      .then((data) => {
        if (data && data.user) {
          this.router.navigateByUrl('home');
        } else {
          this.notificationService.show(
            'Login or password is incorrect',
            'danger'
          );
        }
        this.submitDisabled$.next(false);
      });
  }
}
