import { Component } from '@angular/core';

@Component({
  selector: 'app-left-side',
  imports: [],
  host: {
    class: 'hidden md:block col-span-1',
  },
  templateUrl: './left-side.component.html',
  styleUrl: './left-side.component.css',
})
export class LeftSideComponent {}
