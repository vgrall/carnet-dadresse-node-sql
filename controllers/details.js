import query from "../database.js";

// DÉTAIL DU CONTACT
export default (req, res) => {
  // Récupération de l'identifiant du contact à afficher
  let id = req.params.id;

  // On vérifie que l'utilisateur a bien sélectionné un contact
  if (!id) {
    return res.status(400).send("Aucun contact sélectionné");
  }

  // On récupère les données de la base de données en utilisant le paramètre id
  query("SELECT * FROM contacts WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(`Erreur lors de la récupération des données ${err}`);
      res.status(500).send("Erreur lors de la récupération des données");
      return;
    }

    if (result.length === 0) {
      return res.status(404).send("Contact non trouvé");
    }

    // La variable "result" contient un tableau de résultats, nous prenons le premier élément
    const contact = result[0];

    // Rendre la vue "detail.ejs" avec les données du contact
    res.render("details", { id: id, contact });
  });
};
