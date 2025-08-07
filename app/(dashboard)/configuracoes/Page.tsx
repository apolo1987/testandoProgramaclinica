// src/pages/SettingsPage.tsx

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Building, PlusCircle } from "lucide-react";

type Clinica = { id: string, nome_clinica: string };

export function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [newClinicName, setNewClinicName] = useState("");
  const [userProfile, setUserProfile] = useState<{ clinica_id: string | null } | null>(null);

  // Busca o perfil do usuário para saber se ele já tem uma clínica
  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: perfil } = await supabase
          .from('perfis')
          .select('clinica_id')
          .eq('id', user.id)
          .single();
        setUserProfile(perfil);
      }
    }
    fetchProfile();
  }, []);

  async function handleCreateClinic() {
    if (!newClinicName.trim()) {
      return toast.error("O nome da clínica é obrigatório.");
    }
    setLoading(true);

    const { data, error } = await supabase.functions.invoke('create-clinic', {
      body: { nome_clinica: newClinicName }
    });

    if (error) {
      toast.error("Falha ao criar clínica: " + error.message);
    } else {
      toast.success("Clínica criada com sucesso! A página será recarregada.");
      setTimeout(() => {
        window.location.reload(); // Recarrega a página para o layout atualizar com os novos dados
      }, 2000);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Gerencie suas clínicas e perfil.
        </p>
      </div>

      {/* Mostra a criação de clínica apenas se o usuário NÃO tiver uma */}
      {userProfile && userProfile.clinica_id === null && (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Criar Nova Clínica
            </CardTitle>
            <CardDescription>
              Você ainda não está associado a uma clínica. Crie uma para começar a gerenciar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-grow space-y-2">
                <Label htmlFor="clinic-name">Nome da Clínica</Label>
                <Input 
                  id="clinic-name"
                  placeholder="Ex: Clínica HyperWorks"
                  value={newClinicName}
                  onChange={(e) => setNewClinicName(e.target.value)}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button 
                onClick={handleCreateClinic} 
                disabled={loading}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                {loading ? "Criando..." : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Criar Clínica
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Você pode adicionar outras configurações aqui no futuro */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <CardHeader>
            <CardTitle>Minhas Clínicas</CardTitle>
        </CardHeader>
        <CardContent>
            {userProfile?.clinica_id ? (
                <p>Você está associado a uma clínica. No futuro, você poderá ver os detalhes aqui.</p>
            ) : (
                <p className="text-muted-foreground">Você ainda não faz parte de nenhuma clínica.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}