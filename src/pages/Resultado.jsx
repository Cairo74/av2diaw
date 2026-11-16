import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obterVotos, calcularResultado, desfazerUltimoVoto, zerarVotos } from '../services/votacaoService';

function Resultado() {
  const [votos, setVotos] = useState(() => obterVotos());

  const total = votos.length;
  const resultado = calcularResultado(votos);
  const craque = resultado[0];
  const vice = resultado[1];
  const vantagem = craque.votos - vice.votos;

  function handleDesfazer() {
    setVotos(desfazerUltimoVoto());
  }

  function handleZerar() {
    if (window.confirm('Apagar todos os votos?')) {
      zerarVotos();
      setVotos([]);
    }
  }

  return (
    <main className="pagina">
      <h1>Resultado</h1>
      <p>Total: {total} {total === 1 ? 'voto' : 'votos'}</p>

      {total === 0 ? (
        <p>
          Nenhum voto ainda. <Link to="/votacao">Votar</Link>
        </p>
      ) : (
        <>
          <p>
            {vantagem === 0
              ? `Empate na liderança entre ${craque.nome} e ${vice.nome}!`
              : `${craque.nome} lidera com ${vantagem} ${vantagem === 1 ? 'voto' : 'votos'} de vantagem sobre ${vice.nome}.`}
          </p>

          {resultado.map((j, i) => (
            <div key={j.id} className={`placar ${i === 0 ? 'placar-craque' : ''} ${i === 1 ? 'placar-vice' : ''}`}>
              <strong>{i + 1}º</strong>
              <img src={j.foto} alt={j.nome} />
              <div className="placar-info">
                <h3>
                  {j.nome} {i === 0 && <span className="selo">Craque do jogo</span>}
                  {i === 1 && <span className="selo">Vice</span>}
                </h3>
                <div className="barra">
                  <div className="barra-preenchida" style={{ width: `${j.percentual}%` }}></div>
                </div>
                <p>
                  {j.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% ({j.votos} {j.votos === 1 ? 'voto' : 'votos'})
                </p>
              </div>
            </div>
          ))}

          <button type="button" className="botao" onClick={handleDesfazer}>Desfazer último voto</button>
          <button type="button" className="botao" onClick={handleZerar}>Zerar votação</button>
        </>
      )}
    </main>
  );
}

export default Resultado;
