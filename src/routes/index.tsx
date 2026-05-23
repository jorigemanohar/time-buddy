import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Plus, Play, Pause, Square, RotateCcw, X, Clock, ListTodo } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaskTime Pro — Smart Task Manager with Live Countdown" },
      { name: "description", content: "Organize tasks and stay focused with a live countdown timer. TaskTime Pro merges to-do lists with real-time time awareness." },
    ],
  }),
  component: Index,
});

interface Task {
  id: string;
  text: string;
  createdAt: number;
}

function Index() {
  const [dark, setDark] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [minutesInput, setMinutesInput] = useState("5");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const addTask = () => {
    const v = taskInput.trim();
    if (!v) return;
    setTasks((p) => [...p, { id: crypto.randomUUID(), text: v, createdAt: Date.now() }]);
    setTaskInput("");
  };

  const deleteTask = (id: string) => setTasks((p) => p.filter((t) => t.id !== id));

  const startTimer = () => {
    const m = parseInt(minutesInput);
    if (isNaN(m) || m <= 0) return;
    setTimeLeft(m * 60);
    setFinished(false);
    setRunning(true);
  };

  const pauseTimer = () => setRunning(false);
  const resumeTimer = () => { if (timeLeft > 0) setRunning(true); };
  const stopTimer = () => { setRunning(false); setTimeLeft(0); setFinished(false); };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Clock className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Smart productivity</p>
              <h2 className="text-sm font-semibold">TaskTime Pro</h2>
            </div>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-secondary"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {dark ? "Light" : "Dark"}
          </button>
        </header>

        <section className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gradient-title">
            TaskTime Pro
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            A smart task manager with a live countdown — organize tasks, set a focus timer, and beat procrastination.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {/* Tasks */}
          <div className="rounded-2xl border border-border bg-card backdrop-blur p-6 shadow-soft animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <ListTodo className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Your Tasks</h3>
              <span className="ml-auto text-xs text-muted-foreground">{tasks.length} total</span>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Add a new task..."
                className="flex-1 rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={addTask}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {tasks.length === 0 && (
                <li className="text-sm text-muted-foreground text-center py-8">
                  No tasks yet. Add one above to get started.
                </li>
              )}
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-3 py-2 animate-fade-in-up"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="flex-1 text-sm">{t.text}</span>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="grid h-7 w-7 place-items-center rounded-full bg-destructive/10 text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="Delete task"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Timer */}
          <div className="rounded-2xl border border-border bg-card backdrop-blur p-6 shadow-soft animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Focus Timer</h3>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input
                type="number"
                min={1}
                value={minutesInput}
                onChange={(e) => setMinutesInput(e.target.value)}
                className="w-24 rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>

            <div className={`mx-auto mb-6 grid place-items-center rounded-full border-4 border-primary/20 h-44 w-44 ${running ? "animate-pulse-ring" : ""}`}>
              <div className="text-center">
                <div className="text-5xl font-bold tabular-nums text-foreground">
                  {mins}:{secs}
                </div>
                <div className="text-xs uppercase tracking-widest mt-1 text-muted-foreground">
                  {finished ? "Time's up!" : running ? "Running" : timeLeft > 0 ? "Paused" : "Ready"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {!running && timeLeft === 0 && (
                <button onClick={startTimer} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                  <Play className="h-4 w-4" /> Start
                </button>
              )}
              {running && (
                <button onClick={pauseTimer} className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
                  <Pause className="h-4 w-4" /> Pause
                </button>
              )}
              {!running && timeLeft > 0 && (
                <button onClick={resumeTimer} className="inline-flex items-center justify-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-success-foreground hover:opacity-90">
                  <Play className="h-4 w-4" /> Resume
                </button>
              )}
              {(timeLeft > 0 || running) && (
                <button onClick={stopTimer} className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90">
                  <Square className="h-4 w-4" /> Stop
                </button>
              )}
              {finished && (
                <button onClick={stopTimer} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90">
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Built for focus · TaskTime Pro
        </footer>
      </div>
    </main>
  );
}
