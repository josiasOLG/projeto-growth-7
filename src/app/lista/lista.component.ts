import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

  items = ['Item 1', 'Item 2', 'Item 3'];

  constructor() { }

  ngOnInit(): void {
  }

}
