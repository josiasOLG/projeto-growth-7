import { Component, OnInit } from '@angular/core';
import { JobInterface } from '../../interface/job.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from 'src/app/core/services/job.service';
import { Job } from 'src/app/core/entities/job.entities';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['id', 'descricao', 'dataMaxima', 'duracao'];
  dataSource: any;

  constructor(private fb: FormBuilder, private jobService: JobService) {
    this.form = this.fb.group({
      Descricao: ['', Validators.required],
      MaxDateconclusao: ['', Validators.required],
      TempoEstimado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getDados();
  }

  getDados(){
    this.jobService.organizeJobs().subscribe(resp => {
      this.dataSource = resp;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const model  = {
        ID: 7,
        Descricao: this.form.get('Descricao')?.value ?? '',
        Data_Maxima_de_conclusao: this.form.get('MaxDateconclusao')?.value ?? '',
        Tempo_estimado: this.form.get('TempoEstimado')?.value ?? ''
      };
      this.jobService.post(model).subscribe(resp => {
        console.log(resp);
        this.getDados();
        this.form.reset();
      })

    }
  }

}
