export const ROLES = [
  { key: "responsable", label: "Responsable" },
  { key: "service", label: "Service" },
  { key: "partenaire", label: "Partenaire" },
  { key: "etudiant", label: "Étudiant" },
];

// Champs communs à tous les rôles : nom complet, email, mot de passe, photo.
// Ici on ne liste que les champs EN PLUS, propres à chaque rôle.
export const ROLE_EXTRA_FIELDS = {
  responsable: [],
  service: ["nom_service"],
  partenaire: ["fonction"],
  etudiant: ["filiere", "niveau"],
};

export function roleHasField(role, field) {
  return ROLE_EXTRA_FIELDS[role]?.includes(field) ?? false;
}

const DEFAULT_ROLE = "etudiant";

// Valide un rôle venant de l'URL (/signup/:role). Si absent ou inconnu,
// on retombe sur "etudiant" -> impossible d'atteindre un autre rôle
// sans connaître le bon lien.
export function resolveRole(roleFromUrl) {
  const isValid = ROLES.some((r) => r.key === roleFromUrl);
  return isValid ? roleFromUrl : DEFAULT_ROLE;
}