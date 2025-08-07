// supabase/functions/signup-handler/index.ts

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

    let clinica_id_final: string;
    let user_function: string;

    // Passo 1: Verificar se a clínica já existe
    const { data: clinicaExistente, error: findError } = await supabaseAdmin
      .from('clinicas')
      .select('id')
      .eq('nome_clinica', nome_clinica)
      .single()

    if (findError && findError.code !== 'PGRST116') { // PGRST116 é o erro "nenhuma linha encontrada", o que é bom para nós
      throw findError;
    }

    if (clinicaExistente) {
      // A clínica JÁ EXISTE. O usuário será um 'medico'.
      clinica_id_final = clinicaExistente.id;
      user_function = 'medico';
    } else {
      // A clínica NÃO EXISTE. Vamos criá-la e o usuário será o 'admin'.
      const { data: novaClinica, error: createError } = await supabaseAdmin
        .from('clinicas')
        .insert({ nome_clinica: nome_clinica })
        .select()
        .single()

      if (createError || !novaClinica) throw new Error("Falha ao criar a nova clínica.")

      clinica_id_final = novaClinica.id;
      user_function = 'admin';
    }

    // Passo 2: Criar o usuário
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    })

    if (authError || !authData.user) throw new Error("Falha ao criar o usuário: " + authError?.message)

    // Passo 3: Criar o perfil do usuário com a função e clínica corretas
    const { error: profileError } = await supabaseAdmin.from('perfis').insert({
      id: authData.user.id,
      nome_completo: nome_completo,
      funcao: user_function,
      clinica_id: clinica_id_final
    })

    if (profileError) {
      // Se o perfil falhar, deleta o usuário para não deixar dados órfãos
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error("Falha ao criar o perfil do usuário: " + profileError.message)
    }

    return new Response(JSON.stringify({ message: `Usuário registrado como ${user_function} da clínica ${nome_clinica}` }), {
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