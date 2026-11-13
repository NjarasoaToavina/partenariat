<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PublicationNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $titre,
        public string $message,
        public int $id_pub,
        public string $action
    ) {}

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'titre' => $this->titre,
            'message' => $this->message,
            'id_pub' => $this->id_pub,
            'action' => $this->action,
            'url' => '/publications',
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new \Illuminate\Notifications\Messages\BroadcastMessage(
            $this->toArray($notifiable)
        );
    }
}
