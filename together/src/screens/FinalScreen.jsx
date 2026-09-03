import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

function FinalScreen() {
  const [etapa, setEtapa] = useState(0)
  const [respostas, setRespostas] = useState(null)
  const [tocando, setTocando] = useState(false)

  const audioRef = useRef(null)

  useEffect(() => {
    async function buscarRespostas() {
      const { data, error } = await supabase
        .from('respostas')
        .select('*')
        .eq('pergunta_id', 10)

      if (error) {
        console.error('erro ao buscar respostas:', error)
        return
      }

      const kaua = data.find(
        (item) => item.usuario === 'kaua'
      )

      const giovanna = data.find(
        (item) => item.usuario === 'giovanna'
      )

      setRespostas({
        kaua: kaua?.resposta,
        giovanna: giovanna?.resposta,
      })
    }

    buscarRespostas()
  }, [])

  function tocarAudio() {
    if (!audioRef.current) return

    if (tocando) {
      audioRef.current.pause()
      setTocando(false)
    } else {
      audioRef.current.play()
      setTocando(true)
    }
  }

  if (etapa === 0) {
    return (
      <div className="final-screen">
        <div className="final-content">
          <p className="final-small">
            acabou
          </p>

          <h1>ou quase</h1>

          <p>
            10 perguntas depois e eu ainda deixei uma coisa pra depois
          </p>

          <button onClick={() => setEtapa(1)}>
            abrir surpresa
          </button>
        </div>
      </div>
    )
  }

  if (etapa === 1) {
    return (
      <div className="final-screen">
        <div className="final-content">
          <p className="future-date">
            03 de setembro de 2036
          </p>

          <h1>oi, giovanna.</h1>

          <p>
            se a gente realmente estiver lendo isso juntos daqui 10 anos,
            eu provavelmente vou estar rindo de alguma coisa que eu escrevi aqui.
          </p>

          <p>
            mas já que a gente chegou até aqui...
          </p>

          <button onClick={() => setEtapa(2)}>
            abrir cápsula
          </button>
        </div>
      </div>
    )
  }

  if (etapa === 2) {
    return (
      <div className="final-screen">
        <div className="capsule-content">
          <p className="future-date">
            cápsula do tempo
          </p>

          <h1>
            pra gente ler de novo em 2036
          </h1>

          <div className="capsule-answers">
            <div className="capsule-answer">
              <span>kauã, 2026</span>
              <p>{respostas?.kaua || '...'}</p>
            </div>

            <div className="capsule-answer">
              <span>giovanna, 2026</span>
              <p>{respostas?.giovanna || '...'}</p>
            </div>
          </div>

          <button onClick={() => setEtapa(3)}>
            continuar
          </button>
        </div>
      </div>
    )
  }

  if (etapa === 3) {
    return (
      <div className="final-screen">
        <div className="final-content">
          <p className="final-small">
            03.09.2026
          </p>

          <h1>
            então guarda isso comigo
          </h1>

          <p>
            eu não faço ideia de como vai estar nossa vida daqui 10 anos.
          </p>

          <p>
            mas eu espero que um dia a gente consiga olhar pra isso junto e
            lembrar de quando escreveu tudo isso aqui.
          </p>

          <p className="final-signature">
            te amo, momozi.
            <br />
            — kauã
          </p>

          <button onClick={() => setEtapa(4)}>
            tem mais uma
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="final-screen">
      <div className="last-surprise">

        <img
          src="/final-photo.jpg"
          alt="nós"
        />

        <h1>
          só queria que vc ouvisse isso
        </h1>

        <button
          className="audio-button"
          onClick={tocarAudio}
        >
          {tocando ? 'pausar' : 'ouvir'}
        </button>

        <audio
          ref={audioRef}
          src="/final-audio.mp3"
          onEnded={() => setTocando(false)}
        />

      </div>
    </div>
  )
}

export default FinalScreen