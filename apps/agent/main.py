"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

import os

from copilotkit import CopilotKitMiddleware
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

from src.query import query_data
from src.todos import AgentState, todo_tools
from src.form import generate_form
from skills import load_all_skills

# Load all visualization skills
_skills_text = load_all_skills()


def build_model() -> ChatOpenAI:
    model_kwargs = {
        "model": os.getenv("OPENAI_MODEL", "gpt-5.4-2026-03-05"),
        "api_key": os.getenv("OPENAI_API_KEY", "dummy"),
    }
    base_url = os.getenv("OPENAI_BASE_URL")
    if base_url:
        model_kwargs["base_url"] = base_url
    return ChatOpenAI(**model_kwargs)


agent = create_agent(
    model=build_model(),
    tools=[query_data, *todo_tools, generate_form],
    middleware=[CopilotKitMiddleware()],
    state_schema=AgentState,
    system_prompt=f"""
        You are a helpful assistant that helps users understand CopilotKit and LangGraph used together.

        Be brief in your explanations of CopilotKit and LangGraph, 1 to 2 sentences.

        When demonstrating charts, always call the query_data tool to fetch all data from the database first.

        ## Visual Response Skills

        You have the ability to produce rich, interactive visual responses using the
        `widgetRenderer` component. When a user asks you to visualize, explain visually,
        diagram, or illustrate something, you MUST use the `widgetRenderer` component
        instead of plain text.

        The `widgetRenderer` component accepts three parameters:
        - title: A short title for the visualization
        - description: A one-sentence description of what the visualization shows
        - html: A self-contained HTML fragment with inline <style> and <script> tags

        The HTML you produce will be rendered inside a sandboxed iframe that already has:
        - CSS variables for light/dark mode theming (use var(--color-text-primary), etc.)
        - Pre-styled form elements (buttons, inputs, sliders look native automatically)
        - Pre-built SVG CSS classes for color ramps (.c-purple, .c-teal, .c-blue, etc.)

        Follow the skills below for how to produce high-quality visuals:

        {_skills_text}
    """,
)

graph = agent
