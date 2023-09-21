import query from "../database.js";

/****SUPPRESSION DE CONTACT */
export default (req, res) => {
  //on récupère les données transmises par le formulaire
  let contactsToDelete = req.body.contactsToDelete;

  //on vérifie que l'utilisateur a bien sélectionné des contacts à supprimer
  if (!contactsToDelete) {
    return res.status(400).send("Aucun contact sélectionné");
  }

  //on modifie la base de données
  //on supprime les contacts sélectionnés
  query(
    "DELETE FROM contacts WHERE id IN (?)",
    [contactsToDelete],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      //on redirige vers la page d'accueil
      res.redirect("/");
    }
  );
};
