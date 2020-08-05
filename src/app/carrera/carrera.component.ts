import { Component, OnInit } from '@angular/core';
import {DbService} from '../services/db.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAnalytics} from '@angular/fire/analytics';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent implements OnInit {

  siglas: string;
  carrera: Observable<any>;
  planes: Observable<any>;

  constructor(
    private db: DbService,
    private route: ActivatedRoute,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    this.siglas = this.route.snapshot.params.carrera;
    this.planes = this.db.getPlanes(this.siglas);
    this.carrera = this.db.getCarrera(this.siglas);
    this.analytics.logEvent('visit_carreraPage');
    this.analytics.setCurrentScreen('carrera');
  }

}
