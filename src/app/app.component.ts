import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {
    console.log('📍 Toutes les routes enregistrées :');
    console.table(this.router.config);
  }

  ngOnInit() {
  }
}
