# Planej.ai: Um Educador Financeiro com React e IA Generativa

O Planej.ai é uma aplicação web de planejamento financeiro pessoal. O usuário preenche um formulário com informações sobre sua renda, gastos e uma meta financeira (como uma viagem ou a compra de um bem), e a aplicação usa inteligência artificial para gerar um diagnóstico personalizado com sugestões práticas, ideias de renda extra e um plano de ação.

Tudo funciona diretamente no navegador: sem backend, sem banco de dados remoto. Os dados são salvos no localStorage e as análises são geradas em tempo real pela API do Google Gemini.

🚀 **[Acesse o Planej.ai](https://planejai-ashy.vercel.app/)**

## Visão geral

O projeto foi pensado para oferecer uma experiência prática e acessível para pessoas que desejam entender melhor sua situação financeira e planejar o futuro com mais segurança.

Entre os principais objetivos do app estão:

- Ajudar o usuário a montar uma visão clara do seu orçamento;
- Calcular a economia mensal necessária para atingir uma meta;
- Gerar diagnósticos financeiros personalizados com IA;
- Permitir interação via chat com o Gemini;
- Armazenar simulações e preferências do usuário no navegador.

## Funcionalidades principais

- Formulário de simulação financeira com dados como renda, despesas, dívidas e valor da meta;
- Cálculo automático da economia mensal necessária para alcançar o objetivo;
- Geração de insights personalizados por meio da API do Gemini;
- Histórico de conversas e simulações com persistência no localStorage;
- Suporte a tema claro/escuro com persistência de preferência;
- Interface responsiva, com abordagem mobile first e layout adaptado para desktop;
- Navegação entre páginas de formulário, resultados e histórico.

## Tecnologias utilizadas

- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Google Gemini API via `@google/genai`
- Lucide React
- LocalStorage para persistência de dados e tema

## Arquitetura e fluxo da aplicação

1. O usuário preenche um formulário com seus dados financeiros.
2. A aplicação calcula a economia mensal necessária para alcançar a meta informada.
3. Os dados são salvos em `localStorage` para que possam ser consultados depois.
4. Uma requisição é enviada à API do Gemini para gerar um insight financeiro personalizado.
5. O usuário pode continuar a conversa com o assistente, e o histórico é preservado junto à simulação.
6. O tema claro/escuro é aplicado e persistido no navegador.
