// ============================================================
//  AGRINHO 2026 — script.js
// ============================================================

// Marca que o JS está rodando — ativa animações de reveal com segurança
document.documentElement.classList.add('js-pronto');

// --- Modo Escuro / Claro ---
(function () {
    const STORAGE_KEY = 'agrinho-theme';
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
            btn.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.querySelector('.theme-label').textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
        }
        localStorage.setItem(STORAGE_KEY, theme);
    }
    window.toggleTheme = function () {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    };
    const saved = localStorage.getItem(STORAGE_KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || preferred);
})();


// --- Nav ativa por scroll ---
(function () {
    function atualizarNavAtiva() {
        const secoes = ['inicio', 'calculadora', 'calendario'];
        let atualId = 'inicio';
        secoes.forEach(function (id) {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
                atualId = id;
            }
        });
        secoes.forEach(function (id) {
            const link = document.getElementById('nav-' + id);
            if (link) link.classList.toggle('active', id === atualId);
        });
    }
    window.addEventListener('scroll', atualizarNavAtiva, { passive: true });
    window.addEventListener('DOMContentLoaded', atualizarNavAtiva);
})();


// ============================================================
//  CALCULADORA DE SEMENTES
// ============================================================
(function () {
    const form = document.getElementById('seedForm');
    if (!form) return;

    const densidadeCultura = {
        soja:    { min: 20, max: 30,  unidade: 'sementes/m²' },
        milho:   { min: 5,  max: 8,   unidade: 'sementes/m²' },
        feijao:  { min: 12, max: 18,  unidade: 'sementes/m²' },
        trigo:   { min: 80, max: 120, unidade: 'sementes/m²' },
        arroz:   { min: 60, max: 100, unidade: 'sementes/m²' },
        algodao: { min: 8,  max: 12,  unidade: 'sementes/m²' },
    };

    const culturaSelect = document.getElementById('culturaSeed');
    if (culturaSelect) {
        const nomes = { soja:'Soja', milho:'Milho', feijao:'Feijão', trigo:'Trigo', arroz:'Arroz', algodao:'Algodão' };
        Object.keys(nomes).forEach(k => {
            const opt = document.createElement('option');
            opt.value = k; opt.textContent = nomes[k];
            culturaSelect.appendChild(opt);
        });
        culturaSelect.addEventListener('change', sugerirEspacamento);
    }

    function sugerirEspacamento() {
        const sugestoes = {
            soja:    { plantas: 0.05, linhas: 0.45 },
            milho:   { plantas: 0.20, linhas: 0.80 },
            feijao:  { plantas: 0.10, linhas: 0.50 },
            trigo:   { plantas: 0.07, linhas: 0.17 },
            arroz:   { plantas: 0.10, linhas: 0.30 },
            algodao: { plantas: 0.25, linhas: 0.90 },
        };
        const v = culturaSelect.value;
        if (sugestoes[v]) {
            const hint = document.getElementById('espacamentoHint');
            if (hint) hint.textContent =
                'Sugestão para ' + culturaSelect.options[culturaSelect.selectedIndex].text +
                ': ' + sugestoes[v].plantas + 'm entre plantas × ' + sugestoes[v].linhas + 'm entre linhas';
        }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const area        = parseFloat(document.getElementById('area').value);
        const espacamento = parseFloat(document.getElementById('espacamento').value);
        const linhas      = parseFloat(document.getElementById('linhas').value);
        const cultura     = culturaSelect ? culturaSelect.value : null;

        if (!(area > 0 && espacamento > 0 && linhas > 0)) {
            document.getElementById('resultadoCalculo').innerHTML =
                '<p class="error-msg">⚠️ Preencha todos os campos com valores maiores que zero.</p>';
            return;
        }

        const sementesBase   = Math.ceil(area / (espacamento * linhas));
        const sementesMais10 = Math.ceil(sementesBase * 1.10);
        const sementesMais15 = Math.ceil(sementesBase * 1.15);
        const areaHectare    = (area / 10000).toFixed(4);

        let densidadeInfo = '';
        if (cultura && densidadeCultura[cultura]) {
            const d = densidadeCultura[cultura];
            const densAtual = (sementesBase / area).toFixed(1);
            const status = densAtual >= d.min && densAtual <= d.max
                ? '<span class="badge badge-ok">✔ Dentro do recomendado</span>'
                : '<span class="badge badge-warn">⚠ Verifique espaçamento</span>';
            densidadeInfo =
                '<div class="density-info">' +
                '<p>Densidade calculada: <strong>' + densAtual + ' sem/m²</strong> ' + status + '</p>' +
                '<p>Faixa recomendada para ' + cultura + ': <strong>' + d.min + '–' + d.max + ' ' + d.unidade + '</strong></p>' +
                '</div>';
        }

        document.getElementById('resultadoCalculo').innerHTML =
            '<div class="result-grid">' +
            '<div class="result-item primary"><span class="result-label">Sementes necessárias</span><span class="result-value">' + sementesBase.toLocaleString('pt-BR') + '</span></div>' +
            '<div class="result-item"><span class="result-label">Com 10% de margem</span><span class="result-value">' + sementesMais10.toLocaleString('pt-BR') + '</span></div>' +
            '<div class="result-item"><span class="result-label">Com 15% de margem</span><span class="result-value">' + sementesMais15.toLocaleString('pt-BR') + '</span></div>' +
            '<div class="result-item"><span class="result-label">Área em hectares</span><span class="result-value">' + areaHectare + ' ha</span></div>' +
            '</div>' + densidadeInfo +
            '<p class="result-note">💡 Recomenda-se adquirir entre 10–15% a mais para cobrir falhas de germinação.</p>';

        const res = document.getElementById('resultadoCalculo');
        res.classList.remove('show');
        requestAnimationFrame(() => res.classList.add('show'));
    });

    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            form.reset();
            document.getElementById('resultadoCalculo').innerHTML = '';
            const hint = document.getElementById('espacamentoHint');
            if (hint) hint.textContent = '';
        });
    }
})();


