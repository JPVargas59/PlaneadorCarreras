import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Observable} from 'rxjs';
import {User} from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'planeadorTec';
  user: Observable<User>;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.user = this.auth.user$;
  }

  signIn() {
    this.auth.signIn();
  }

  signOut() {
    this.auth.signOut();
  }
}
