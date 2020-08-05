import { Component, OnInit } from '@angular/core';
import {DbService} from '../services/db.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireAnalytics} from '@angular/fire/analytics';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  carreras: Observable<any>;
  selection: string;

  constructor(
    private db: DbService,
    private router: Router,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    $('select.dropdown')
      .dropdown()
    ;
    this.carreras = this.db.getCarreras();
    this.analytics.logEvent('visit_homePage');
    this.analytics.setCurrentScreen('home');
  }

  onSubmit() {
    console.log(this.selection);
    this.router.navigate([this.selection]);
  }
}