// ============================================================
//  CALENDÁRIO DE PLANTIO — POR ESTADO (ZARC/MAPA + Embrapa + INMET)
// ============================================================
(function () {
    const culturaEl = document.getElementById('cultura');
    const regiaoEl  = document.getElementById('regiao');
    if (!culturaEl || !regiaoEl) return;

    const calendarioData = {
        soja: {
            AC: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Variedades de ciclo médio; atenção ao excesso de chuvas.' },
            AL: { epoca: 'Dezembro a Fevereiro',  risco: 'alto',   obs: 'Área marginal; prefira cultivares precoces e use irrigação.' },
            AM: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Plante em áreas de cerrado; umidade elevada favorece doenças.' },
            AP: { epoca: 'Dezembro a Fevereiro',  risco: 'medio',  obs: 'Início das chuvas; monitore ferrugem asiática.' },
            BA: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Oeste baiano tem excelente aptidão; demais áreas com risco hídrico.' },
            CE: { epoca: 'Janeiro a Março',       risco: 'alto',   obs: 'Dependente de chuvas irregulares; irrigação recomendada.' },
            DF: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Planalto Central com ótimas condições; maior produtividade.' },
            ES: { epoca: 'Outubro a Dezembro',    risco: 'baixo',  obs: 'Regiões serranas com melhor desempenho.' },
            GO: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Uma das melhores regiões do Brasil para soja.' },
            MA: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Sul do Maranhão (MATOPIBA) com boa aptidão agrícola.' },
            MG: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Triângulo Mineiro e Sul de Minas com excelente potencial.' },
            MS: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Ampla janela de plantio; atenção ao final do ciclo.' },
            MT: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Maior produtor nacional; clima ideal no período.' },
            PA: { epoca: 'Dezembro a Fevereiro',  risco: 'medio',  obs: 'Sul do Pará em expansão; atenção à logística.' },
            PB: { epoca: 'Janeiro a Março',       risco: 'alto',   obs: 'Área marginal; apenas com irrigação.' },
            PE: { epoca: 'Janeiro a Março',       risco: 'alto',   obs: 'Sertão com chuvas instáveis; alto risco de frustração.' },
            PI: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Cerrado piauiense (MATOPIBA) com boa produtividade.' },
            PR: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Segundo maior produtor; clima ameno favorece altos rendimentos.' },
            RJ: { epoca: 'Outubro a Dezembro',    risco: 'medio',  obs: 'Pequena escala; áreas de altitude são mais indicadas.' },
            RN: { epoca: 'Janeiro a Março',       risco: 'alto',   obs: 'Irregularidade das chuvas impõe alto risco; irrigação necessária.' },
            RO: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Expansão recente; atenção a nematóides.' },
            RR: { epoca: 'Maio a Julho',          risco: 'medio',  obs: 'Safra no período seco; irrigação recomendada.' },
            RS: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Excelente qualidade de grão; cuidado com geadas tardias.' },
            SC: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Oeste catarinense é referência em produtividade.' },
            SE: { epoca: 'Dezembro a Fevereiro',  risco: 'alto',   obs: 'Área restrita; considerar apenas com irrigação.' },
            SP: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Noroeste paulista com boa aptidão agrícola.' },
            TO: { epoca: 'Outubro a Dezembro',    risco: 'baixo',  obs: 'MATOPIBA; chuvas bem distribuídas no período.' },
        },
        milho: {
            AC: { epoca: 'Outubro a Dezembro',    risco: 'medio',  obs: 'Ciclo chuvoso; prefira híbridos tolerantes a doenças foliares.' },
            AL: { epoca: 'Março a Maio',          risco: 'medio',  obs: 'Agreste tem melhores condições; Sertão com alto risco.' },
            AM: { epoca: 'Setembro a Novembro',   risco: 'medio',  obs: 'Terra firme; milho safrinha possível em junho/julho.' },
            AP: { epoca: 'Março a Maio',          risco: 'medio',  obs: 'Período menos chuvoso favorece colheita mais seca.' },
            BA: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Sertão com risco; Oeste e Sul com melhor aptidão.' },
            CE: { epoca: 'Fevereiro a Abril',     risco: 'alto',   obs: 'Zona da Mata e Cariri são mais indicados; sertão de risco.' },
            DF: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Safrinha (fev–mar) também viável no Planalto Central.' },
            ES: { epoca: 'Setembro a Novembro',   risco: 'baixo',  obs: 'Região serrana com boa distribuição de chuvas.' },
            GO: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Safrinha de milho (jan–fev) muito expressiva no estado.' },
            MA: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Sul do estado com melhor regularidade hídrica.' },
            MG: { epoca: 'Setembro a Novembro',   risco: 'baixo',  obs: 'Norte mineiro com maior risco; demais regiões favoráveis.' },
            MS: { epoca: 'Setembro a Outubro',    risco: 'baixo',  obs: 'Safrinha (jan–fev) é a principal safra no estado.' },
            MT: { epoca: 'Setembro a Outubro',    risco: 'baixo',  obs: 'Maior produtor de milho safrinha (jan–fev) do Brasil.' },
            PA: { epoca: 'Outubro a Dezembro',    risco: 'medio',  obs: 'Sul do Pará com condições mais favoráveis.' },
            PB: { epoca: 'Fevereiro a Abril',     risco: 'alto',   obs: 'Brejo paraibano é mais indicado; demais áreas de risco.' },
            PE: { epoca: 'Março a Maio',          risco: 'alto',   obs: 'Agreste e Brejo com potencial; Sertão dependente de chuvas.' },
            PI: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Sul e sudoeste do estado com melhor aptidão.' },
            PR: { epoca: 'Setembro a Outubro',    risco: 'baixo',  obs: 'Maior safra de verão; safrinha (jan–fev) também viável.' },
            RJ: { epoca: 'Setembro a Novembro',   risco: 'medio',  obs: 'Pequena escala; Norte fluminense com melhor potencial.' },
            RN: { epoca: 'Fevereiro a Abril',     risco: 'alto',   obs: 'Seridó e Sertão com alta variabilidade; risco elevado.' },
            RO: { epoca: 'Outubro a Dezembro',    risco: 'medio',  obs: 'Zona da Mata rondoniana com boas condições.' },
            RR: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Período menos úmido facilita a colheita.' },
            RS: { epoca: 'Setembro a Outubro',    risco: 'baixo',  obs: 'Clima ameno; cuidado com frio no plantio e na colheita.' },
            SC: { epoca: 'Setembro a Outubro',    risco: 'baixo',  obs: 'Oeste catarinense com alta produtividade.' },
            SE: { epoca: 'Março a Maio',          risco: 'medio',  obs: 'Agreste sergipano mais indicado.' },
            SP: { epoca: 'Setembro a Outubro',    risco: 'baixo',  obs: 'Interior paulista com boa disponibilidade hídrica.' },
            TO: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Safrinha (jan–fev) com bom potencial produtivo.' },
        },
        feijao: {
            AC: { epoca: 'Março a Maio',          risco: 'medio',  obs: 'Fase de menor precipitação; colheita mais seca.' },
            AL: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Agreste alagoano com melhores condições.' },
            AM: { epoca: 'Junho a Agosto',        risco: 'medio',  obs: 'Período de estiagem relativa favorece a cultura.' },
            AP: { epoca: 'Julho a Setembro',      risco: 'medio',  obs: 'Verão seco ameniza riscos de doenças.' },
            BA: { epoca: 'Maio a Julho',          risco: 'medio',  obs: 'Chapada Diamantina e Sudoeste com melhor aptidão.' },
            CE: { epoca: 'Fevereiro a Abril',     risco: 'alto',   obs: 'Chuvas irregulares; brejo cearense é mais indicado.' },
            DF: { epoca: 'Fev a Abr / Jul a Set', risco: 'baixo',  obs: 'Duas safras viáveis; irrigação aumenta produtividade.' },
            ES: { epoca: 'Junho a Agosto',        risco: 'baixo',  obs: 'Região serrana favorável; atenção a fungos no inverno úmido.' },
            GO: { epoca: 'Fev a Abr / Jul a Set', risco: 'baixo',  obs: 'Duas safras possíveis; segunda safra com irrigação.' },
            MA: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Período de transição seco-úmido; monitorar umidade.' },
            MG: { epoca: 'Julho a Setembro',      risco: 'baixo',  obs: 'Sul e Triângulo Mineiro com alta produtividade.' },
            MS: { epoca: 'Fev a Abr / Jul a Set', risco: 'baixo',  obs: 'Duas safras; segunda com irrigação mais produtiva.' },
            MT: { epoca: 'Fev a Abr / Jul a Set', risco: 'baixo',  obs: 'Segunda safra (jul–set) com irrigação em expansão.' },
            PA: { epoca: 'Julho a Setembro',      risco: 'medio',  obs: 'Período seco do nordeste paraense.' },
            PB: { epoca: 'Março a Maio',          risco: 'alto',   obs: 'Brejo paraibano e Agreste são as áreas mais indicadas.' },
            PE: { epoca: 'Março a Maio',          risco: 'alto',   obs: 'Agreste pernambucano com melhor potencial.' },
            PI: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Fim do período chuvoso; colheita menos arriscada.' },
            PR: { epoca: 'Ago a Out / Jan a Mar', risco: 'baixo',  obs: 'Três safras possíveis; Norte do PR com maior produção.' },
            RJ: { epoca: 'Maio a Julho',          risco: 'medio',  obs: 'Serra fluminense favorável; Baixada com mais riscos.' },
            RN: { epoca: 'Março a Maio',          risco: 'alto',   obs: 'Seridó e Agreste; chuvas muito variáveis.' },
            RO: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Início do período seco; qualidade de grão melhor.' },
            RR: { epoca: 'Maio a Julho',          risco: 'medio',  obs: 'Verão seco reduz pressão de doenças.' },
            RS: { epoca: 'Agosto a Outubro',      risco: 'baixo',  obs: 'Plantio de primavera; atenção a geadas tardias em agosto.' },
            SC: { epoca: 'Agosto a Outubro',      risco: 'baixo',  obs: 'Safra de primavera com bom potencial no Oeste.' },
            SE: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Agreste sergipano com melhor regularidade hídrica.' },
            SP: { epoca: 'Ago a Out / Jan a Mar', risco: 'baixo',  obs: 'Interior paulista com bom histórico produtivo.' },
            TO: { epoca: 'Maio a Julho',          risco: 'medio',  obs: 'Período de transição chuva/seca adequado.' },
        },
        trigo: {
            AC: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima quente e úmido é inviável para trigo.' },
            AL: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Temperaturas muito altas e ciclo curto de frio.' },
            AM: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Condições tropicais incompatíveis com o trigo.' },
            AP: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Sem vernalização suficiente para a cultura.' },
            BA: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Exceto altiplanos acima de 900m com condições marginais.' },
            CE: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Temperaturas acima do limite para bom desenvolvimento.' },
            DF: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Irrigado; altitude de 1.000m+ favorece o cultivo.' },
            ES: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Temperaturas elevadas na maior parte do estado.' },
            GO: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Calor excessivo impede florescimento adequado.' },
            MA: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima tropical sem período frio suficiente.' },
            MG: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Sul de Minas (Poços de Caldas, Pouso Alegre) acima de 700m.' },
            MS: { epoca: 'Março a Maio',          risco: 'medio',  obs: 'Sul do estado com condições marginais; risco de geada na colheita.' },
            MT: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Calor e chuvas excessivas impedem a cultura.' },
            PA: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Inviável nas condições climáticas do estado.' },
            PB: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Temperaturas muito altas.' },
            PE: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Sem condições climáticas adequadas.' },
            PI: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima tropical semi-árido incompatível.' },
            PR: { epoca: 'Maio a Julho',          risco: 'baixo',  obs: 'Maior produtor nacional; Campos Gerais e Sudoeste são excelentes.' },
            RJ: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Temperaturas elevadas na maior parte do ano.' },
            RN: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Semi-árido inviabiliza o cultivo.' },
            RO: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima amazônico incompatível com trigo.' },
            RR: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima equatorial sem frio necessário.' },
            RS: { epoca: 'Maio a Julho',          risco: 'baixo',  obs: 'Referência nacional; invernos frios garantem boa vernalização.' },
            SC: { epoca: 'Maio a Julho',          risco: 'baixo',  obs: 'Oeste e Planalto catarinense com ótimas condições.' },
            SE: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Sem condições térmicas adequadas.' },
            SP: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Sudoeste paulista acima de 600m; produção em expansão.' },
            TO: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima quente e úmido incompatível.' },
        },
        arroz: {
            AC: { epoca: 'Outubro a Dezembro',    risco: 'baixo',  obs: 'Chuvas abundantes; variedades de terras altas bem adaptadas.' },
            AL: { epoca: 'Abril a Junho',         risco: 'medio',  obs: 'Período chuvoso do Agreste; arroz de sequeiro.' },
            AM: { epoca: 'Outubro a Dezembro',    risco: 'baixo',  obs: 'Várzeas do Amazonas com alto potencial para arroz irrigado.' },
            AP: { epoca: 'Março a Maio',          risco: 'medio',  obs: 'Savanas do Amapá com potencial para arroz de terras altas.' },
            BA: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Recôncavo e litoral com arroz irrigado; Oeste com terras altas.' },
            CE: { epoca: 'Março a Maio',          risco: 'alto',   obs: 'Vales úmidos do Cariri e Serra da Ibiapaba mais indicados.' },
            DF: { epoca: 'Outubro a Dezembro',    risco: 'baixo',  obs: 'Arroz de terras altas com irrigação suplementar.' },
            ES: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Litoral e baixadas; arroz irrigado nas várzeas.' },
            GO: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Arroz de terras altas bem adaptado ao Cerrado goiano.' },
            MA: { epoca: 'Novembro a Janeiro',    risco: 'baixo',  obs: 'Baixada Maranhense referência em arroz irrigado no Nordeste.' },
            MG: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Várzeas do Rio Doce e regiões de altitude.' },
            MS: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Planícies de inundação com arroz irrigado.' },
            MT: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Arroz de terras altas; Mato Grosso é grande produtor.' },
            PA: { epoca: 'Novembro a Janeiro',    risco: 'baixo',  obs: 'Várzeas do Pará com alto potencial; terras altas em expansão.' },
            PB: { epoca: 'Março a Maio',          risco: 'alto',   obs: 'Brejo paraibano e vales úmidos com arroz de sequeiro.' },
            PE: { epoca: 'Março a Maio',          risco: 'alto',   obs: 'Vale do São Francisco irrigado e Zona da Mata.' },
            PI: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Delta do Parnaíba e baixada com arroz irrigado.' },
            PR: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Litoral e Vale do Ribeira com arroz irrigado.' },
            RJ: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Baixada Fluminense com tradição em arroz irrigado.' },
            RN: { epoca: 'Março a Maio',          risco: 'alto',   obs: 'Vale do Açu com irrigação; demais áreas de alto risco.' },
            RO: { epoca: 'Outubro a Dezembro',    risco: 'baixo',  obs: 'Arroz de terras altas bem adaptado ao estado.' },
            RR: { epoca: 'Maio a Julho',          risco: 'medio',  obs: 'Lavrados de Roraima com bom potencial produtivo.' },
            RS: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Maior produtor nacional de arroz irrigado; Depressão Central é referência.' },
            SC: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Vale do Itajaí e Litoral com arroz irrigado de alta qualidade.' },
            SE: { epoca: 'Março a Maio',          risco: 'medio',  obs: 'Baixo São Francisco com irrigação; boa produtividade.' },
            SP: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Vale do Ribeira e interior com arroz irrigado e sequeiro.' },
            TO: { epoca: 'Outubro a Dezembro',    risco: 'baixo',  obs: 'Arroz de terras altas no Cerrado tocantinense em crescimento.' },
        },
        algodao: {
            AC: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Excesso de umidade favorece pragas e doenças.' },
            AL: { epoca: 'Dezembro a Fevereiro',  risco: 'alto',   obs: 'Clima úmido prejudica qualidade da fibra.' },
            AM: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Umidade excessiva inviabiliza o cultivo.' },
            AP: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima equatorial incompatível com a cultura.' },
            BA: { epoca: 'Dezembro a Fevereiro',  risco: 'medio',  obs: 'Oeste da Bahia é polo de algodão; condições ideais.' },
            CE: { epoca: 'Janeiro a Março',       risco: 'alto',   obs: 'Algodão herbáceo no Sertão; alto risco hídrico.' },
            DF: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Baixa umidade no período de abertura favorece fibra.' },
            ES: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima muito úmido prejudica a cultura.' },
            GO: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Cerrado goiano com excelentes condições para algodão.' },
            MA: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Sul maranhense (MATOPIBA) em expansão acelerada.' },
            MG: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Triângulo e Noroeste mineiro com boa aptidão.' },
            MS: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Condições favoráveis; atenção à abertura do capulho.' },
            MT: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Maior produtor nacional; condições ideais no Cerrado.' },
            PA: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Umidade elevada prejudica fibra e facilita pragas.' },
            PB: { epoca: 'Janeiro a Março',       risco: 'alto',   obs: 'Sertão paraibano com tradição, mas alto risco hídrico.' },
            PE: { epoca: 'Janeiro a Março',       risco: 'alto',   obs: 'Sertão pernambucano; dependente de chuvas irregulares.' },
            PI: { epoca: 'Novembro a Janeiro',    risco: 'medio',  obs: 'Cerrado piauiense (MATOPIBA) com crescimento.' },
            PR: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima frio e úmido prejudica o desenvolvimento.' },
            RJ: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Condições climáticas desfavoráveis.' },
            RN: { epoca: 'Janeiro a Março',       risco: 'alto',   obs: 'Sertão potiguar com histórico; alto risco.' },
            RO: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Umidade amazônica inviabiliza a cultura.' },
            RR: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima equatorial com excesso de chuvas.' },
            RS: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Clima frio compromete totalmente o desenvolvimento.' },
            SC: { epoca: 'Não recomendado',       risco: 'alto',   obs: 'Temperaturas baixas e umidade elevada inviabilizam.' },
            SE: { epoca: 'Dezembro a Fevereiro',  risco: 'alto',   obs: 'Sertão sergipano; depende de regularidade das chuvas.' },
            SP: { epoca: 'Outubro a Novembro',    risco: 'medio',  obs: 'Noroeste paulista com tradição; atenção na abertura.' },
            TO: { epoca: 'Outubro a Novembro',    risco: 'baixo',  obs: 'Cerrado tocantinense em expansão; condições favoráveis.' },
        },
    };

    const nomesEstados = {
        AC:'Acre', AL:'Alagoas', AM:'Amazonas', AP:'Amapá', BA:'Bahia',
        CE:'Ceará', DF:'Distrito Federal', ES:'Espírito Santo', GO:'Goiás',
        MA:'Maranhão', MG:'Minas Gerais', MS:'Mato Grosso do Sul', MT:'Mato Grosso',
        PA:'Pará', PB:'Paraíba', PE:'Pernambuco', PI:'Piauí', PR:'Paraná',
        RJ:'Rio de Janeiro', RN:'Rio Grande do Norte', RO:'Rondônia', RR:'Roraima',
        RS:'Rio Grande do Sul', SC:'Santa Catarina', SE:'Sergipe', SP:'São Paulo', TO:'Tocantins'
    };

    const nomesCulturas = {
        soja:'Soja', milho:'Milho', feijao:'Feijão',
        trigo:'Trigo', arroz:'Arroz', algodao:'Algodão'
    };

    const riscoLabel = { baixo: '🟢 Baixo', medio: '🟡 Médio', alto: '🔴 Alto' };
    const riscoClass = { baixo: 'risco-baixo', medio: 'risco-medio', alto: 'risco-alto' };

    function preencherEstados() {
        regiaoEl.innerHTML = '';
        Object.entries(nomesEstados)
            .sort(function(a, b) { return a[1].localeCompare(b[1]); })
            .forEach(function(entry) {
                var sigla = entry[0], nome = entry[1];
                var opt = document.createElement('option');
                opt.value = sigla;
                opt.textContent = nome + ' (' + sigla + ')';
                regiaoEl.appendChild(opt);
            });
        regiaoEl.value = 'PR';
    }

    function atualizarCalendario() {
        var cultura = culturaEl.value;
        var estado  = regiaoEl.value;
        var dado    = calendarioData[cultura] && calendarioData[cultura][estado];
        if (!dado) return;

        document.getElementById('resultadoCalendario').innerHTML =
            '<div class="cal-result">' +
            '<div class="cal-header">' +
            '<span class="cal-cultura">' + nomesCulturas[cultura] + '</span>' +
            '<span class="cal-regiao">' + nomesEstados[estado] + ' (' + estado + ')</span>' +
            '</div>' +
            '<div class="cal-epoca"><span class="cal-label">📅 Melhor época para plantio</span><strong class="cal-periodo">' + dado.epoca + '</strong></div>' +
            '<div class="cal-risco ' + riscoClass[dado.risco] + '"><span class="cal-label">⚡ Risco climático</span><span>' + riscoLabel[dado.risco] + '</span></div>' +
            '<div class="cal-obs"><span class="cal-label">💬 Observação técnica</span><p>' + dado.obs + '</p></div>' +
            '</div>';

        atualizarTabela(cultura);
    }

    function atualizarTabela(cultura) {
        var tabela = document.getElementById('tabelaRegioes');
        if (!tabela) return;
        var dados = calendarioData[cultura];
        tabela.innerHTML = Object.entries(dados)
            .sort(function(a, b) { return nomesEstados[a[0]].localeCompare(nomesEstados[b[0]]); })
            .map(function(entry) {
                var sigla = entry[0], d = entry[1];
                return '<tr><td><strong>' + nomesEstados[sigla] + '</strong> <span class="sigla-badge">' + sigla + '</span></td>' +
                       '<td>' + d.epoca + '</td>' +
                       '<td><span class="badge-risco ' + riscoClass[d.risco] + '">' + riscoLabel[d.risco] + '</span></td></tr>';
            }).join('');
    }

    preencherEstados();
    culturaEl.addEventListener('change', atualizarCalendario);
    regiaoEl.addEventListener('change', atualizarCalendario);
    window.addEventListener('DOMContentLoaded', atualizarCalendario);
})();


