import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// rota para locais com filtros
router.get('/', async (req, res) => {
console.log('Consulta locais recebida');

try {
    // Captura os filtros opcionais
    const { id, nome, ufId, cidadeId, bairro } = req.query;

    // Array que acumula as condições do WHERE
    const where = [];
    // Array que acumula os valores para o prepared statement
    const params = [];

    // -----------------------------
    // Filtros opcionais
    // -----------------------------

    if (id) {
    params.push(id);
    where.push(`l.id = $${params.length}`);
    }

    if (nome) {
    params.push(`%${nome}%`);
    where.push(`l.nome ILIKE $${params.length}`);
    }

    if (ufId) {
    params.push(ufId);
    where.push(`c.uf_id = $${params.length}`);
    }

    if (cidadeId) {
    params.push(cidadeId);
    where.push(`l.cidade_id = $${params.length}`);
    }

    if (bairro) {
    params.push(`%${bairro}%`);
    where.push(`l.bairro ILIKE $${params.length}`);
    }

    // Monta a query base
    let sql = `
    SELECT 
        l.id, l.nome, l.logradouro, l.numero, l.complemento,
        l.bairro, l.cep, l.telefone,
        l.cidade_id,
        l.valor_aluguel_dia, l.valor_aluguel_turno,
        c.nome AS cidade_nome,
        c.uf_id,
        e.sigla AS uf_sigla
    FROM locais l
    LEFT JOIN cidades c 
        ON c.id = l.cidade_id
    LEFT JOIN estados e
        ON e.id = c.uf_id
    `;

    // Se existirem filtros, adiciona WHERE
    if (where.length > 0) {
    sql += ' WHERE ' + where.join(' AND ');
    }

    // Ordenação
    sql += ' ORDER BY l.nome';

    // Executa
    console.log('SQL Locais:', sql);
    console.log('Parâmetros Locais:', params);
    const { rows } = await pool.query(sql, params);

    res.json(rows);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar locais' });
}
});

// DELETE /api/locais/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Requisição DELETE local id:', id);

  try {
    // 1) Verifica se o local existe
    const sqlVerificaLocal = 'SELECT id FROM locais WHERE id = $1';
    const { rowCount: existeLocal } = await pool.query(sqlVerificaLocal, [id]);

    if (existeLocal === 0) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    // 2) Verifica se existe alguma turma usando esse local
    const sqlTurmasVinculadas = `
      SELECT COUNT(*) AS total
      FROM turmas
      WHERE local_id = $1
    `;
    const resultadoTurmas = await pool.query(sqlTurmasVinculadas, [id]);
    const totalTurmas = Number(resultadoTurmas.rows[0].total);

    if (totalTurmas > 0) {
      return res.status(400).json({
        error: `Não é possível excluir este local, pois ele está vinculado a ${totalTurmas} turma(s).`
      });
    }

    // 3) Sem vínculos -> exclui o local
    const sqlDelete = 'DELETE FROM locais WHERE id = $1';
    const { rowCount } = await pool.query(sqlDelete, [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar local:', err);
    return res.status(500).json({ error: 'Erro ao deletar local' });
  }
});

export default router;
