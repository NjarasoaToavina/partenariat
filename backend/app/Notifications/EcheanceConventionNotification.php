<?php

namespace App\Notifications;

use App\Models\Convention;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class EcheanceConventionNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Convention $convention,
        public int $joursRestants
    ) {}

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        $partenaire = $this->convention->partenariat?->nom_part
            ?? 'Partenaire non renseigné';

        return [
            'titre' => 'Rappel d’échéance de convention',
            'message' => "La convention n°{$this->convention->num_conv} avec {$partenaire} arrive à échéance dans {$this->joursRestants} jour(s).",
            'id_conv' => $this->convention->getKey(),
            'url' => '/conventions',
            'date_fin_conv' => $this->convention->date_fin_conv,
            'jours_restants' => $this->joursRestants,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}