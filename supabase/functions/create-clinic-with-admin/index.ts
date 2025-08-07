// supabase/functions/create-clinic-with-admin/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { nome_clinica, nome_completo, email, password } = await req.json()
    if (!nome_clinica || !nome_completo || !email || !password) {
      throw new Error("Todos os campos são obrigatórios.")
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Passo 1: Criar a clínica primeiro
    const { data: clinicaData, error: clinicaError } = await supabaseAdmin
      .from('clinicas')
      .insert({ nome_clinica: nome_clinica })
      .select()
      .single()

    if (clinicaError || !clinicaData) throw new Error("Falha ao criar a clínica: " + clinicaError?.message)

    // Passo 2: Criar o usuário (o futuro admin)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    })

    if (authError || !authData.user) throw new Error("Falha ao criar o usuário: " + authError?.message)

    // Passo 3: Criar o perfil do usuário, associando-o à nova clínica como 'admin'
    const { error: profileError } = await supabaseAdmin.from('perfis').insert({
      id: authData.user.id,
      nome_completo: nome_completo,
      funcao: 'admin',
      clinica_id: clinicaData.id
    })

    if (profileError) {
      // Se a criação do perfil falhar, deleta o usuário e a clínica para não deixar dados órfãos
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      await supabaseAdmin.from('clinicas').delete().eq('id', clinicaData.id)
      throw new Error("Falha ao criar o perfil do usuário: " + profileError.message)
    }

    return new Response(JSON.stringify({ message: "Clínica e administrador criados com sucesso!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})