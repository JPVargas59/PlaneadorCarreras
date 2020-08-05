import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../services/db.service';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {User} from 'firebase';

declare var $: any;

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  carrera: string;
  plan: string;
  nombreCarrera: Observable<any>;
  materias: any;
  semestres = [0];

  materiasEscogidas = 0;
  materiasSinEscoger = 0;

  selector = 0;

  colors = [
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown'
  ];

  semestresTerminados = [];

  user$: Observable<User>;
  user: User;

  constructor(
    private db: DbService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    $('.ui.checkbox').checkbox();
    const {carrera, plan} = this.route.snapshot.params;
    this.carrera = carrera;
    this.plan = plan;
    this.nombreCarrera = this.db.getCarrera(carrera);

    this.user$ = this.auth.user$;
    this.auth.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.getMaterias(user.uid);
      } else {
        this.db.getMaterias(carrera, plan).subscribe((m) => this.parseMaterias(m));
      }
    });

    this.analytics.logEvent('visit_planPage');
    this.analytics.setCurrentScreen('plan');
    this.analytics.setUserProperties({carrera});

  }

  filter(array: any[], semestre) {
    return array.filter(m => m.semestre === semestre);
  }

  getMaterias(userId) {
    this.db.userHasMaterias(this.carrera, this.plan, userId)
      .then(r => {
        if (r) {
          this.db.getMateriasUser(this.carrera, this.plan, userId).subscribe((m) => this.parseMaterias(m));
        } else {
          this.db.getMaterias(this.carrera, this.plan).subscribe((m) => this.parseMaterias(m));
        }
      });
  }

  parseMaterias(materias) {
    this.materiasEscogidas = 0;
    this.materiasSinEscoger = 0;
    this.materias = materias;
    materias.map(m => {
      if (m.semestre > this.semestres[0]) {
        this.semestres[0] = m.semestre;
      }
      this.materiasSinEscoger++;
      if (m.selected !== undefined) {
        this.materiasEscogidas++;
      }
    });
    this.semestres = Array(this.semestres[0] + 1).fill(0).map((x, i) => i);
    this.semestresTerminados = Array(this.semestres.length).fill(false);
    this.updateProgress();
  }

  clickMateria(materia) {
    if (materia.selected === undefined) {
      materia.selected = this.selector;
      this.materiasEscogidas++;
    } else {
      materia.selected = undefined;
      this.materiasEscogidas--;
    }
    this.updateProgress();
  }

  clickSemestre(semestre) {
    this.materias.map(m => {
      if (m.semestre === semestre) {
        if (this.semestresTerminados[semestre]) {
          m.selected = undefined;
          this.materiasEscogidas--;
        } else {
          m.selected = this.selector;
          this.materiasEscogidas++;
        }
      }
    });
    this.updateProgress();
  }

  save() {
    this.db.save(this.plan, this.materias, this.user.uid)
      .then(() => alert('Materias guardadas exitosamente'));
  }

  updateProgress() {
    const percent = this.materiasEscogidas / this.materiasSinEscoger * 100;
    $('#progreso').progress({percent});
    this.analytics.setUserProperties({progreso: percent});
  }

  signIn() {
    const materiasAGuardar = this.materias;
    this.auth.signIn()
      .then((user) => {
        console.log(user);
        this.db.save(this.plan, materiasAGuardar, user.user.uid)
          .then(() => alert('Materias guardadas exitosamente'))
          .then((() => this.parseMaterias(materiasAGuardar)));
      });
  }
}
