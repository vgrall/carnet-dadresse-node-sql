import query from "../database.js";
import { v4 } from "uuid";

// Créer le nouveau contact en générant l'id avec v4
// Faire la requête INSERT
// Répondre au client avec la redirection
export function addContact(req, res) {
  res.render("contactForm", {
    title: "Ajout d'un contact",
    action: "/contacts/add",
  });
}

export function addContactSubmit(req, res) {
  if (!req.body) {
    return res.status(400).send("Il faut remplir le formulaire");
  }
  const { civilite, lastName, firstName, phone, email } = req.body;
  const id = v4();
  const newContact = { id, civilite, lastName, firstName, phone, email };
  query("INSERT INTO contacts SET ?", newContact, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Une erreur s'est produite");
    }
    res.redirect("/");
  });
}
