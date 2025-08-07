// src/components/FinancialManager.tsx

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { CircleDollarSign, FileText, TrendingUp, Calendar, Download, Plus, Trash2 } from 'lucide-react'
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { toast } from "sonner"

type Despesa = { id: string; descricao: string; valor: number; data_despesa: string; };
type Relatorio = { medico_id: string; nome_medico: string; total_horas_sala: number; custo_aluguel_sala: number; receita_parceria: number; custo_consumo_produtos: number; custo_condominio: number; valor_final_fatura: number; };

export function FinancialManager() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loadingDespesas, setLoadingDespesas] = useState(true);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '', data: new Date().toISOString().split('T')[0] });
  const [relatorio, setRelatorio] = useState<Relatorio[]>([]);
  const [mesAnoRelatorio, setMesAnoRelatorio] = useState({ mes: new Date().getMonth() + 1, ano: new Date().getFullYear() });
  
  // --- NOVO: State para o filtro de despesas ---
  const [filtroDespesas, setFiltroDespesas] = useState({ mes: new Date().getMonth() + 1, ano: new Date().getFullYear() });

  function exportarPdf() {
    const doc = new jsPDF();
    doc.text(`Relatório de Fechamento - ${mesAnoRelatorio.mes}/${mesAnoRelatorio.ano}`, 14, 16);
    const head = [['Médico', 'Aluguel', 'Parceria', 'Produtos', 'Condomínio', 'FATURA FINAL']];
    const body = relatorio.map(r => [ r.nome_medico, `R$ ${r.custo_aluguel_sala.toFixed(2)}`, `R$ ${r.receita_parceria.toFixed(2)}`, `R$ ${r.custo_consumo_produtos.toFixed(2)}`, `R$ ${r.custo_condominio.toFixed(2)}`, `R$ ${r.valor_final_fatura.toFixed(2)}`, ]);
    autoTable(doc, { head, body, startY: 25 });
    doc.save(`fechamento-${mesAnoRelatorio.mes}-${mesAnoRelatorio.ano}.pdf`);
  }

  // --- ATUALIZADO: Função para buscar despesas com filtro ---
  async function fetchDespesas(mes: number, ano: number) {
    setLoadingDespesas(true);
    const startDate = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const endDate = new Date(ano, mes, 0).toISOString().split('T')[0]; // Pega o último dia do mês

    const { data, error } = await supabase
      .from('despesas_clinica')
      .select('*')
      .gte('data_despesa', startDate)
      .lte('data_despesa', endDate)
      .order('data_despesa', { ascending: false });
    
    if (error) toast.error("Erro ao buscar despesas: " + error.message);
    else setDespesas(data || []);

    setLoadingDespesas(false);
  }

  useEffect(() => {
    fetchDespesas(filtroDespesas.mes, filtroDespesas.ano);
  }, []); // Roda apenas na primeira vez

  // --- NOVA: Função para deletar despesa ---
  async function handleDeleteDespesa(despesaId: string) {
    if (window.confirm("Tem certeza que deseja deletar esta despesa?")) {
      const { error } = await supabase
        .from('despesas_clinica')
        .delete()
        .eq('id', despesaId);

      if (error) {
        toast.error("Erro ao deletar despesa: " + error.message);
      } else {
        toast.success("Despesa deletada com sucesso!");
        fetchDespesas(filtroDespesas.mes, filtroDespesas.ano); // Recarrega a lista
      }
    }
  }

  async function handleAddDespesa() { 
    if (!novaDespesa.descricao || !novaDespesa.valor) return toast.error('Descrição e Valor são obrigatórios.'); 
    const { data: { user } } = await supabase.auth.getUser(); 
    if (!user) return toast.error("Usuário não autenticado"); 
    const { data: perfil } = await supabase.from('perfis').select('clinica_id').eq('id', user.id).single(); 
    if (!perfil || !perfil.clinica_id) return toast.error("Usuário sem clínica associada."); 
    const { error } = await supabase.from('despesas_clinica').insert({ descricao: novaDespesa.descricao, valor: parseFloat(novaDespesa.valor), data_despesa: novaDespesa.data, clinica_id: perfil.clinica_id }); 
    if (error) { toast.error(error.message); } 
    else { 
      toast.success("Despesa lançada com sucesso!"); 
      setNovaDespesa({ descricao: '', valor: '', data: new Date().toISOString().split('T')[0] }); 
      fetchDespesas(filtroDespesas.mes, filtroDespesas.ano); 
    } 
  }
  
  async function handleGerarRelatorio() {
    setLoadingRelatorio(true);
    const { data, error } = await supabase.rpc('gerar_fechamento_mensal', { mes: mesAnoRelatorio.mes, ano: mesAnoRelatorio.ano });
    if (error) { toast.error("Erro ao gerar relatório: " + error.message); } 
    else {
      setRelatorio(data);
      if (data && data.length > 0) { toast.success("Relatório gerado com sucesso!"); } 
      else { toast.info("Nenhum dado encontrado para este período."); }
    }
    setLoadingRelatorio(false);
  }

  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
  const totalFaturamento = relatorio.reduce((acc, r) => acc + r.valor_final_fatura, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão Financeira</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Controle despesas, fechamentos e relatórios</p>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <CardContent className="p-6">
          <Tabs defaultValue="fechamento">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="fechamento" className="flex items-center gap-2"><FileText className="h-4 w-4" />Fechamento Mensal</TabsTrigger>
              <TabsTrigger value="despesas" className="flex items-center gap-2"><Plus className="h-4 w-4" />Lançar Despesas</TabsTrigger>
            </TabsList>

            <TabsContent value="fechamento" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Gerar Relatório de Fechamento</h3>
                {relatorio.length > 0 && <Button onClick={exportarPdf} variant="outline" className="flex items-center gap-2"><Download className="h-4 w-4" />Exportar PDF</Button>}
              </div>
              <div className="flex items-end space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="space-y-2"><Label>Mês</Label><Input type="number" min="1" max="12" value={mesAnoRelatorio.mes} onChange={e => setMesAnoRelatorio({ ...mesAnoRelatorio, mes: parseInt(e.target.value) })} className="w-20"/></div>
                <div className="space-y-2"><Label>Ano</Label><Input type="number" value={mesAnoRelatorio.ano} onChange={e => setMesAnoRelatorio({ ...mesAnoRelatorio, ano: parseInt(e.target.value) })} className="w-24"/></div>
                <Button onClick={handleGerarRelatorio} disabled={loadingRelatorio} className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">{loadingRelatorio ? <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Gerando...</div> : <div className="flex items-center gap-2"><FileText className="h-4 w-4" />Gerar Relatório</div>}</Button>
              </div>
              <div className="border rounded-lg overflow-hidden"><Table><TableHeader><TableRow><TableHead>Médico</TableHead><TableHead>Aluguel</TableHead><TableHead>Parceria</TableHead><TableHead>Produtos</TableHead><TableHead>Condomínio</TableHead><TableHead>FATURA FINAL</TableHead></TableRow></TableHeader><TableBody>{loadingRelatorio ? Array.from({length: 2}).map((_, i) => <TableRow key={i}><TableCell><Skeleton className="h-4 w-32"/></TableCell><TableCell><Skeleton className="h-4 w-20"/></TableCell><TableCell><Skeleton className="h-4 w-20"/></TableCell><TableCell><Skeleton className="h-4 w-20"/></TableCell><TableCell><Skeleton className="h-4 w-20"/></TableCell><TableCell><Skeleton className="h-4 w-24"/></TableCell></TableRow>) : relatorio.length > 0 ? relatorio.map(r => <TableRow key={r.medico_id}><TableCell className="font-medium">{r.nome_medico}</TableCell><TableCell className="font-medium text-blue-600 dark:text-blue-400">R$ {r.custo_aluguel_sala.toFixed(2)}</TableCell><TableCell className="font-medium text-green-600 dark:text-green-400">R$ {r.receita_parceria.toFixed(2)}</TableCell><TableCell className="font-medium text-orange-600 dark:text-orange-400">R$ {r.custo_consumo_produtos.toFixed(2)}</TableCell><TableCell className="font-medium text-purple-600 dark:text-purple-400">R$ {r.custo_condominio.toFixed(2)}</TableCell><TableCell><Badge variant="destructive" className="font-bold">R$ {r.valor_final_fatura.toFixed(2)}</Badge></TableCell></TableRow>) : <TableRow><TableCell colSpan={6} className="text-center py-12"><div className="flex flex-col items-center gap-3"><FileText className="h-12 w-12 text-slate-300 dark:text-slate-600" /><div><p className="font-medium">Nenhum relatório gerado</p><p className="text-sm text-slate-500 dark:text-slate-400">Selecione um período e clique em "Gerar Relatório"</p></div></div></TableCell></TableRow>}</TableBody></Table></div>
            </TabsContent>

            <TabsContent value="despesas" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-primary" />Lançar Nova Despesa</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="space-y-2"><Label>Descrição</Label><Input value={novaDespesa.descricao} onChange={e => setNovaDespesa({ ...novaDespesa, descricao: e.target.value })} placeholder="Ex: Conta de luz"/></div>
                  <div className="space-y-2"><Label>Valor (R$)</Label><Input type="number" value={novaDespesa.valor} onChange={e => setNovaDespesa({ ...novaDespesa, valor: e.target.value })} placeholder="0.00"/></div>
                  <div className="space-y-2"><Label>Data</Label><Input type="date" value={novaDespesa.data} onChange={e => setNovaDespesa({ ...novaDespesa, data: e.target.value })} /></div>
                  <div className="flex items-end"><Button onClick={handleAddDespesa} className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"><Plus className="h-4 w-4 mr-2" />Lançar</Button></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-end space-x-2">
                  <div className="space-y-2"><Label>Filtrar Mês</Label><Input type="number" min="1" max="12" value={filtroDespesas.mes} onChange={e => setFiltroDespesas({ ...filtroDespesas, mes: parseInt(e.target.value) })} className="w-20"/></div>
                  <div className="space-y-2"><Label>Ano</Label><Input type="number" value={filtroDespesas.ano} onChange={e => setFiltroDespesas({ ...filtroDespesas, ano: parseInt(e.target.value) })} className="w-24"/></div>
                  <Button onClick={() => fetchDespesas(filtroDespesas.mes, filtroDespesas.ano)}>Filtrar</Button>
                </div>
                <div className="border rounded-lg overflow-hidden"><Table><TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Descrição</TableHead><TableHead>Valor</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{loadingDespesas ? Array.from({length: 3}).map((_, i) => <TableRow key={i}><TableCell><Skeleton className="h-4 w-24"/></TableCell><TableCell><Skeleton className="h-4 w-48"/></TableCell><TableCell><Skeleton className="h-4 w-24"/></TableCell><TableCell><Skeleton className="h-8 w-8 ml-auto"/></TableCell></TableRow>) : despesas.length > 0 ? despesas.map(d => <TableRow key={d.id}><TableCell><div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-slate-400" />{new Date(d.data_despesa).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div></TableCell><TableCell className="font-medium">{d.descricao}</TableCell><TableCell><Badge variant="secondary">R$ {d.valor.toFixed(2)}</Badge></TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteDespesa(d.id)}><Trash2 className="h-4 w-4"/></Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="text-center py-12"><div className="flex flex-col items-center gap-3"><CircleDollarSign className="h-12 w-12 text-slate-300 dark:text-slate-600" /><div><p className="font-medium">Nenhuma despesa encontrada</p><p className="text-sm text-slate-500 dark:text-slate-400">Lance a primeira despesa ou altere o filtro</p></div></div></TableCell></TableRow>}</TableBody></Table></div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}