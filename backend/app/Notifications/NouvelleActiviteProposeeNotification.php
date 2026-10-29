<?php

namespace App\Notifications;

use App\Models\Activite;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class NouvelleActiviteProposeeNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Activite $activite
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'titre' => 'Nouvelle proposition d’activité',
            'message' => "Le partenaire {$this->activite->user->name} a proposé une activité : {$this->activite->sujet}",
            'id_activ' => $this->activite->id_activ,
            'url' => '/activites',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage(
            $this->toArray($notifiable)
        );
    }
}