// ============================================================
//  ANIMAÇÃO REVEAL AO SCROLL
// ============================================================
(function () {
    function iniciarReveal() {
        var elementos = document.querySelectorAll('.reveal');
        if (!elementos.length) return;

        // Se IntersectionObserver não existir, mostra tudo direto
        if (!window.IntersectionObserver) {
            elementos.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        elementos.forEach(function (el) { observer.observe(el); });
    }
    window.addEventListener('DOMContentLoaded', iniciarReveal);
})();


// ============================================================
//  BOTÃO VOLTAR AO TOPO
// ============================================================
(function () {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });
})();


// ============================================================
//  ACESSIBILIDADE — ANÚNCIO DE MUDANÇA DE TEMA PARA LEITORES
//  Cria uma região "live" invisível que anuncia a mudança
//  de tema escuro/claro para leitores de tela (NVDA, JAWS)
// ============================================================
(function () {
    // Cria elemento de anúncio invisível
    var anunciador = document.createElement('div');
    anunciador.setAttribute('role', 'status');
    anunciador.setAttribute('aria-live', 'polite');
    anunciador.setAttribute('aria-atomic', 'true');
    anunciador.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    anunciador.id = 'a11y-anunciador';
    document.body.appendChild(anunciador);

    // Sobrescreve toggleTheme para também anunciar
    var toggleOriginal = window.toggleTheme;
    window.toggleTheme = function () {
        toggleOriginal();
        var tema = document.documentElement.getAttribute('data-theme');
        var msg = tema === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado';
        anunciador.textContent = '';
        setTimeout(function () { anunciador.textContent = msg; }, 50);
    };
})();


