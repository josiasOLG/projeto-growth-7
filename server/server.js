const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:4200", // substitua com o seu domínio
  })
);

let jobs = [
  {
    ID: 1,
    Descricao: "Importação de arquivos de fundos",
    Data_Maxima_de_conclusao: "2023-03-08 20:00:00",
    Tempo_estimado: "8 horas",
  },
  {
    ID: 2,
    Descricao: "Importação de dados da Base Legada",
    Data_Maxima_de_conclusao: "2021-02-04 12:00:00",
    Tempo_estimado: "4 horas",
  },
  {
    ID: 3,
    Descricao: "Importação de dados",
    Data_Maxima_de_conclusao: "2021-02-02 12:00:00",
    Tempo_estimado: "6 horas",
  },
  {
    ID: 4,
    Descricao: "Desenvolver historia 745",
    Data_Maxima_de_conclusao: "2021-02-02 12:00:00",
    Tempo_estimado: "2 horas",
  },
  {
    ID: 5,
    Descricao: "Gerar QRCode",
    Data_Maxima_de_conclusao: "2020-02-15 12:00:00",
    Tempo_estimado: "6 horas",
  },
  {
    ID: 6,
    Descricao: "Importação de dados de integração",
    Data_Maxima_de_conclusao: "2020-02-15 12:00:00",
    Tempo_estimado: "8 horas",
  },
];

// Transformamos o Tempo_estimado de horas para minutos para facilitar o cálculo
jobs = jobs.map((job) => ({
  ID: job.ID,
  Descricao: job.Descricao,
  Data_Maxima_de_conclusao: moment(job.Data_Maxima_de_conclusao, "YYYY-MM-DD HH:mm:ss"),
  Tempo_estimado: parseInt(job.Tempo_estimado.split(" ")[0]) * 60,
}));

// Ordenamos os jobs pela data de conclusão
jobs.sort(
  (a, b) =>
  moment(a["Data_Maxima_de_conclusao"],  "YYYY-MM-DD HH:mm:ss") -
  moment(b["Data_Maxima_de_conclusao"],  "YYYY-MM-DD HH:mm:ss")
);

let currentDay = null;
let totalDuration = 0;

for (let i = 0; i < jobs.length; i++) {
  const job = jobs[i];
  const date = new Date(job["Data_Maxima_de_conclusao"]);
  const day = date.getDate();

  // Se o dia do job atual for diferente do dia anterior ou se a duração total exceder 8 horas
  // Nós resetamos a duração total e atualizamos o dia atual
  if (day !== currentDay || totalDuration + job["Tempo_estimado"] > 8 * 60) {
    totalDuration = 0;
    currentDay = day;
  }

  // Adicionamos a duração do job atual à duração total
  totalDuration += job["Tempo_estimado"];

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // Agendamos o job
  cron.schedule(`${second} ${minute} ${hour} * * *`, () => {
    console.log("Running job: " + job["Descrição"]);
    // Removemos o job do array
    jobs.splice(i, 1);
  });
}

// Rota para retornar todos os jobs
app.get("/jobs", (req, res) => {
  const currentDateTime = moment();
  const currentJobs = jobs.filter((job) => moment(job.Data_Maxima_de_conclusao) < currentDateTime);
  res.json(currentJobs);
});

// Rota para retornar um job pelo ID
app.get("/jobs/:id", (req, res) => {
  const job = jobs.find((job) => job["ID"] === parseInt(req.params.id));
  if (job) {
    res.json(job);
  } else {
    res.status(404).send("Job not found");
  }
});

// Rota para adicionar um novo job
app.post("/jobs", (req, res) => {
  const newJob = req.body;
  jobs.push(newJob);
  res.status(201).send("Job created");
});

// Rota para atualizar um job
app.put("/jobs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = jobs.findIndex((job) => job["ID"] === id);
  if (index !== -1) {
    jobs[index] = req.body;
    res.send("Job updated");
  } else {
    res.status(404).send("Job not found");
  }
});

// Rota para remover um job
app.delete("/jobs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = jobs.findIndex((job) => job["ID"] === id);
  if (index !== -1) {
    jobs.splice(index, 1);
    res.send("Job deleted");
  } else {
    res.status(404).send("Job not found");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
