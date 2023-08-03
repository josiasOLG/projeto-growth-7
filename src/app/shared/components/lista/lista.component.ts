import { Component, OnInit } from '@angular/core';
import { JobInterface } from '../../interface/job.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['ID', 'Descricao', 'MaxDateconclusao', 'TempoEstimado'];
  dataSource: JobInterface[] = [
    {
      "ID": 1,
      "Descricao": "Importação de arquivos de fundos",
      "MaxDateconclusao": '2021-02-04 12:00:00',
      "TempoEstimado": '8 horas'
    },
    {
      "ID": 2,
      "Descricao": "Importação de arquivos de fundos",
      "MaxDateconclusao": '2021-02-04 12:00:00',
      "TempoEstimado": '8 horas'
    },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      'Descricao': ['', Validators.required],
      'MaxDateconclusao': ['', Validators.required],
      'TempoEstimado': ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
  }

}
