function StartScreen({ onSelectUser }) {
  return (
    <div className="start-screen">

      <div className="start-content">

        <span className="start-small">
          together
        </span>

        <h1>
          quem tá entrando?
        </h1>

        <p>
          escolhe aí antes de começar
        </p>

        <div className="user-options">

          <button
            onClick={() => onSelectUser('kaua')}
          >
            Kauã
          </button>

          <button
            onClick={() => onSelectUser('giovanna')}
          >
            Giovanna
          </button>

        </div>

      </div>

    </div>
  )
}

export default StartScreen