# Planej.ai: Um Educador Financeiro com React e IA Generativa

O Planej.ai é uma aplicação web de planejamento financeiro pessoal. O usuário preenche um formulário com informações sobre sua renda, gastos e uma meta financeira (como uma viagem ou a compra de um bem), e a aplicação usa inteligência artificial para gerar um diagnóstico personalizado com sugestões práticas, ideias de renda extra e um plano de ação.

Além do diagnóstico inicial, o usuário pode conversar com o Educador Financeiro por meio de um chat contextual. A IA utiliza os dados da simulação e o histórico da conversa para responder às dúvidas de forma personalizada.

Tudo funciona diretamente no navegador: sem backend e sem banco de dados remoto. Os dados e históricos são salvos no `localStorage`, enquanto as análises e respostas são geradas em tempo real pela API do Google Gemini.

🚀 **[Acesse o Planej.ai](https://planejai-ashy.vercel.app/)**

## Visão geral

O projeto foi pensado para oferecer uma experiência prática e acessível para pessoas que desejam entender melhor sua situação financeira e planejar o futuro com mais segurança.

Entre os principais objetivos do app estão:

- Ajudar o usuário a montar uma visão clara do seu orçamento;
- Calcular a economia mensal necessária para atingir uma meta;
- Gerar diagnósticos financeiros personalizados com IA;
- Permitir interação via chat com o Educador Financeiro;
- Manter o contexto da conversa para respostas mais personalizadas;
- Armazenar simulações, históricos e preferências do usuário no navegador.

## Funcionalidades principais

- Formulário de simulação financeira com dados como renda, despesas, dívidas e valor da meta;
- Cálculo automático da economia mensal necessária para alcançar o objetivo;
- Geração de insights personalizados por meio da API do Gemini;
- Chat com o Educador Financeiro utilizando os dados da simulação como contexto;
- Histórico de conversas associado a cada simulação;
- Persistência das simulações e conversas no `localStorage`;
- Suporte a tema claro/escuro com persistência de preferência;
- Interface responsiva, com abordagem mobile first e layout adaptado para desktop;
- Navegação entre páginas de formulário, resultados e histórico;
- Renderização de respostas da IA com suporte a Markdown.

## Tecnologias utilizadas

- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Google Gemini API
- React Markdown
- Lucide React
- LocalStorage para persistência de dados, histórico e preferências de tema

## Arquitetura e fluxo da aplicação

1. O usuário preenche um formulário com seus dados financeiros.
2. A aplicação calcula a economia mensal necessária para alcançar a meta informada.
3. Os dados da simulação são salvos em `localStorage`.
4. Uma requisição é enviada à API do Gemini para gerar um diagnóstico financeiro personalizado.
5. O usuário pode iniciar uma conversa com o Educador Financeiro a partir do diagnóstico.
6. Cada nova mensagem é enviada junto aos dados da simulação e ao histórico da conversa, permitindo que a IA mantenha o contexto.
7. As mensagens da conversa são armazenadas junto à respectiva simulação no `localStorage`.
8. O tema claro/escuro é aplicado e persistido no navegador.

## Observação

Este projeto foi desenvolvido como parte de um desafio de aprendizado e demonstração de integração entre React e IA generativa. A aplicação utiliza a API do Gemini diretamente no frontend, uma abordagem adequada ao contexto do projeto, mas que exigiria uma camada de backend/proxy e outras medidas de segurança em um ambiente de produção.
