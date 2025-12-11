import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// rota para professores com filtros
router.get('/', async (req, res) => {
  console.log('Consulta professores recebida'); // Log no backend
  try {
    // Captura os filtros opcionais
    const { id, cpf, nome, ufId, cidadeId, nomeCurso, status } = req.query;

    // Array que acumula as condições do WHERE
    const where = [];
    //where.push("p.status = 'ATIVO'"); // Filtra apenas professores ativos
    // Array que acumula os valores para o prepared statement
    const params = [];

    // -----------------------------
    // Filtros opcionais
    // -----------------------------
    if (id) {
      params.push(id);
      where.push(`p.id = $${params.length}`);
    }

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

    console.log('SQL professores:', sql);
    console.log('Parâmetros professores:', params);

    const { rows } = await pool.query(sql, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar professores' });
  }
});

export default router;
