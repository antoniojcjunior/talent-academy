import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// GET /api/professores  (lista/pesquisa com filtros)
router.get('/', async (req, res) => {
  console.log('Consulta professores recebida'); // Log no backend
  try {
    // Captura os filtros opcionais
    const { cpf, nome, ufId, cidadeId, nomeCurso, status } = req.query;

    // Array que acumula as condições do WHERE
    const where = [];
    // Array que acumula os valores para o prepared statement
    const params = [];

    // Filtros opcionais (lista/pesquisa)
    if (cpf) {
      params.push(cpf);
      where.push(`p.cpf = $${params.length}`);
    }

    if (nome) {
      params.push(`%${nome}%`);
      where.push(`p.nome ILIKE $${params.length}`);
    }

    if (ufId) {
      params.push(ufId);
      where.push(`cid.uf_id = $${params.length}`);
    }

    if (cidadeId) {
      params.push(cidadeId);
      where.push(`p.cidade_id = $${params.length}`);
    }

    if (nomeCurso) {
      params.push(`%${nomeCurso}%`);
      where.push(`c.nome ILIKE $${params.length}`);
    }

    // Se o frontend NÃO pedir status, traz só os ativos
    if (!status || status === 'ATIVO') {
      where.push("p.status = 'ATIVO'");
    } else if (status === 'INATIVO') {
      where.push("p.status = 'INATIVO'");
    }
    // Monta a query base
    let sql = `
      SELECT DISTINCT
        p.id,
        p.cpf,
        p.nome,
        p.telefone,
        p.valor_hora_aula,
        p.status,
        p.data_nascimento,

        cid.id AS cidade_id,
        cid.nome AS cidade_nome,
        uf.sigla AS uf_sigla

      FROM professores p
      LEFT JOIN cidades cid 
        ON cid.id = p.cidade_id
      LEFT JOIN estados uf
        ON uf.id = cid.uf_id
      LEFT JOIN professores_cursos pc
        ON pc.professor_id = p.id
      LEFT JOIN cursos c
        ON c.id = pc.curso_id
    `;

    // Aplica WHERE se tiver filtros
    if (where.length > 0) {
      sql += ' WHERE ' + where.join(' AND ');
    }

    // Ordenação
    sql += ' ORDER BY p.nome';

    console.log('SQL professores (lista/pesquisa):', sql);
    console.log('Parâmetros professores (lista/pesquisa):', params);

    const { rows } = await pool.query(sql, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar professores' });
  }
});

// GET /api/professores/:id  (detalhar 1 professor)
// NÃO filtra por status (traz ativo ou inativo)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  //console.log('Detalhar professor recebido. ID:', id);

  try {
    const sql = `
      SELECT
        p.id,
        p.cpf,
        p.nome,
        p.telefone,
        p.valor_hora_aula,
        p.status,
        p.data_nascimento,

        cid.id AS cidade_id,
        cid.nome AS cidade_nome,
        uf.sigla AS uf_sigla

      FROM professores p
      LEFT JOIN cidades cid 
        ON cid.id = p.cidade_id
      LEFT JOIN estados uf
        ON uf.id = cid.uf_id
      WHERE p.id = $1
    `;

    console.log('SQL professor (detalhe):', sql);
    console.log('Parâmetros professor (detalhe):', [id]);

    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao detalhar professor' });
  }
});

// GET /api/professores/:id/cursos  (listar cursos do professor)
router.get('/:id/cursos', async (req, res) => {
  const { id } = req.params;

  try {
    const sqlCursos = `
      SELECT c.id, c.nome, c.carga_horaria_horas, c.valor_padrao_inscricao
      FROM professores_cursos pc
      JOIN cursos c ON c.id = pc.curso_id
      WHERE pc.professor_id = $1
      ORDER BY c.nome
    `;
    const cursosResult = await pool.query(sqlCursos, [id]);
    return res.json({ cursos: cursosResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar cursos do professor' });
  }
});

export default router;
