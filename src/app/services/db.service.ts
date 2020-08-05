import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './auth.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class DbService {


  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private analytics: AngularFireAnalytics
  ) { }

  getCarreras(): Observable<any> {
    return this.afs.collection('carreras').valueChanges({idField: 'siglas'});
  }

  getCarrera(carrera: string): Observable<any> {
    return this.afs.collection('carreras').doc(carrera).valueChanges();
  }

  getPlanes(carrera: string): Observable<any> {
    return this.afs.collection('carreras').doc(carrera).collection('planes').valueChanges({idField: 'siglas'});
  }

  getMateriasUser(carrera: string, plan: string, uid: string): Observable<any> {
    return this.afs.collection(`users/${uid}/planes/${plan}/materias`).valueChanges({idField: 'clave'});
  }

  getMaterias(carrera: string, plan: string): Observable<any> {
    return this.afs.collection(`carreras/${carrera}/planes/${plan}/materias`).valueChanges({idField: 'clave'});
  }

  userHasMaterias(carrera: string, plan: string, uid: string): Promise<any> {
    return new Promise<any>((resolve) => {
      this.afs.doc(`users/${uid}/planes/${plan}`).get().subscribe(d => {
        resolve(d.exists);
      });
    });
  }

  save(plan, materias, uid): Promise<any> {
    const planRef = this.afs.firestore.doc(`users/${uid}/planes/${plan}`);
    const exists = true;
    const batch = this.afs.firestore.batch();
    batch.set(planRef, {exists});
    materias.map(m => {
      const docRef = this.afs.firestore.doc(`users/${uid}/planes/${plan}/materias/${m.clave}`);
      return batch.set(docRef, m);
    });
    return batch.commit().then(() => this.analytics.logEvent('saved_plan'));
  }

}
