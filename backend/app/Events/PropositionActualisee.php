<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PropositionActualisee implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public string $type,
        public string $action,
        public int $id
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('propositions'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'proposition.actualisee';
    }

    public function broadcastWith(): array
    {
        return [
            'type' => $this->type,
            'action' => $this->action,
            'id' => $this->id,
        ];
    }
}