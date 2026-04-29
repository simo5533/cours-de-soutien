/**
 * Un cours ou exercice sans cible de groupe / année est visible par tous les élèves
 * (toujours sous réserve de `published`). Sinon, il faut correspondre aux deux cibles
 * renseignées sur le contenu.
 */

export function elevePeutVoirContenu(params: {
  eleveGroupe: string | null;
  eleveAnnee: string | null;
  groupeCible: string | null;
  anneeScolaireCible: string | null;
}) {
  const { eleveGroupe, eleveAnnee, groupeCible, anneeScolaireCible } = params;

  if (groupeCible != null && groupeCible !== "" && groupeCible !== eleveGroupe) {
    return false;
  }
  if (
    anneeScolaireCible != null &&
    anneeScolaireCible !== "" &&
    anneeScolaireCible !== eleveAnnee
  ) {
    return false;
  }
  return true;
}

/** Conditions Prisma (AND) pour restreindre cours / exercices à un élève. */
export function andClauseContenuPourEleve(user: {
  groupe: string | null;
  anneeScolaire: string | null;
}) {
  return [
    {
      OR: [
        { groupeCible: null },
        ...(user.groupe ? [{ groupeCible: user.groupe }] : []),
      ],
    },
    {
      OR: [
        { anneeScolaireCible: null },
        ...(user.anneeScolaire
          ? [{ anneeScolaireCible: user.anneeScolaire }]
          : []),
      ],
    },
  ];
}

/** Créneaux sans cible groupe / année = visibles par tous les élèves. */
export function andClauseSchedulePourEleve(user: {
  groupe: string | null;
  anneeScolaire: string | null;
}) {
  return [
    {
      OR: [
        { groupe: null },
        ...(user.groupe ? [{ groupe: user.groupe }] : []),
      ],
    },
    {
      OR: [
        { anneeScolaire: null },
        ...(user.anneeScolaire
          ? [{ anneeScolaire: user.anneeScolaire }]
          : []),
      ],
    },
  ];
}
