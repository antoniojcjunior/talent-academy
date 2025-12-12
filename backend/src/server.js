import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import turmasRoutes from './routes/turma.routes.js';
import locaisRoutes from './routes/local.routes.js';
import professorRoutes from './routes/professor.routes.js';
import cursosRoutes from './routes/curso.routes.js';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

process.env.PGCLIENTENCODING = 'UTF8';

app.use('/api/turmas', turmasRoutes);
app.use('/api/locais', locaisRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/cursos', cursosRoutes);

// rota para listar UF
app.get('/api/ufs', async (_req, res) => {
  //console.log('Consulta UFs recebida'); // Log no backend
  try {
    const { rows } = await pool.query(
      'SELECT id, sigla FROM estados ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar UFs' });
  }
});

// rota para listar UF por id
app.get('/api/uf/:ufId', async (req, res) => {
  const { ufId } = req.params;
  console.log('Consulta UF recebida'); // Log no backend
  try {
    const { rows } = await pool.query(
      'SELECT id, sigla FROM estados WHERE id = $1 ORDER BY sigla',
      [ufId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar UF' });
  }
});

// rota para listar cidades de uma UF
app.get('/api/cidades/:ufId', async (req, res) => {
  const { ufId } = req.params;
  console.log('Consulta cidades recebida para UF:', ufId);
  try {
    const { rows } = await pool.query(
      'SELECT id, nome FROM cidades WHERE uf_id = $1 ORDER BY nome',
      [ufId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao consultar cidades:', err);
    res.status(500).json({ error: 'Erro ao consultar cidades' });
  }
});

// rota para listar cidades por id
app.get('/api/cidade/:cidade_id', async (req, res) => {
  const { cidade_id } = req.params;
  console.log('Consulta cidades por id:', cidade_id);
  try {
    const { rows } = await pool.query(
      'SELECT id, nome, uf_id FROM cidades WHERE id = $1 ORDER BY nome',
      [cidade_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao consultar cidades:', err);
    res.status(500).json({ error: 'Erro ao consultar cidades' });
  }
});

// rota para status da turma
app.get('/api/status_turma', async (_req, res) => {
  console.log('Consulta status_turma recebida'); // Log no backend
  try {
    const { rows } = await pool.query(
      'SELECT id, descricao FROM status_turma ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar status_turma' });
  }
});

// rota para modalidades
app.get('/api/modalidades', async (_req, res) => {
  console.log('Consulta modalidades recebida'); // Log no backend
  try {
    const { rows } = await pool.query(
      'SELECT id, nome FROM modalidades ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar modalidades' });
  }
});

// rota para listar modalidade por id
app.get('/api/modalidade/:modalidade_id', async (req, res) => {
  const { modalidade_id } = req.params;
  console.log('Consulta modalidades por id:', modalidade_id);
  try {
    const { rows } = await pool.query(
      'SELECT id, nome FROM modalidades WHERE id = $1 ORDER BY nome',
      [modalidade_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao consultar modalidades:', err);
    res.status(500).json({ error: 'Erro ao consultar modalidades' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});