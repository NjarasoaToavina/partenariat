<?php

namespace App\Http\Controllers;

use App\Models\Partenariat;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        // Année sélectionnée ou année actuelle
        $year = (int) $request->input('year', now()->year);

        // Les campus
        $campus = ['ESMIA', 'BEATI'];

        // Les 7 statuts
        $statuts = [
            'prospecte',
            'cours',
            'attente',
            'finalisation',
            'signe',
            'officieux',
            'renouvele',
        ];

        // Récupérer uniquement les champs nécessaires
        $partenariats = Partenariat::query()
            ->get([
                'campus_part',
                'statut_part',
                'created_at',
            ]);

        // Statistiques par campus et par statut
        $campusStats = collect($campus)->map(function ($nomCampus) use ($partenariats, $statuts) {

            $partenariatsCampus = $partenariats->where('campus_part', $nomCampus);

            $row = [
                'key' => strtolower($nomCampus),
                'name' => $nomCampus,
                'badge' => $nomCampus,
            ];

            foreach ($statuts as $statut) {
                $row[$statut] = $partenariatsCampus
                    ->where('statut_part', $statut)
                    ->count();
            }

            $row['total'] = $partenariatsCampus->count();

            return $row;
        });

        // Évolution mensuelle pour l'année sélectionnée
        $mois = [
            'Jan', 'Fév', 'Mar', 'Avr',
            'Mai', 'Juin', 'Juil', 'Août',
            'Sep', 'Oct', 'Nov', 'Déc',
        ];

        $evolution = collect($mois)->map(function ($nomMois, $index) use ($partenariats, $year) {

            $numeroMois = $index + 1;

            $partenariatsMois = $partenariats->filter(function ($partenariat) use ($year, $numeroMois) {
                return $partenariat->created_at
                    && $partenariat->created_at->year === $year
                    && $partenariat->created_at->month === $numeroMois;
            });

            return [
                'mois' => $nomMois,
                'esmia' => $partenariatsMois
                    ->where('campus_part', 'ESMIA')
                    ->count(),
                'beati' => $partenariatsMois
                    ->where('campus_part', 'BEATI')
                    ->count(),
            ];
        });

        // Éviter d'afficher les mois futurs pour l'année actuelle
        if ($year === now()->year) {
            $evolution = $evolution->take(now()->month);
        }

        return response()->json([
            'campus' => $campusStats->values(),
            'evolution' => $evolution->values(),
            'year' => $year,
        ]);
    }
}