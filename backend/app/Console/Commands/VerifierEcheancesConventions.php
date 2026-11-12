<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Convention;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use App\Notifications\EcheanceConventionNotification;

class VerifierEcheancesConventions extends Command
{
    protected $signature = 'conventions:verifier-echeances';

    protected $description = 'Vérifier les échéances des conventions et envoyer les rappels';

    public function handle()
    {
        $delais = [30, 15, 7, 0];

        $responsables = User::role('responsable')->get();

        $conventions = Convention::with('partenariat')
            ->whereNotNull('date_fin_conv')
            ->get();

        $aujourdHui = Carbon::today();

        foreach ($conventions as $convention) {

            $dateFin = Carbon::parse($convention->date_fin_conv)->startOfDay();

            $joursRestants = (int) $aujourdHui->diffInDays($dateFin, false);

            if (!in_array($joursRestants, $delais, true)) {
                continue;
            }

            foreach ($responsables as $responsable) {

                // Éviter d'envoyer plusieurs fois le même rappel
               $dejaNotifie = $responsable->notifications()
                    ->where('type', EcheanceConventionNotification::class)
                    ->whereRaw("data::jsonb ->> 'id_conv' = ?", [
                        (string) $convention->getKey()
                    ])
                    ->whereRaw("data::jsonb ->> 'jours_restants' = ?", [
                        (string) $joursRestants
                    ])
                    ->exists();

                if ($dejaNotifie) {
                    continue;
                }
                    
                $responsable->notify(
                    new EcheanceConventionNotification(
                        $convention,
                        $joursRestants
                    )
                );
            }
        }

        $this->info('Vérification des échéances terminée.');

        return self::SUCCESS;
    }
}