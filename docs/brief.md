## **TESS Command Center**

### Prazo: 36 horas

---

## CONTEXTO

A TESS é uma plataforma corporativa de agentes de IA que se conecta a mais de 270 LLMs. Hoje, usuários criam agentes, disparam prompts e acompanham resultados — mas a experiência de **acompanhar o que os agentes estão fazendo em tempo real** ainda é invisível para o usuário.

---

## O DESAFIO

Você vai projetar **e implementar em React** uma interface chamada **TESS Command Center**: uma tela onde o usuário consegue visualizar e interagir com múltiplos agentes de IA trabalhando simultaneamente.

---

## O QUE DEVE SER ENTREGUE

### 1\. Interface funcional em React

Uma tela com os seguintes elementos:

- **Feed de agentes ativos** — cards mostrando cada agente em execução, com nome, status (thinking / executing / done), e progresso visual  
- **Log de atividade em tempo real** — estilo "terminal elegante", mostrando o que o agente está fazendo agora (pode ser mockado com setTimeout/intervalos)  
- **Prompt rápido** — um input para o usuário enviar uma nova instrução para um agente específico  
- **Indicador de "modelo sendo usado"** — qual LLM está por trás daquele agente (GPT-4, Claude, Gemini etc.)

Deve ter alinhamento visual com o que é apresentado na plataforma da Tess como cores, estilos e etc.

### 2\. Pelo menos 1 micro-interação surpreendente

Algo que não é óbvio. Uma animação, transição, feedback visual que demonstre senso estético acima da média.

### 

### 3\. Documento curto (pode ser README ou Notion)

- Quais ferramentas de IA usou e como  
- Uma decisão de UX que tomou e por quê  
- O que faria diferente com mais tempo

---

## CRITÉRIOS DE AVALIAÇÃO

| Critério | O que vamos observar |
| :---- | :---- |
| 🎨 Senso estético | A interface é bonita, coesa e sofisticada? |
| ⚡ Velocidade com IA | Conseguiu entregar algo funcional em 36h usando IA como alavanca? |
| 🧠 Decisão de UX | As escolhas fazem sentido para o contexto de produto? |
| ✨ Criatividade | Surpreendeu em algum ponto? |
| 📦 Entregabilidade | Roda localmente sem dificuldade? |

---

## REGRAS

- ✅ **Use IA obrigatoriamente** — Cursor, v0, Copilot, Claude, ChatGPT, o que quiser  
- ✅ Pode usar bibliotecas React (Tailwind, Framer Motion, shadcn/ui, etc.)  
- ✅ Dados podem ser todos mockados  
- ❌ Não precisa ter backend real  
- ❌ Não precisa ter autenticação