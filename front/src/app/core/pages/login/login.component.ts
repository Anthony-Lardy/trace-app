import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TokenService } from '@core';
import { AuthService } from '@data/services/auth.service';
import { SettingsService } from '@core/bootstrap/settings.service';
import { UserService } from '@data/services/user.service';
import { CourseService } from '@data/services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private token: TokenService,
    private authService: AuthService,
    private settings: SettingsService,
    private userService: UserService,
    private courseService: CourseService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    const email = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;

    this.authService.login(email, password)
    .subscribe((value) => {

      if (!value) {
        this.loginForm.controls.password.setErrors({ incorrect: true });
      }


      this.token.set({ token: value, uid: email, username: email });

      this.userService.getUsers({
        filter: `email:${email} -has:deletedAt`,
      }).subscribe((u) => {
        if (u.length) {
          const teacher = u[0];
          this.courseService.getCourses({
            filter: `id:(${teacher.courses.join('|')})`,
          }).subscribe((c) => {
            this.settings.setCourses(c);
            this.settings.setUser(teacher);
            this.router.navigate(['/suivi', c[0].id]);
          });
        }
      });
    });
  }
}
