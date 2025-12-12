import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// rota para cursos com filtros
router.get('/', async (req, res) => {
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

export default router;