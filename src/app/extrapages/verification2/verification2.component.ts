import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verification2',
  templateUrl: './verification2.component.html',
  styleUrls: ['./verification2.component.scss']
})
export class Verification2Component implements OnInit {

  constructor() { }
  // set the currenr year
  year: number = new Date().getFullYear();
  ngOnInit(): void {
  }

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };
}