// ============================================================
//  ACESSIBILIDADE — VALIDAÇÃO DE FORMULÁRIO ACESSÍVEL
//  Adiciona aria-invalid e aria-describedby nos campos
//  para que leitores de tela descrevam erros corretamente
// ============================================================
(function () {
    window.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('seedForm');
        if (!form) return;

        var campos = ['area', 'espacamento', 'linhas'];

        // Cria mensagens de erro individuais por campo
        campos.forEach(function (id) {
            var input = document.getElementById(id);
            if (!input) return;
            var erroId = id + '-erro';
            var erroEl = document.createElement('span');
            erroEl.id = erroId;
            erroEl.setAttribute('role', 'alert');
            erroEl.style.cssText = 'display:none;font-size:0.8rem;color:#c62828;font-weight:600;margin-top:2px;';
            input.parentNode.parentNode.appendChild(erroEl);
            input.setAttribute('aria-describedby', erroId);
        });

        form.addEventListener('submit', function () {
            campos.forEach(function (id) {
                var input = document.getElementById(id);
                var erroEl = document.getElementById(id + '-erro');
                if (!input || !erroEl) return;
                var val = parseFloat(input.value);
                if (!(val > 0)) {
                    input.setAttribute('aria-invalid', 'true');
                    erroEl.textContent = 'Por favor, insira um valor maior que zero.';
                    erroEl.style.display = 'block';
                } else {
                    input.setAttribute('aria-invalid', 'false');
                    erroEl.textContent = '';
                    erroEl.style.display = 'none';
                }
            });
        });

        // Limpa erro ao corrigir o campo
        campos.forEach(function (id) {
            var input = document.getElementById(id);
            if (!input) return;
            input.addEventListener('input', function () {
                var erroEl = document.getElementById(id + '-erro');
                if (parseFloat(input.value) > 0) {
                    input.setAttribute('aria-invalid', 'false');
                    if (erroEl) { erroEl.textContent = ''; erroEl.style.display = 'none'; }
                }
            });
        });
    });
})();


