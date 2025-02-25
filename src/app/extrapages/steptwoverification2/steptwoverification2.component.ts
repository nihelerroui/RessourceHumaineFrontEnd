import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-steptwoverification2',
  templateUrl: './steptwoverification2.component.html',
  styleUrls: ['./steptwoverification2.component.scss']
})
export class Steptwoverification2Component implements OnInit {

  constructor() { }
  // set the currenr year
  year: number = new Date().getFullYear();
  ngOnInit(): void {
  }
  config: any = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '80px',
      'height': '50px'
    }
  };
  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };
}
