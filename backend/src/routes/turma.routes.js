import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// rota para turmas com filtros
router.get('/', async (req, res) => {
  console.log('Consulta turmas recebida');
  try {
    // Filtros opcionais vindos da query string
    const { professorId, modalidadeId, statusId, cursoId, ufId, cidadeId, dataInicio, dataFim } = req.query;

    const where = [];
    const params = [];

    if (professorId) {
      params.push(professorId);
      where.push(`t.professor_id = $${params.length}`);
    }

    if (modalidadeId) {
      params.push(modalidadeId);
      where.push(`t.modalidade_id = $${params.length}`);
    }
    
    // STATUS múltiplo (string OU array)
    if (statusId) {
      if (Array.isArray(statusId)) {
        // Ex: statusId = ['1','2','3']
        const placeholders = statusId.map((_, i) => `$${params.length + i + 1}`);
        where.push(`t.status_turma_id IN (${placeholders.join(', ')})`);
        params.push(...statusId);
      } else {
        // Caso seja string única
        params.push(statusId);
        where.push(`t.status_turma_id = $${params.length}`);
      }
    }

    if (cursoId) {
      params.push(cursoId);
      where.push(`t.curso_id = $${params.length}`);
    }

    if (ufId) {
      params.push(ufId);
      where.push(`uf.id = $${params.length}`);
    }

    if (cidadeId) {
      params.push(cidadeId);
      where.push(`cid.id = $${params.length}`);
    }

    if (dataInicio && dataFim) { //quando ambas são preenchidas
        where.push(`t.data_inicio <= $${params.length + 2} AND t.data_fim >= $${params.length + 1}`);
        params.push(dataInicio, dataFim);
    } else if (dataInicio) { //somente data inicio preenchida
        where.push(`t.data_inicio >= $${params.length + 1}`);
        params.push(dataInicio);
    } else if (dataFim) {
        where.push(`t.data_inicio <= $${params.length + 1}`);
        params.push(dataFim);
    }

    let sql = `
      SELECT
        t.id,
        t.data_inicio,
        t.data_fim,
        t.hora_inicio,
        t.hora_fim,
        t.dias_aula,

        l.nome AS local_nome,

        cid.nome AS cidade_nome,
        uf.sigla AS uf_sigla,

        c.nome AS curso_nome,
        p.nome AS professor_nome,
        st.descricao AS status_nome,
        m.nome AS modalidade_nome
      FROM turmas t
      LEFT JOIN cursos c
        ON c.id = t.curso_id
      LEFT JOIN professores p
        ON p.id = t.professor_id
      LEFT JOIN locais l
        ON l.id = t.local_id
      LEFT JOIN cidades cid
        ON cid.id = l.cidade_id
      LEFT JOIN estados uf
        ON uf.id = cid.uf_id
      LEFT JOIN status_turma st
        ON st.id = t.status_turma_id
      LEFT JOIN modalidades m
        ON m.id = t.modalidade_id
    `;

    if (where.length > 0) {
      sql += ' WHERE ' + where.join(' AND ');
    }

    sql += ' ORDER BY t.id';

    console.log('SQL turmas:', sql);
    console.log('Parâmetros turmas:', params);

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao consultar turmas:', err);
    res.status(500).json({ error: 'Erro ao consultar turmas' });
  }
});

// rota para turmas detalhado por ID
router.get('/:id', async (req, res) => {
  console.log('Detalhamento turma recebido');
  try {
    const { id } = req.params;

    // NOVO: validação básica
    const turmaId = Number(id);
    if (!Number.isInteger(turmaId) || turmaId <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const sql = `
      SELECT
        t.id,
        t.data_inicio,
        t.data_fim,
        t.hora_inicio,
        t.hora_fim,
        t.dias_aula,

        t.curso_id,
        t.professor_id,
        t.local_id,
        t.status_turma_id,
        t.modalidade_id,
        t.custo_professor,
        t.valor_negociado_professor,

        l.nome AS local_nome,

        cid.nome AS cidade_nome,
        uf.sigla AS uf_sigla,

        c.nome AS curso_nome,
        p.nome AS professor_nome,
        st.descricao AS status_nome,
        m.nome AS modalidade_nome
      FROM turmas t
      LEFT JOIN cursos c
        ON c.id = t.curso_id
      LEFT JOIN professores p
        ON p.id = t.professor_id
      LEFT JOIN locais l
        ON l.id = t.local_id
      LEFT JOIN cidades cid
        ON cid.id = l.cidade_id
      LEFT JOIN estados uf
        ON uf.id = cid.uf_id
      LEFT JOIN status_turma st
        ON st.id = t.status_turma_id
      LEFT JOIN modalidades m
        ON m.id = t.modalidade_id
      WHERE t.id = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(sql, [turmaId]);
    console.log('SQL turmas por ID:', sql);
    // NOVO: 404 se não achar
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao detalhar turma:', err);
    return res.status(500).json({ error: 'Erro ao detalhar turma' });
  }
});

export default router;
