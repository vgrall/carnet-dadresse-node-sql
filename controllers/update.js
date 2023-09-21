import query from "../database.js";

// AFFICHER LE FORMULAIRE DE MODIFICATION
export function updateContact(req, res) {
  let id = req.params.id;

  query("SELECT * FROM contacts WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(`Erreur lors de la récupération des données : ${err}`);
      return res.status(500).send("Erreur serveur");
    }

    if (result.length === 0) {
      return res.status(404).send(`Contact with id ${id} not found`);
    }

    res.render("contactForm", {
      title: "Modification d'un contact",
      action: `/contacts/${id}/update`,
      id: id,
      contact: result[0],
    });
  });
}

// TRAITER LA SOUMISSION DU FORMULAIRE DE MODIFICATION
export function updateContactSubmit(req, res) {
  let id = req.params.id;

  // On récupère les données transmises par le formulaire
  let contactData = {
    ...req.body,
  };

  query(
    "UPDATE contacts SET ? WHERE id = ?",
    [contactData, id],
    (err, result) => {
      if (err) {
        console.error(`Erreur lors de la mise à jour du contact : ${err}`);
        return res.status(500).send("Erreur serveur");
      }

      res.redirect("/");
    }
  );
}
