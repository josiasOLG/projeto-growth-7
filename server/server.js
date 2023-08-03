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
  // seu array de jobs
];

// Transformamos o tempo estimado de horas para minutos para facilitar o cálculo
jobs = jobs.map(job => ({
  ID: job.ID,
  Descricao: job['Descrição'],
  Data_Maxima_de_conclusao: job['Data Máxima de conclusão'],
  Tempo_estimado: parseInt(job['Tempo estimado'].split(' ')[0]) * 60
}));
// Ordenamos os jobs pela data de conclusão
jobs.sort((a, b) => new Date(a['Data Máxima de conclusão']) - new Date(b['Data Máxima de conclusão']));

let currentDay = null;
let totalDuration = 0;

for(let i = 0; i < jobs.length; i++) {
  const job = jobs[i];
  const date = new Date(job['Data Máxima de conclusão']);
  const day = date.getDate();

  // Se o dia do job atual for diferente do dia anterior ou se a duração total exceder 8 horas
  // Nós resetamos a duração total e atualizamos o dia atual
  if(day !== currentDay || totalDuration + job['Tempo estimado'] > 8 * 60) {
    totalDuration = 0;
    currentDay = day;
  }

  // Adicionamos a duração do job atual à duração total
  totalDuration += job['Tempo estimado'];

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // Agendamos o job
  cron.schedule(`${second} ${minute} ${hour} * * *`, () => {
    console.log('Running job: ' + job['Descrição']);
    // Removemos o job do array
    jobs.splice(i, 1);
  });
}

// Rota para retornar todos os jobs
app.get('/jobs', (req, res) => {
  const currentJobs = jobs.filter(job => new Date(job['Data Máxima de conclusão']) > new Date());
  res.json(currentJobs);
});


// Rota para retornar um job pelo ID
app.get('/jobs/:id', (req, res) => {
  const job = jobs.find(job => job['ID'] === parseInt(req.params.id));
  if(job) {
    res.json(job);
  } else {
    res.status(404).send('Job not found');
  }
});

// Rota para adicionar um novo job
app.post('/jobs', (req, res) => {
  const newJob = req.body;
  jobs.push(newJob);
  res.status(201).send('Job created');
});

// Rota para atualizar um job
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

// Rota para remover um job
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
