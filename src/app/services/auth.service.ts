import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable, of} from 'rxjs';
import {User, auth} from 'firebase';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User;
  user$: Observable<User>;
  constructor(
    private afAuth: AngularFireAuth,
    private analytics: AngularFireAnalytics
  ) {
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;
    });

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return of(user);
        } else {
          // Logged out
          return of(null);
        }
      })
    )
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  signIn(): Promise<any> {
    this.analytics.logEvent('login');
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider);
  }

  signOut() {
    return this.afAuth.signOut();
  }
}
