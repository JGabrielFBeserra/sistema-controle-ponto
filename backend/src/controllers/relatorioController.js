import { RelatorioPontoModel } from '../models/index.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import PDFDocument from 'pdfkit';

// Criar relatório
export const create = asyncHandler(async (req, res) => {
  const dados = { ...req.body, usuarioId: req.userId };
  const novo = await RelatorioPontoModel.create(dados);
  res.status(201).json(novo);
});

// Listar relatórios do usuário logado
export const getAll = asyncHandler(async (req, res) => {
  const data = await RelatorioPontoModel.findByUsuario(req.userId);
  res.json(data);
});

// Buscar relatório por ID
export const getById = asyncHandler(async (req, res) => {
  const item = await RelatorioPontoModel.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Relatório não encontrado' });
  }
  res.json(item);
});

// Atualizar relatório
export const update = asyncHandler(async (req, res) => {
  const upd = await RelatorioPontoModel.update(req.params.id, req.body);
  res.json(upd);
});

// Excluir relatório
export const remove = asyncHandler(async (req, res) => {
  await RelatorioPontoModel.delete(req.params.id);
  res.json({ success: true });
});

// Gerar PDF
export const generatePdf = asyncHandler(async (req, res) => {
  const { mes } = req.query;
  
  if (!mes) {
    return res.status(400).json({ error: 'Parâmetro mês é obrigatório' });
  }

  const [year, month] = mes.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const reports = await RelatorioPontoModel.findByUsuario(req.userId);
  const filteredReports = reports.filter(r => {
    const reportDate = new Date(r.data);
    return reportDate >= start && reportDate < end;
  });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="relatorio-${mes}.pdf"`);
  doc.pipe(res);

  doc.fontSize(18).text(`Relatório de Ponto - ${mes}`, { align: 'center' });
  doc.moveDown();

  if (filteredReports.length === 0) {
    doc.fontSize(12).text('Nenhum registro encontrado.', { align: 'center' });
  } else {
    let totalHoras = 0;
    filteredReports.forEach(relatorio => {
      const dateStr = new Date(relatorio.data).toISOString().slice(0, 10);
      doc.fontSize(12).text(`${dateStr} — ${relatorio.horasTrabalhadas} horas`);
      totalHoras += relatorio.horasTrabalhadas;
    });
    
    doc.moveDown();
    doc.fontSize(14).text(`Total: ${totalHoras} horas`, { align: 'center' });
  }

  doc.end();
});