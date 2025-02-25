import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lockscreen2',
  templateUrl: './lockscreen2.component.html',
  styleUrls: ['./lockscreen2.component.scss']
})
export class Lockscreen2Component implements OnInit {

  constructor() { }
  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void { }

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };
}
