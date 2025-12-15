import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// ===============================
// GET /api/cursos  (lista/pesquisa)
// ===============================
router.get('/', async (req, res) => {
  console.log('Consulta cursos recebida');

  try {
    // Captura os filtros opcionais
    const { id, nomeCurso, modalidadeId, professorId } = req.query;

    // Array que acumula as condições do WHERE
    const where = [];
    // Array que acumula os valores para o prepared statement
    const params = [];

    // -----------------------------
    // Filtros opcionais
    // -----------------------------
    if (id) {
      params.push(id);
      where.push(`c.id = $${params.length}`);
    }

    if (nomeCurso) {
      params.push(`%${nomeCurso}%`);
      where.push(`c.nome ILIKE $${params.length}`);
    }

    if (modalidadeId) {
    params.push(modalidadeId);
    where.push(`
      EXISTS (
        SELECT 1
        FROM turmas t2
        WHERE t2.curso_id = c.id
          AND t2.modalidade_id = $${params.length}
      )
    `);
    }

    if (professorId) {
      params.push(professorId);
      where.push(`
        EXISTS (
          SELECT 1
          FROM professores_cursos pc2
          WHERE pc2.curso_id = c.id
            AND pc2.professor_id = $${params.length}
        )
      `);
    }

    // Monta a query base
    let sql = `
      SELECT
        c.id,
        c.nome,
        c.carga_horaria_horas,
        c.valor_padrao_inscricao,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT t.modalidade_id), NULL) AS modalidades_disponiveis
      FROM cursos c
      LEFT JOIN turmas t
        ON t.curso_id = c.id
    `;

    // Se existirem filtros, adiciona WHERE
    if (where.length > 0) {
      sql += ' WHERE ' + where.join(' AND ');
    }

    // GROUP BY
    sql += `
      GROUP BY
        c.id,
        c.nome,
        c.carga_horaria_horas,
        c.valor_padrao_inscricao
    `;

    // Ordenação
    sql += ' ORDER BY c.nome';

    // Executa
    console.log('SQL cursos (lista/pesquisa):', sql);
    console.log('Parâmetros cursos (lista/pesquisa):', params);

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar cursos' });
  }
});

// ======================================
// GET /api/cursos/:id  (detalhar 1 curso)
// Retorna: { curso: {...}, professores: [...] }
// ======================================
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Detalhar curso recebido. ID:', id);

  try {
    // 1) Curso (1 registro)
    const sqlCurso = `
      SELECT
        c.id,
        c.nome,
        c.carga_horaria_horas,
        c.valor_padrao_inscricao,

      -- Modalidades disponíveis nas turmas
      ARRAY_AGG(DISTINCT t.modalidade_id) AS modalidades_disponiveis
      FROM cursos c
      LEFT JOIN turmas t
        ON t.curso_id = c.id
      WHERE c.id = $1
      GROUP BY c.id
    `;

    console.log('SQL curso (detalhe):', sqlCurso);
    console.log('Parâmetros curso (detalhe):', [id]);

    const cursoResult = await pool.query(sqlCurso, [id]);

    if (cursoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    const curso = cursoResult.rows[0];

    // 2) Professores do curso (N registros)
    const sqlProfessores = `
      SELECT
        p.id,
        p.nome,
        p.telefone,
        p.valor_hora_aula
      FROM professores_cursos pc
      JOIN professores p
        ON p.id = pc.professor_id
      WHERE pc.curso_id = $1
      ORDER BY p.nome
    `;

    console.log('SQL professores (detalhe):', sqlProfessores);
    console.log('Parâmetros professores (detalhe):', [id]);

    const professoresResult = await pool.query(sqlProfessores, [id]);

    // 3) Retorno unificado para o front renderizar topo + mini tabela
    return res.json({
      curso,
      professores: professoresResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao detalhar curso' });
  }
});

export default router;
