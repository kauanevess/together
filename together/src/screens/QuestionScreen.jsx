import { useEffect, useState } from 'react'
import questions from '../data/questions'
import { supabase } from '../lib/supabase'

function QuestionScreen({ user, onFinish }) {
  const [indice, setIndice] = useState(0)
  const [resposta, setResposta] = useState('')
  const [respostas, setRespostas] = useState([])
  const [carregando, setCarregando] = useState(true)

  const perguntaAtual = questions[indice]

  const respostaKaua = respostas.find(
    (item) =>
      item.pergunta_id === perguntaAtual.id &&
      item.usuario === 'kaua'
  )

  const respostaGiovanna = respostas.find(
    (item) =>
      item.pergunta_id === perguntaAtual.id &&
      item.usuario === 'giovanna'
  )

  const respostaUsuario = respostas.find(
    (item) =>
      item.pergunta_id === perguntaAtual.id &&
      item.usuario === user
  )

  const osDoisResponderam =
    respostaKaua && respostaGiovanna

  async function carregarRespostas() {
    const { data, error } = await supabase
      .from('respostas')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('erro ao carregar respostas:', error)
      setCarregando(false)
      return
    }

    setRespostas(data || [])
  }

  async function carregarSessao() {
    const { data, error } = await supabase
      .from('sessao')
      .select('pergunta_atual')
      .eq('id', 2)
      .single()

    if (error) {
      console.error('erro ao carregar sessão:', error)
      setCarregando(false)
      return
    }

    if (data) {
      setIndice(data.pergunta_atual - 1)
    }

    setCarregando(false)
  }

  async function enviarResposta() {
    if (!resposta.trim()) return

    const { error } = await supabase
      .from('respostas')
      .insert({
        pergunta_id: perguntaAtual.id,
        usuario: user,
        resposta: resposta.trim(),
      })

    if (error) {
      console.error('erro ao responder:', error)
      return
    }

    setResposta('')
    await carregarRespostas()
  }

  async function proximaPergunta() {
    if (indice >= questions.length - 1) return

    const novaPergunta = indice + 2

    const { data, error } = await supabase
      .from('sessao')
      .update({
        pergunta_atual: novaPergunta,
      })
      .eq('id', 2)
      .select('pergunta_atual')
      .single()

    if (error) {
      console.error('erro ao avançar:', error)
      return
    }

    setIndice(data.pergunta_atual - 1)
    setResposta('')
  }

  async function perguntaAnterior() {
    if (indice <= 0) return

    const novaPergunta = indice

    const { data, error } = await supabase
      .from('sessao')
      .update({
        pergunta_atual: novaPergunta,
      })
      .eq('id', 2)
      .select('pergunta_atual')
      .single()

    if (error) {
      console.error('erro ao voltar:', error)
      return
    }

    setIndice(data.pergunta_atual - 1)
    setResposta('')
  }

  useEffect(() => {
    async function iniciar() {
      await carregarRespostas()
      await carregarSessao()
    }

    iniciar()
  }, [])

  useEffect(() => {
    const canalRespostas = supabase
      .channel('respostas-tempo-real')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'respostas',
        },
        () => {
          carregarRespostas()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canalRespostas)
    }
  }, [])

  useEffect(() => {
    const canalSessao = supabase
      .channel('sessao-tempo-real')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessao',
        },
        (payload) => {
          if (payload.new.id !== 2) return

          const novaPergunta =
            payload.new.pergunta_atual

          setIndice(novaPergunta - 1)
          setResposta('')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canalSessao)
    }
  }, [])

  if (carregando) {
    return (
      <div className="question-screen">
        <div className="question-content">
          <p>carregando...</p>
        </div>
      </div>
    )
  }

  if (
    osDoisResponderam &&
    indice === questions.length - 1
  ) {
    return (
      <div className="question-screen">
        <div className="question-content">

          <p className="question-number">
            pergunta 10
          </p>

          <h1>
            {perguntaAtual.texto}
          </h1>

          <div className="answer-status">
            <p>Kauã ✅</p>
            <p>Giovanna ✅</p>
          </div>

          <p className="last-question-message">
            essa eu vou guardar pra depois
          </p>

          <button
            className="finish-button"
            onClick={onFinish}
          >
            terminar
          </button>

        </div>
      </div>
    )
  }

  if (osDoisResponderam) {
    return (
      <div className="question-screen">
        <div className="question-content">

          <p className="question-number">
            pergunta {String(indice + 1).padStart(2, '0')}
          </p>

          <h1>
            {perguntaAtual.texto}
          </h1>

          <div className="answers-reveal">

            <div className="answer-card">
              <span>Kauã</span>
              <p>{respostaKaua.resposta}</p>
            </div>

            <div className="answer-card">
              <span>Giovanna</span>
              <p>{respostaGiovanna.resposta}</p>
            </div>

          </div>

          <div className="question-navigation">

            {indice > 0 && (
              <button onClick={perguntaAnterior}>
                voltar
              </button>
            )}

            <button onClick={proximaPergunta}>
              próxima
            </button>

          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="question-screen">
      <div className="question-content">

        <span className="question-user">
          {user === 'kaua' ? 'Kauã' : 'Giovanna'}
        </span>

        <p className="question-number">
          pergunta {String(indice + 1).padStart(2, '0')}
        </p>

        <h1>
          {perguntaAtual.texto}
        </h1>

        {!respostaUsuario ? (
          <>
            <textarea
              value={resposta}
              onChange={(event) =>
                setResposta(event.target.value)
              }
              placeholder="escreve aqui..."
            />

            <button onClick={enviarResposta}>
              responder
            </button>
          </>
        ) : (
          <div className="waiting-screen">

            <p>
              sua resposta foi salva
            </p>

            <div className="answer-status">

              <p>
                Kauã {respostaKaua ? '✅' : '❌'}
              </p>

              <p>
                Giovanna {respostaGiovanna ? '✅' : '❌'}
              </p>

            </div>

            <span>
              esperando a outra pessoa...
            </span>

          </div>
        )}

      </div>
    </div>
  )
}

export default QuestionScreen