// ============================================================
//  MODO ACESSÍVEL — letras maiores e títulos em negrito
// ============================================================
(function () {
    var STORAGE_KEY = 'agrinho-acessivel';

    function aplicarAcessivel(ativo) {
        document.documentElement.setAttribute('data-acessivel', ativo ? 'true' : 'false');
        var btn = document.getElementById('accessToggle');
        if (btn) {
            btn.setAttribute('aria-pressed', ativo ? 'true' : 'false');
            btn.setAttribute('aria-label', ativo ? 'Desativar modo de acessibilidade visual' : 'Ativar modo de acessibilidade visual');
        }
        localStorage.setItem(STORAGE_KEY, ativo ? 'true' : 'false');
    }

    window.toggleAcessivel = function () {
        var atual = document.documentElement.getAttribute('data-acessivel') === 'true';
        aplicarAcessivel(!atual);

        // Anuncia para leitores de tela
        var anunciador = document.getElementById('a11y-anunciador');
        if (anunciador) {
            anunciador.textContent = '';
            setTimeout(function () {
                anunciador.textContent = !atual
                    ? 'Modo de acessibilidade ativado. Textos aumentados.'
                    : 'Modo de acessibilidade desativado.';
            }, 50);
        }
    };

    // Restaura preferência salva
    var salvo = localStorage.getItem(STORAGE_KEY);
    aplicarAcessivel(salvo === 'true');
})();
