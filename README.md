# 🌾 Agrinho 2026 — Conexões no Campo

> **"Agro que alimenta, gente que cuida."**
> Portal educacional desenvolvido para o Programa Agrinho 2026, conectando o campo e a sala de aula por meio de tecnologia, ciência e sustentabilidade.

---

## 📋 Índice

- [Objetivo do Projeto](#-objetivo-do-projeto)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Preview do Código](#-preview-do-código)
- [Paleta de Cores](#-paleta-de-cores)
- [Estilo Visual](#-estilo-visual)
- [Ferramentas](#-ferramentas)
  - [Calculadora de Sementes](#-calculadora-de-sementes)
  - [Calendário de Variedades](#-calendário-de-variedades)
- [Acessibilidade](#-acessibilidade)
- [Fontes e Referências](#-fontes-e-referências)

---

## 🎯 Objetivo do Projeto

O site foi criado como material de apoio educacional ao **Programa Agrinho 2026**, iniciativa do Sistema FAEP/SENAR-PR que conecta estudantes da rede pública ao universo do agronegócio.

Os objetivos principais são:

- Aproximar o conteúdo agrícola da realidade escolar de forma interativa
- Oferecer ferramentas práticas e gratuitas para cálculos e consultas agrícolas
- Promover valores de **sustentabilidade**, **cidadania** e **respeito ao meio ambiente**
- Ser acessível a todos os estudantes, incluindo pessoas com deficiência visual ou motora
- Funcionar como um projeto completo de desenvolvimento web para fins educacionais

## 💻 Preview do Código

### HTML — Estrutura do Header com botões de tema e acessibilidade

```html
<header class="site-header" role="banner">
  <div class="header-inner container">

    <div class="brand" aria-label="Agrinho 2026 — Conexões no Campo">
      <span class="brand-icon" aria-hidden="true">🌾</span>
      <div class="brand-text">
        <span class="brand-title">Agrinho 2026</span>
        <span class="brand-sub">Conexões no Campo</span>
      </div>
    </div>

    <nav class="main-nav" aria-label="Menu principal">
      <a href="#inicio"      class="nav-link" id="nav-inicio">Início</a>
      <a href="#calculadora" class="nav-link" id="nav-calculadora">Calculadora</a>
      <a href="#calendario"  class="nav-link" id="nav-calendario">Calendário</a>
    </nav>

    <!-- Modo escuro/claro -->
    <button class="theme-toggle" id="themeToggle" onclick="toggleTheme()">
      <span class="theme-icon" aria-hidden="true">🌙</span>
      <span class="theme-label">Modo Escuro</span>
    </button>

    <!-- Acessibilidade visual -->
    <button class="access-toggle" id="accessToggle" onclick="toggleAcessivel()"
            aria-pressed="false" aria-label="Ativar modo de acessibilidade visual">
      <span aria-hidden="true">🔠</span>
      <span class="access-label">Acessibilidade</span>
    </button>

  </div>
</header>
```

### CSS — Sistema de tokens de cor (modo claro e escuro)

```css
/* Modo claro */
:root {
  --verde-700:  #2e7d32;
  --ouro:       #f9a825;
  --bg:         #f5f7f2;
  --bg-card:    #ffffff;
  --txt-primary:#1a2a1a;
}

/* Modo escuro — sobrescreve apenas as variáveis necessárias */
[data-theme="dark"] {
  --bg:          #0f1a0f;
  --bg-card:     #182318;
  --txt-primary: #e8f0e8;
}
```

### CSS — Animação de entrada ao rolar (reveal)

```css
/* Só ativa se o JS estiver carregado (classe js-pronto no <html>) */
.js-pronto .reveal {
  opacity: 0;
  filter: blur(2px);
  transition: opacity 0.55s ease, filter 0.55s ease;
}
.js-pronto .reveal.visible {
  opacity: 1;
  filter: blur(0);
}
```

### JavaScript — Modo escuro com memória no navegador

```javascript
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('agrinho-theme', theme);

  const btn = document.getElementById('themeToggle');
  btn.querySelector('.theme-icon').textContent  = theme === 'dark' ? '☀️' : '🌙';
  btn.querySelector('.theme-label').textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
}

window.toggleTheme = function () {
  const atual = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(atual === 'dark' ? 'light' : 'dark');
};
```

### JavaScript — Cálculo de sementes com verificação de densidade

```javascript
const sementesBase   = Math.ceil(area / (espacamento * linhas));
const sementesMais10 = Math.ceil(sementesBase * 1.10);
const sementesMais15 = Math.ceil(sementesBase * 1.15);

// Verifica se a densidade está dentro da faixa ideal da cultura
const densAtual = (sementesBase / area).toFixed(1);
const status = densAtual >= d.min && densAtual <= d.max
  ? '✔ Dentro do recomendado'
  : '⚠ Verifique espaçamento';
```

### JavaScript — Destaque do link ativo na nav por scroll

```javascript
function atualizarNavAtiva() {
  const secoes = ['inicio', 'calculadora', 'calendario'];
  let atualId = 'inicio';

  secoes.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
      atualId = id;
    }
  });

  secoes.forEach(id => {
    const link = document.getElementById('nav-' + id);
    if (link) link.classList.toggle('active', id === atualId);
  });
}

window.addEventListener('scroll', atualizarNavAtiva, { passive: true });
```

---

## 🎨 Paleta de Cores

| Token | Valor | Uso | Por quê |
|---|---|---|---|
| `--verde-900` | `#1b4d1e` | Header, footer, hero | Verde escuro remete à terra, matas e plantações |
| `--verde-700` | `#2e7d32` | Botões, destaques, links | Cor principal da identidade visual agrícola |
| `--verde-500` | `#4caf50` | Ícones, badges de risco baixo | Tom mais vivo para elementos secundários |
| `--ouro` | `#f9a825` | Botões primários, destaques, foco | Remete ao trigo maduro e ao sol do campo |
| `--bg` | `#f5f7f2` | Fundo geral | Tom levemente esverdeado, suave e natural |
| `--bg-card` | `#ffffff` | Cards, painéis | Branco limpo para legibilidade máxima |

**Por que verde e dourado?**
O verde é universalmente associado ao campo, à agricultura e à natureza — reforçando a identidade do Agrinho. O dourado (ouro) remete ao trigo maduro e ao sol do campo, criando contraste acessível com o verde escuro. Juntos formam uma paleta que comunica natureza, colheita e vitalidade sem ser genérica.

No **modo escuro**, as cores são invertidas para tonalidades de verde muito escuro (`#0f1a0f`), mantendo a identidade sem cansar a visão em ambientes com pouca luz.

---

## 🖌️ Estilo Visual

O site foi construído com uma estética de **empresa real do agronegócio**, evitando a aparência genérica de projetos escolares.

**Tipografia:**
- **Playfair Display** (títulos) — serifada elegante, remete a publicações agrícolas tradicionais e confere autoridade
- **DM Sans** (corpo) — sans-serif moderna e legível em qualquer tamanho, ideal para interfaces digitais

**Componentes visuais:**
- Cards com borda superior colorida ao hover, indicando interatividade
- Hero com imagem de campo real (Unsplash, licença livre) e overlay verde semitransparente
- Animação de entrada `reveal` usando `opacity + filter: blur` ao rolar — suave e sem conflitar com hovers
- Separadores visuais com ícone central entre seções para guiar a leitura
- Botão "Voltar ao topo" fixo, aparece após 400px de scroll
- Barra de estatísticas abaixo do hero comunicando o alcance do site imediatamente

---

## 🛠️ Ferramentas

### 🧮 Calculadora de Sementes

**O que faz:** Calcula a quantidade de sementes necessárias para uma área de plantio com base na cultura, espaçamento entre plantas e espaçamento entre linhas.

**Por que foi criada:** Agricultores e estudantes frequentemente precisam estimar insumos antes do plantio. Errar para baixo causa replantio caro; errar para cima gera desperdício. A calculadora resolve isso com uma fórmula simples e apresenta os resultados de forma visual.

**Fórmula base:**
```
Sementes = Área ÷ (Espaçamento entre plantas × Espaçamento entre linhas)
```

**Funcionalidades:**
- Suporte a 6 culturas: Soja, Milho, Feijão, Trigo, Arroz e Algodão
- Sugestão automática de espaçamento ao selecionar a cultura
- Resultado principal + margem de 10% e 15% (para cobrir falhas de germinação)
- Conversão automática de m² para hectares
- Verificação se a densidade calculada está dentro da faixa ideal da Embrapa
- Badge colorido indicando se o espaçamento é adequado (`✔ Dentro do recomendado` ou `⚠ Verifique espaçamento`)
- Botão "Limpar" para reiniciar sem recarregar a página
- Validação de formulário acessível com mensagens de erro por campo

**Estilo:** Layout em duas colunas (formulário + resultado), com o resultado aparecendo com animação ao ser calculado (`aria-live` para leitores de tela).

---

### 📅 Calendário de Variedades

**O que faz:** Exibe a melhor época de plantio para 6 culturas em todos os 27 estados do Brasil, com indicador de risco climático e observações técnicas.

**Por que foi criado:** O zoneamento agrícola é complexo e as fontes oficiais (ZARC/MAPA) são técnicas demais para estudantes. O calendário traduz esse conhecimento em uma interface simples e visual.

**Fontes dos dados:**
- ZARC — Zoneamento Agrícola de Risco Climático (MAPA, safra 2025/2026)
- Embrapa Soja, Embrapa Cerrados, Embrapa Clima Temperado
- INMET — Instituto Nacional de Meteorologia

**Funcionalidades:**
- Seleção por cultura (6 opções) e por estado (todos os 27)
- Padrão inicial: **Paraná** — estado sede do Programa Agrinho
- Card de resultado com época, nível de risco e observação técnica
- Tabela comparativa mostrando todos os 27 estados de uma vez para a cultura selecionada
- Indicador de risco em 3 níveis: 🟢 Baixo, 🟡 Médio, 🔴 Alto
- Estados ordenados alfabeticamente com sigla destacada em badge
- Atualização em tempo real ao trocar cultura ou estado (sem recarregar)
- `aria-live` no resultado para anúncio automático em leitores de tela

**Estilo:** Filtros no topo em grid de 2 colunas, resultado em card colorido por tipo de dado, tabela responsiva com scroll horizontal em telas pequenas.

---

## ♿ Acessibilidade

O site implementa **7 recursos de acessibilidade** cobrindo 4 tipos de necessidades:

### 1. 🔠 Modo de Acessibilidade Visual (botão no header)
**Para quem:** Pessoas com baixa visão, idosos, estudantes com dificuldade de leitura.
**O que faz:** Aumenta o tamanho de todos os textos do site e maximiza o peso dos títulos (negrito máximo). A preferência é salva no navegador.
**Por que:** Muitos usuários não sabem usar o zoom do navegador ou precisam de ajuste mais granular que o zoom oferece.

### 2. ⌨️ Skip Link ("Pular para o conteúdo principal")
**Para quem:** Usuários cegos ou com deficiência motora que navegam por teclado.
**O que faz:** Aparece visualmente ao pressionar Tab pela primeira vez, permitindo pular toda a navegação e ir direto ao conteúdo.
**Por que:** Sem isso, quem usa teclado precisa navegar por todos os itens do menu em toda página carregada.

### 3. 🎯 Foco visível aprimorado
**Para quem:** Usuários de teclado e pessoas com baixa visão.
**O que faz:** Contorno dourado espesso (`3px solid`) em qualquer elemento ao receber foco via Tab.
**Por que:** O outline padrão dos navegadores é quase invisível em muitos temas.

### 4. 📏 Tamanho mínimo de área clicável (44×44px)
**Para quem:** Pessoas com tremor, paralisia cerebral ou dificuldade motora fina.
**O que faz:** Garante que todos os botões e links de navegação tenham área clicável mínima conforme WCAG 2.5.5.
**Por que:** Alvos pequenos são difíceis de clicar com precisão reduzida.

### 5. 🔇 Respeito à preferência "Reduzir movimento"
**Para quem:** Pessoas com epilepsia fotossensível, enxaqueca ou vertigem.
**O que faz:** Desativa todas as animações quando o sistema operacional tem a opção "Reduzir movimento" ativada.
**Por que:** Animações rápidas podem desencadear crises em pessoas sensíveis.

### 6. 📢 Regiões `aria-live` nos resultados
**Para quem:** Pessoas cegas que usam leitores de tela (NVDA, JAWS, VoiceOver).
**O que faz:** Quando o resultado da calculadora ou do calendário muda, o leitor de tela anuncia o novo conteúdo automaticamente.
**Por que:** Sem isso, o usuário cego não saberia que algo mudou na tela.

### 7. ⚠️ Validação de formulário acessível
**Para quem:** Pessoas cegas, com dislexia ou deficiência cognitiva, e daltônicos.
**O que faz:** Cada campo tem sua própria mensagem de erro individual com `role="alert"`. O erro não depende somente da cor vermelha — tem ícone e texto descritivo.
**Por que:** Daltônicos não distinguem vermelho de verde; leitores de tela precisam de texto para anunciar erros.

---

## 📚 Fontes e Referências

| Fonte | Uso |
|---|---|
| [Programa Agrinho](https://agrinho.sistemafaep.org.br) | Tema e contexto educacional |
| [ZARC/MAPA](https://www.gov.br/agricultura/pt-br/assuntos/riscos-seguro/programa-nacional-de-zoneamento-agricola-de-risco-climatico) | Épocas de plantio e risco climático |
| [Embrapa Soja](https://www.embrapa.br/soja) | Densidades ideais e espaçamentos |
| [Embrapa Cerrados](https://www.embrapa.br/cerrados) | Dados do Centro-Oeste |
| [Embrapa Clima Temperado](https://www.embrapa.br/clima-temperado) | Dados do Sul do Brasil |
| [INMET](https://www.inmet.gov.br) | Dados meteorológicos regionais |
| [Unsplash](https://unsplash.com) | Imagem de fundo (licença livre) |
| [Google Fonts](https://fonts.google.com) | Playfair Display e DM Sans |
| [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) | Diretrizes de acessibilidade |

---

*Desenvolvido para o Programa Agrinho 2026 · Conteúdo 100% gratuito e educacional · Feito com 💚 para estudantes do campo e da cidade.*
