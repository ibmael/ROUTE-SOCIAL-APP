import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detailes',
  imports: [],
  templateUrl: './detailes.component.html',
  styleUrl: './detailes.component.css',
})
export class DetailesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log(params.get('id'));
    });
  }
}
