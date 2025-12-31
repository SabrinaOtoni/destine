import React, { useEffect, useMemo, useState } from "react";

import backImg from "./assets/back.png";
import card1Img from "./assets/card1.png";
import card2Img from "./assets/card2.png";
import card3Img from "./assets/card3.png";

const ALL_CARDS = [
  { id: "c1", img: card1Img },
  { id: "c2", img: card2Img },
  { id: "c3", img: card3Img },
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Leituras (fixas) do Grimório — independente da ordem das cartas na mesa */
const GRIMOIRE_PAGES = [
  {
    key: "empress",
    title: "The Empress",
    whisper: [
      "Você carrega uma energia que nutre tudo ao redor. Coisas boas se aproximam, não pela pressa, mas pela atração natural.",
    ],
    gift: [
      "Autorização para existir em plenitude. Você não precisa provar valor algum, só continuar sendo você.",
      "A imperatriz não corre atrás... ela constrói, sustenta e confia.",
    ],
    spell: [
      "Hoje, escolha uma coisa pequena que te dá alegria e trate como se fosse sagrada.",
      "Uma música, uma comida, um momento...",
    ],
  },
  {
    key: "magician",
    title: "The Magician",
    whisper: [
      "Tudo o que você precisa já está nas suas mãos: ideias, sensibilidade, coragem, vontade... nada falta.",
      "O caminho novo não pede transformação, pede intenção. Quando você decide, o universo responde.",
    ],
    gift: [
       "Coragem. O mago te lembra: você não precisa esperar o momento perfeito. Você só precisa escolher e sustentar a escolha com calma.",
    ],
    spell: [
      "Escolha UM padrão que você não leva para o seu novo ano. Depois escolha UMA coisa pequena que represente o começo. O universo entende recados curtos...",
    ],
  },
  {
    key: "star",
    title: "The Star",
    whisper: [
      "O universo adora você. E, honestamente, eu também. (Sim, eu sei. Sou só um grimório, mas fazer o que.....)",
      "Existe uma versão sua no horizonte que vai olhar pra trás com muito carinho e orgulho.",
    ],
    gift: [
      "Um sinal de que você está sendo guiada mesmo quando não percebe. Um tipo de paz que não depende do lado de fora ficar perfeito. Uma coragem tranquila que nasce quando você finalmente se escolhe.",
    ],
    spell: [
      "Quando bater dúvida, faça o básico com carinho. E depois… descanse. O destino também precisa respirar.",
    ],
  },
];

function ArcaneSigil({ active, onClick }) {
  return (
    <button
      className={`sigilButton ${active ? "active" : ""}`}
      onClick={onClick}
      aria-label={active ? "Ritual iniciado" : "Tocar o selo para iniciar"}
      type="button"
    >
      <span className="sigilAura" aria-hidden="true" />
      <svg className="sigilSvg" viewBox="0 0 200 200" role="img" aria-label="Selo Arcano">
        <defs>
          <radialGradient id="rg" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
            <stop offset="55%" stopColor="rgba(180,120,255,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,220,140,0.9)" />
            <stop offset="55%" stopColor="rgba(180,120,255,0.85)" />
            <stop offset="100%" stopColor="rgba(120,240,255,0.75)" />
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="
                1 0 0 0 0
                0 0.8 0 0 0
                0 0 1 0 0
                0 0 0 0.9 0"
              result="c"
            />
            <feMerge>
              <feMergeNode in="c" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <path id="runePath" d="M100,22 a78,78 0 1,1 -0.01,0" />
        </defs>

        <circle cx="100" cy="100" r="78" fill="url(#rg)" />

        <g className="sigilSpinSlow" filter="url(#glow)">
          <circle cx="100" cy="100" r="76" fill="none" stroke="url(#lg)" strokeWidth="1.6" opacity="0.9" />
          <circle cx="100" cy="100" r="66" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <circle cx="100" cy="100" r="56" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
        </g>

        <g className="sigilSpinRunes" filter="url(#glow)">
          <text className="runes" opacity="0.85">
            <textPath href="#runePath" startOffset="0%">
              ✦ ᚨ ᚱ ᚲ ᚨ ᚾ ᚨ ✦ ᛟ ᚱ ᚨ ᚲ ᚢ ᛚ ᛟ ✦ ᚠ ᛇ ᚾ ᚨ ✦
            </textPath>
          </text>
        </g>

        <g className="sigilPulse" filter="url(#glow)">
          <path d="M100 46 L152 140 L48 140 Z" fill="none" stroke="rgba(255,220,140,0.85)" strokeWidth="1.2" />
          <path d="M100 58 L140 132 L60 132 Z" fill="none" stroke="rgba(180,120,255,0.65)" strokeWidth="1.1" />
          <circle cx="100" cy="100" r="18" fill="none" stroke="rgba(120,240,255,0.55)" strokeWidth="1.2" />
        </g>
      </svg>

      <span className="sigilBeam" aria-hidden="true" />
      <span className="sigilHint">{active ? "O selo reconheceu você" : "Toque o selo"}</span>
    </button>
  );
}

function TarotCard({ state, onClick, label, backSrc, frontSrc }) {
  const { phase, isShaking, isRevealed } = state;

  const cardClass = [
    "tarot-card",
    isShaking ? "shake" : "",
    phase === "flipping" ? "flipping" : "",
    isRevealed ? "revealed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cardClass} onClick={onClick} aria-label={label} type="button">
      <span className="card-frame" />
      <span className="card-glow" />
      <span className="card-inner">
        <span className="card-face card-back">
          <img src={backSrc} alt="" draggable="false" />
        </span>
        <span className="card-face card-front">
          <img src={frontSrc} alt="" draggable="false" />
        </span>
      </span>
    </button>
  );
}

function GrimoireModal({ open, onClose, pages }) {
  const [pageIdx, setPageIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    setPageIdx(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setPageIdx((i) => Math.min(i + 1, pages.length - 1));
      if (e.key === "ArrowLeft") setPageIdx((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, pages.length]);

  if (!open) return null;

  const p = pages[pageIdx];

  return (
    <div className="grimoireOverlay" role="dialog" aria-modal="true" aria-label="Grimório">
      <button className="grimoireBackdrop" onClick={onClose} aria-label="Fechar grimório" type="button" />
      <div className="grimoireShell">
        <div className="grimoireTop">
          <div className="grimoireTitle">
            <div className="grimoireEyebrow">O Grimório aceitou falar. Por hoje.</div>
            <div className="grimoireH1">{p.title}</div>
          </div>

          <button className="grimoireClose" onClick={onClose} type="button" aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="grimoireBody">
          <section className="grimoireSection">
            <h3>O que a carta sussurra</h3>
            {p.whisper.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </section>

          <section className="grimoireSection">
            <h3>O que ela te dá</h3>
            {p.gift.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </section>

          <section className="grimoireSection spell">
            <h3>Feitiço prático</h3>
            {p.spell.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </section>
        </div>

        <div className="grimoireBottom">
          <div className="grimoireDots" aria-label="Páginas do grimório">
            {pages.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === pageIdx ? "on" : ""}`}
                onClick={() => setPageIdx(i)}
                aria-label={`Ir para página ${i + 1}`}
                type="button"
              />
            ))}
          </div>

          <div className="grimoireNav">
            <button
              className="secondary ghost"
              onClick={() => setPageIdx((i) => Math.max(i - 1, 0))}
              disabled={pageIdx === 0}
              type="button"
            >
              Voltar
            </button>

            <button
              className="secondary"
              onClick={() => setPageIdx((i) => Math.min(i + 1, pages.length - 1))}
              disabled={pageIdx === pages.length - 1}
              type="button"
            >
              Próxima
            </button>
          </div>
        </div>

        <div className="grimoireFooterNote">
          <p>
            O Grimório se fecha. O que precisava ser dito, foi. Feliz aniversário, Nicolly. ✦{" "}
            <span className="tiny">(Que os gatinhos do tarot sejam gentis com você.)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const dealt = useMemo(() => shuffle(ALL_CARDS), []);
  const [ritualOn, setRitualOn] = useState(false);
  const [grimoireOpen, setGrimoireOpen] = useState(false);

  const [cardStates, setCardStates] = useState(() => ({
    c1: { phase: "idle", isShaking: false, isRevealed: false },
    c2: { phase: "idle", isShaking: false, isRevealed: false },
    c3: { phase: "idle", isShaking: false, isRevealed: false },
  }));

  const revealedCount = Object.values(cardStates).filter((c) => c.isRevealed).length;

  function startRitual() {
    if (ritualOn) return;
    setRitualOn(true);
    document.documentElement.classList.add("ritual-started");
  }

  function reveal(cardId) {
    if (!ritualOn) return;
    if (cardStates[cardId].isRevealed) return;

    setCardStates((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], phase: "shaking", isShaking: true },
    }));

    setTimeout(() => {
      setCardStates((prev) => ({
        ...prev,
        [cardId]: { ...prev[cardId], phase: "flipping", isShaking: false, isRevealed: true },
      }));
    }, 520);

    setTimeout(() => {
      setCardStates((prev) => ({
        ...prev,
        [cardId]: { ...prev[cardId], phase: "revealed", isRevealed: true },
      }));
    }, 1100);
  }

  function resetAll() {
    setGrimoireOpen(false);
    setRitualOn(false);
    document.documentElement.classList.remove("ritual-started");
    setCardStates({
      c1: { phase: "idle", isShaking: false, isRevealed: false },
      c2: { phase: "idle", isShaking: false, isRevealed: false },
      c3: { phase: "idle", isShaking: false, isRevealed: false },
    });
  }

  return (
    <div className="app">
      <div className="bg">
        <div className="mist" />
        <div className="stars" />
        <div className="vignette" />
      </div>

      <header className="header">
        <ArcaneSigil active={ritualOn} onClick={startRitual} />
        <p className="subtitle">{!ritualOn ? "Há algo aqui para você." : "Agora é só virar as cartas."}</p>
      </header>

      <main className="main">
        <div className={`altar ${!ritualOn ? "lockedBefore" : ""}`}>
          {dealt.map((c, idx) => {
            const slotId = idx === 0 ? "c1" : idx === 1 ? "c2" : "c3";
            return (
              <TarotCard
                key={slotId}
                state={cardStates[slotId]}
                onClick={() => reveal(slotId)}
                label={`Carta ${idx + 1}`}
                backSrc={backImg}
                frontSrc={c.img}
              />
            );
          })}
        </div>

        <div className="below">
          {!ritualOn ? (
            <p className="prompt">
              As cartas estão seladas. <span className="spark">Toque o selo</span> para começar.
            </p>
          ) : revealedCount < 3 ? (
            <p className="prompt">
              Escolha uma carta… e depois outra. <span className="spark">{3 - revealedCount} ainda aguardam.</span>
            </p>
          ) : (
            <div className="after">
              <p className="prompt">O Grimório aceitou falar. Por hoje.</p>
              <button className="secondary primary" onClick={() => setGrimoireOpen(true)} type="button">
                Abrir o Grimório
              </button>

              <button className="secondary" onClick={resetAll} type="button">
                Recomeçar o ritual
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <span className="footer-line" />
        <p className="footer-text">feito para uma pessoa especial ✦</p>
      </footer>

      <GrimoireModal open={grimoireOpen} onClose={() => setGrimoireOpen(false)} pages={GRIMOIRE_PAGES} />
    </div>
  );
}