// supabase/functions/create-clinic/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Lida com a requisição de segurança CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Pega o nome da clínica e o ID do usuário que fez a requisição
    const { nome_clinica } = await req.json()
    const authHeader = req.headers.get('Authorization')!
    const jwt = authHeader.replace('Bearer ', '')

    // Cria um cliente Supabase com a permissão do usuário logado
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error("Usuário não encontrado.")

    // --- LÓGICA PRINCIPAL ---
    // 1. Cria a nova clínica
    const { data: clinicaData, error: clinicaError } = await supabaseClient
      .from('clinicas')
      .insert({ nome_clinica: nome_clinica })
      .select()
      .single()
    if (clinicaError) throw clinicaError

    // 2. Atualiza o perfil do usuário para ser admin da nova clínica
    const { error: profileError } = await supabaseClient
      .from('perfis')
      .update({ clinica_id: clinicaData.id, funcao: 'admin' })
      .eq('id', user.id)
    if (profileError) throw profileError

    // Retorna uma resposta de sucesso
    return new Response(JSON.stringify({ message: "Clínica criada com sucesso!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // Retorna uma resposta de erro
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})