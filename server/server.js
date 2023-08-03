const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:4200' // substitua com o seu domínio
}));

let jobs = [
	{ 
		"ID": 1,
		"Descricao": "Importação de arquivos de fundos", 
		"Data_Maxima_de_conclusao": '2021-02-04 12:00:00', 
		"Tempo_estimado": '8 horas'
	},
	{ 
		"ID": 2,
		"Descricao": 'Importação de dados da Base Legada', 
		"Data_Maxima_de_conclusao": '2021-02-04 12:00:00', 
		"Tempo_estimado": '4 horas'
	},
	{ 
		"ID": 3,
		"Descricao": 'Importação de dados', 
		"Data_Maxima_de_conclusao": '2021-02-02 12:00:00', 
		"Tempo_estimado": '6 horas'
	},
{ 
		"ID": 4,
		"Descricao": 'Desenvolver historia 745', 
		"Data_Maxima_de_conclusao": '2021-02-02 12:00:00', 
		"Tempo_estimado": '2 horas'
	},
	{ 
		"ID": 5,
		"Descricao": 'Gerar QRCode', 
		"Data_Maxima_de_conclusao": '2020-02-15 12:00:00', 
		"Tempo_estimado": '6 horas'
	},
	{
		"ID": 6,
		"Descricao": 'Importação de dados de integração', 
		"Data_Maxima_de_conclusao": '2020-02-15 12:00:00', 
		"Tempo_estimado": '8 horas'
	},
]

jobs = jobs.map(job => ({
  ID: job.ID,
  Descricao: job['Descrição'],
  Data_Maxima_de_conclusao: job['Data Máxima de conclusão'],
  Tempo_estimado: parseInt(job['Tempo estimado'].split(' ')[0]) * 60
}));

jobs.sort((a, b) => new Date(a['Data Máxima de conclusão']) - new Date(b['Data Máxima de conclusão']));

let currentDay = null;
let totalDuration = 0;

for(let i = 0; i < jobs.length; i++) {
  const job = jobs[i];
  const date = new Date(job['Data Máxima de conclusão']);
  const day = date.getDate();


  if(day !== currentDay || totalDuration + job['Tempo estimado'] > 8 * 60) {
    totalDuration = 0;
    currentDay = day;
  }

  totalDuration += job['Tempo estimado'];

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  cron.schedule(`${second} ${minute} ${hour} * * *`, () => {
    console.log('Running job: ' + job['Descrição']);
    jobs.splice(i, 1);
  });
}

app.get('/jobs', (req, res) => {
  const currentJobs = jobs.filter(job => new Date(job['Data Máxima de conclusão']) > new Date());
  res.json(currentJobs);
});

app.get('/jobs/:id', (req, res) => {
  const job = jobs.find(job => job['ID'] === parseInt(req.params.id));
  if(job) {
    res.json(job);
  } else {
    res.status(404).send('Job not found');
  }
});

app.post('/jobs', (req, res) => {
  const newJob = req.body;
  jobs.push(newJob);
  res.status(201).send('Job created');
});

app.put('/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = jobs.findIndex(job => job['ID'] === id);
  if(index !== -1) {
    jobs[index] = req.body;
    res.send('Job updated');
  } else {
    res.status(404).send('Job not found');
  }
});

app.delete('/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = jobs.findIndex(job => job['ID'] === id);
  if(index !== -1) {
    jobs.splice(index, 1);
    res.send('Job deleted');
  } else {
    res.status(404).send('Job not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
