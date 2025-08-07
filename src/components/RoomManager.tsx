// src/components/RoomManager.tsx

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Trash2, PlusCircle, Edit, Hospital, MapPin, Calendar } from 'lucide-react'
import { toast } from "sonner"
import { Skeleton } from "./ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type Sala = { id: string; nome_sala: string; descricao: string | null; created_at: string; }

export function RoomManager() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State unificado para o Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSala, setEditingSala] = useState<Sala | null>(null); // Se não for nulo, estamos editando
  const [formData, setFormData] = useState({ nome: '', descricao: '' });

  async function fetchSalas() { 
    setLoading(true); 
    await new Promise(resolve => setTimeout(resolve, 500)); 
    const { data, error } = await supabase.from('salas').select('*').order('created_at', { ascending: true }); 
    if (error) { toast.error('Não foi possível carregar as salas.'); } 
    else if (data) { setSalas(data); } 
    setLoading(false); 
  }

  useEffect(() => { fetchSalas(); }, []);

  // Abre o dialog para ADICIONAR uma nova sala
  function handleOpenAddDialog() {
    setEditingSala(null);
    setFormData({ nome: '', descricao: '' });
    setIsDialogOpen(true);
  }

  // Abre o dialog para EDITAR uma sala existente
  function handleOpenEditDialog(sala: Sala) {
    setEditingSala(sala);
    setFormData({ nome: sala.nome_sala, descricao: sala.descricao || '' });
    setIsDialogOpen(true);
  }

  // Função única para salvar (cria ou atualiza)
  async function handleSaveSala() {
    if (!formData.nome.trim()) return toast.error('O nome da sala é obrigatório.');
    
    const { data: { user } } = await supabase.auth.getUser(); 
    if (!user) return toast.error("Usuário não autenticado"); 
    const { data: perfil } = await supabase.from('perfis').select('clinica_id').eq('id', user.id).single(); 
    if (!perfil || !perfil.clinica_id) return toast.error("Usuário sem clínica associada.");

    let error;

    if (editingSala) {
      // MODO EDIÇÃO
      const { error: updateError } = await supabase
        .from('salas')
        .update({ nome_sala: formData.nome, descricao: formData.descricao })
        .eq('id', editingSala.id);
      error = updateError;
    } else {
      // MODO CRIAÇÃO
      const { error: insertError } = await supabase
        .from('salas')
        .insert({ nome_sala: formData.nome, descricao: formData.descricao, clinica_id: perfil.clinica_id });
      error = insertError;
    }
    
    if (error) { toast.error('Erro ao salvar sala: ' + error.message); } 
    else { 
      toast.success(`Sala ${editingSala ? 'atualizada' : 'adicionada'} com sucesso!`);
      setIsDialogOpen(false); 
      await fetchSalas(); 
    } 
  }

  async function handleDeleteSala(salaId: string) { 
    if (window.confirm('Tem certeza que deseja deletar esta sala?')) { 
      const { error } = await supabase.from('salas').delete().eq('id', salaId); 
      if (error) { toast.error('Erro ao deletar sala: ' + error.message); } 
      else { 
        toast.success("Sala removida com sucesso!"); 
        await fetchSalas(); 
      } 
    } 
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciador de Salas</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gerencie as salas e consultórios da clínica</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Hospital className="h-4 w-4" />
          {salas.length} salas
        </Badge>
      </div>

      {/* Main Card */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Salas Cadastradas</CardTitle>
            <Button onClick={handleOpenAddDialog} className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Sala
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="border-slate-200/60 dark:border-slate-700/60"><TableHead>Nome</TableHead><TableHead>Descrição</TableHead><TableHead>Data de Criação</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}><TableCell><Skeleton className="h-4 w-32" /></TableCell><TableCell><Skeleton className="h-4 w-48" /></TableCell><TableCell><Skeleton className="h-4 w-24" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell></TableRow>
                  ))
                ) : salas.length > 0 ? ( 
                  salas.map((sala) => (
                    <TableRow key={sala.id} className="border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="font-medium">{sala.nome_sala}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{sala.descricao || <span className="italic text-slate-400 dark:text-slate-500">Sem descrição</span>}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400"><div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(sala.created_at).toLocaleDateString('pt-BR')}</div></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleOpenEditDialog(sala)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteSala(sala.id)} className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) 
                ) : ( 
                  <TableRow><TableCell colSpan={4} className="text-center py-12"><div className="flex flex-col items-center gap-3"><Hospital className="h-12 w-12 text-slate-300 dark:text-slate-600" /><div><p className="font-medium">Nenhuma sala encontrada</p><p className="text-sm text-slate-500 dark:text-slate-400">Adicione sua primeira sala para começar</p></div></div></TableCell></TableRow> 
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog para Adicionar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Hospital className="h-5 w-5 text-primary" />{editingSala ? "Editar Sala" : "Adicionar Nova Sala"}</DialogTitle>
            <DialogDescription>Preencha os detalhes da sala aqui.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="name">Nome da Sala</Label><Input id="name" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Sala 1, Consultório Azul" className="focus:ring-2 focus:ring-primary"/></div>
            <div className="space-y-2"><Label htmlFor="description">Descrição</Label><Input id="description" value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} placeholder="Ex: Sala com maca, Sala de procedimentos" className="focus:ring-2 focus:ring-primary"/></div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveSala} className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}