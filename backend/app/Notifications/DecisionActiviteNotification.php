<?php

namespace App\Notifications;

use App\Models\Activite;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class DecisionActiviteNotification extends Notification
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
        $acceptee = $this->activite->etat_activ === 'planifie';

        return [
            'titre' => $acceptee
                ? 'Proposition d’activité acceptée'
                : 'Proposition d’activité refusée',

            'message' => $acceptee
                ? "Votre proposition d’activité « {$this->activite->sujet} » a été acceptée."
                : "Votre proposition d’activité « {$this->activite->sujet} » a été refusée.",

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