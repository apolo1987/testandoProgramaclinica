// src/pages/RegisterPage.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    nome_clinica: '',
    nome_completo: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Chama nossa nova Edge Function 'signup-handler'
    const { data, error } = await supabase.functions.invoke('signup-handler', {
      body: formData
    });

    if (error) {
      toast.error("Erro ao registrar: " + error.message);
    } else {
      toast.success("Registro realizado com sucesso! Verifique seu email para confirmação antes de fazer o login.");
      console.log("Resposta da função:", data);
      navigate("/login");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
       <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crie sua Conta na ClinicaOS</CardTitle>
          <CardDescription>Junte-se a uma clínica existente ou crie a sua</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_clinica">Nome da Clínica</Label>
              <Input 
                id="nome_clinica" 
                type="text" 
                placeholder="Digite o nome exato da clínica se já existir"
                required 
                value={formData.nome_clinica} 
                onChange={handleInputChange} />
            </div>
            <hr/>
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Seu Nome Completo</Label>
              <Input id="nome_completo" type="text" required value={formData.nome_completo} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Seu Email de Acesso</Label>
              <Input id="email" type="email" required value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Crie uma Senha</Label>
              <Input id="password" type="password" required value={formData.password} onChange={handleInputChange} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Criar Conta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Faça o login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}