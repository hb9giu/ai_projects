"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[32px] border border-[var(--stroke)] bg-white/90 p-8 text-center shadow-[var(--shadow)]">
            <h2 className="font-display text-2xl font-semibold text-[var(--navy-dark)]">
              Something went wrong
            </h2>
            <p className="mt-3 text-sm text-[var(--gray-text)]">
              An unexpected error occurred. Reload to continue.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="mt-6 rounded-full bg-[var(--secondary-purple)] px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:brightness-110"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
