# Open Generative UI

An open-source showcase for building rich, interactive AI-generated UI with [CopilotKit](https://copilotkit.ai) and [LangGraph](https://langchain-ai.github.io/langgraph/). Ask the agent to visualize algorithms, create 3D animations, render charts, or generate interactive diagrams — all rendered as live HTML/SVG inside a sandboxed iframe.

https://github.com/user-attachments/assets/ed28c734-e54e-4412-873f-4801da544a7f

## What It Does

The agent produces **generative UI** — not just text responses, but fully interactive visual components:

- **Algorithm visualizations** — binary search, BFS vs DFS, sorting algorithms
- **3D animations** — interactive WebGL/CSS3D scenes
- **Charts & diagrams** — pie charts, bar charts, network diagrams
- **Interactive widgets** — forms, simulations, math plots

All visuals are rendered in sandboxed iframes with automatic light/dark theming, progressive reveal animations, and responsive sizing.

## Quick Start

```bash
make setup    # Install deps + create .env template
# Edit .env with your OpenAI or OpenAI-compatible model settings
make dev      # Start all services
```

Python 3.12 or 3.13 is required for `apps/agent`. Python 3.14 currently breaks `jsonschema-rs` via PyO3 during `uv sync`.

- **App**: http://localhost:3000
- **Agent**: http://localhost:8123

### Available Commands

| Command | Description |
|---------|-------------|
| `make setup` | Install all dependencies and create `.env` template |
| `make dev` | Start all services (frontend + agent + mcp) |
| `make dev-app` | Start Next.js frontend only |
| `make dev-agent` | Start LangGraph agent only |
| `make dev-mcp` | Start MCP server only |
| `make build` | Build all apps |
| `make lint` | Lint all apps |
| `make clean` | Clean build artifacts |
| `make help` | Show all available commands |

You can also use `pnpm` directly (`pnpm dev`, `pnpm dev:app`, `pnpm dev:agent`, etc.).

## Architecture

Turborepo monorepo with two apps:

```
apps/
├── app/       Next.js 16 frontend (CopilotKit v2, React 19, Tailwind 4)
└── agent/     LangGraph Python agent (OpenAI-compatible chat model, CopilotKit middleware)
```

### How It Works

1. **User sends a prompt** via the CopilotKit chat UI
2. **Agent decides** whether to respond with text, call a tool, or render a visual component
3. **`widgetRenderer`** — a frontend `useComponent` hook — receives the agent's HTML and renders it in a sandboxed iframe
4. **Skeleton loading** shows while the iframe loads, then content fades in smoothly
5. **ResizeObserver** inside the iframe reports content height back to the parent for seamless auto-sizing

### Key CopilotKit Patterns

| Pattern | Hook | Example |
|---------|------|---------|
| Generative UI | `useComponent` | Pie charts, bar charts, widget renderer |
| Frontend tools | `useFrontendTool` | Theme toggle |
| Human-in-the-loop | `useHumanInTheLoop` | Meeting scheduler |
| Default tool render | `useDefaultRenderTool` | Tool execution status |

## Decision Matrix — Picking the Right Visual

| User asks about...          | Output type              | Technology          |
|-----------------------------|--------------------------|---------------------|
| How X works (physical)      | Illustrative diagram     | SVG                 |
| How X works (abstract)      | Interactive explainer    | HTML + inline SVG   |
| Process / steps             | Flowchart                | SVG                 |
| Architecture / containment  | Structural diagram       | SVG                 |
| Database schema / ERD       | Relationship diagram     | Mermaid             |
| Trends over time            | Line chart               | Chart.js            |
| Category comparison         | Bar chart                | Chart.js            |
| Part of whole               | Doughnut chart           | Chart.js            |
| KPIs / metrics              | Dashboard                | HTML metric cards   |
| Design a UI                 | Mockup                   | HTML                |
| Choose between options      | Comparison cards         | HTML grid           |
| Cyclic process              | Step-through             | HTML stepper        |
| Physics / math              | Simulation               | Canvas + JS         |
| Function / equation         | Plotter                  | SVG + JS            |
| Data exploration            | Sortable table           | HTML + JS           |
| Creative / decorative       | Art / illustration       | SVG                 |
| 3D visualization            | 3D scene                 | Three.js            |
| Music / audio               | Synthesizer              | Tone.js             |
| Network / graph             | Force layout             | D3.js               |
| Quick factual answer        | Plain text               | None                |
| Code solution               | Code block               | None                |
| Emotional support           | Warm text                | None                |

## Tech Stack

Next.js 16, React 19, Tailwind CSS 4, LangGraph, CopilotKit v2, Turborepo, Recharts

## Model Configuration

The agent uses `ChatOpenAI`, but it now reads standard OpenAI-compatible environment variables from the root `.env`:

```bash
OPENAI_API_KEY=your-api-key-or-dummy-value
OPENAI_MODEL=gpt-5.4-2026-03-05
OPENAI_BASE_URL=
```

- Leave `OPENAI_BASE_URL` empty to use OpenAI directly.
- Set `OPENAI_BASE_URL` to a local OpenAI-compatible server such as `http://localhost:11434/v1` or `http://localhost:1234/v1`.
- For local servers that do not require auth, keep `OPENAI_API_KEY` set to any non-empty dummy value.

## License

MIT
