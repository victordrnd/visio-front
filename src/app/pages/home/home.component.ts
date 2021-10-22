import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// @ts-ignore
import LocomotiveScroll from 'locomotive-scroll';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,AfterViewInit {
  @ViewChild('body') body: ElementRef | undefined;
  scroll: any;
  constructor() { }

  ngOnInit(): void {
    this.scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true
    });
  }
  

  ngAfterViewInit() {
    const ro = new ResizeObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        const { inlineSize: width, blockSize: height } = entry.contentBoxSize[0];
        if(this.scroll) {
          this.scroll.update();
        }
      });
    });
    ro.observe(document.getElementById('body') as Element);
  }
}
