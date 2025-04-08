import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

/**
 * Footer component
 */
export class FooterComponent implements OnInit {
   //routes client
   routesToHideBars: string[] = [
    '/import-contrat',
    '/contrats-client'
  ];
  showBars: boolean = true;

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor(private router:Router) { }

  ngOnInit() {
    //détection de currentPath et le comparer
    this.router.events.subscribe(() => {
      const urlSegments = this.router.parseUrl(this.router.url).root.children['primary']?.segments;
      const currentPath = '/' + (urlSegments?.[0]?.path || '');
  
      this.showBars = !this.routesToHideBars.includes(currentPath);
    });
  }

}
