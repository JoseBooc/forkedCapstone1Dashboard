<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class DevCommand extends Command
{
    protected $signature = 'dev';
    protected $description = 'Start all development servers (Laravel root, Laravel backend, Vite, React)';

    public function handle(): void
    {
        $npm = PHP_OS_FAMILY === 'Windows' ? 'npm.cmd' : 'npm';
        $php = PHP_BINARY;

        $servers = [
            'API:8000'      => new Process([$php, 'artisan', 'serve', '--port=8000'], base_path('backend')),
            'Survey:8002'   => new Process([$php, 'artisan', 'serve', '--port=8002'], base_path()),
            'Vite'          => new Process([$npm, 'run', 'dev'], base_path()),
            'React:3000'    => new Process([$npm, 'start'], base_path('backend/frontend'), ['BROWSER' => 'none']),
        ];

        $this->info('Starting all development servers...');
        $this->newLine();

        foreach ($servers as $name => $process) {
            $process->setTimeout(null);
            $process->start();
            $this->line("  <fg=green>✓</> <options=bold>{$name}</> started (PID {$process->getPid()})");
        }

        $this->newLine();
        $this->line('  <fg=cyan>React dashboard</>  → http://localhost:3000  <fg=gray>(main entry point)</>');
        $this->line('  <fg=cyan>Laravel API</>      → http://localhost:8000  <fg=gray>(internal)</>');
        $this->line('  <fg=cyan>Survey system</>    → http://localhost:8002  <fg=gray>(embedded via dashboard)</>');

        $this->newLine();
        $this->line('  Press <options=bold>Ctrl+C</> to stop all servers.');
        $this->newLine();

        // Stream output from all processes
        while (true) {
            foreach ($servers as $name => $process) {
                $out = $process->getIncrementalOutput();
                $err = $process->getIncrementalErrorOutput();

                if ($out) {
                    foreach (explode("\n", trim($out)) as $line) {
                        if ($line) $this->line("  <fg=yellow>[{$name}]</> {$line}");
                    }
                }

                if ($err) {
                    foreach (explode("\n", trim($err)) as $line) {
                        if ($line) $this->line("  <fg=red>[{$name}]</> {$line}");
                    }
                }

                if (!$process->isRunning()) {
                    $this->error("[{$name}] stopped unexpectedly (exit code {$process->getExitCode()})");
                    $this->stopAll($servers);
                    return;
                }
            }

            usleep(200000); // 200ms polling
        }
    }

    private function stopAll(array $servers): void
    {
        $this->newLine();
        $this->info('Stopping all servers...');
        foreach ($servers as $name => $process) {
            if ($process->isRunning()) {
                $process->stop(3);
                $this->line("  Stopped {$name}");
            }
        }
    }
}
