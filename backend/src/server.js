import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import turmasRoutes from './routes/turma.routes.js';
import locaisRoutes from './routes/local.routes.js';
import professorRoutes from './routes/professor.routes.js';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

process.env.PGCLIENTENCODING = 'UTF8';

app.use('/api/turmas', turmasRoutes);
app.use('/api/locais', locaisRoutes);
app.use('/api/professores', professorRoutes);

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

// rota para cursos com filtros
app.get('/api/cursos', async (req, res) => {
  console.log('Consulta cursos recebida');

  try {
    // Captura os filtros opcionais
    const { nomeCurso, modalidadeId, professorId } = req.query;

    // Array que acumula as condições do WHERE
    const where = [];
    // Array que acumula os valores para o prepared statement
    const params = [];

    // -----------------------------
    // Filtros opcionais
    // -----------------------------

    if (nomeCurso) {
      params.push(`%${nomeCurso}%`);
      where.push(`c.nome ILIKE $${params.length}`);
    }

    if (modalidadeId) {
      params.push(modalidadeId);
      where.push(`c.modalidade_id = $${params.length}`);
    }

    if (professorId) {
      params.push(professorId);
      where.push(`pc.professor_id = $${params.length}`);
    }

    // Monta a query base
    let sql = `
      SELECT DISTINCT
        c.id,
        c.nome,
        c.carga_horaria_horas,
        c.valor_padrao_inscricao,

        -- Modalidade
        c.modalidade_id,
        m.nome AS modalidade_nome

      FROM cursos c
      LEFT JOIN professores_cursos pc
        ON pc.curso_id = c.id
      LEFT JOIN modalidades m
        ON m.id = c.modalidade_id
    `;

    // Se existirem filtros, adiciona WHERE
    if (where.length > 0) {
      sql += ' WHERE ' + where.join(' AND ');
    }

    // Ordenação
    sql += ' ORDER BY c.nome';

    // Executa
    console.log('SQL cursos:', sql);
    console.log('Parâmetros cursos:', params);
    const { rows } = await pool.query(sql, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar cursos' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});