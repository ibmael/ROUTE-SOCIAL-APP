import { Component } from '@angular/core';

@Component({
  selector: 'app-right-side',
  imports: [],
  host: {
    class: 'hidden lg:block col-span-1',
  },
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.css',
})
export class RightSideComponent {}
