import query from "../database.js";
import formidable from "formidable";
import fs from "fs";
import { v4 } from "uuid";

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
  const formData = formidable({
    allowEmptyFiles: true,
    minFileSize: 0,
  });

  // On récupère les données transmises par le formulaire
  formData.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Une erreur s'est produite");
    }

    const updateContact = () =>
      query(
        `UPDATE contacts SET civilite = ?, lastName = ?, firstName = ?, phone = ?, email = ? WHERE id = ?`,
        [
          fields.civilite,
          fields.lastName,
          fields.firstName,
          fields.phone,
          fields.email,
          req.params.id,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Une erreur s'est produite");
          }
          res.redirect("/");
        }
      );

    if (files.image[0].originalFilename === "") {
      // Si l'utilisateur n'a pas choisi de nouvelle image, on ne modifie pas l'image
      updateContact();
    } else {
      // récupération du chemin temporaire du fichier
      let oldPath = files.image[0].filepath;
      // génération du nouveau chemin du fichier
      let newPath = "public/images/" + files.image[0].originalFilename;
      // Récupération du nom du fichier pour le stocker dans la BDD
      let imageName = files.image[0].originalFilename;

      // copie le fichier depuis le dossier temporaire vers le dossier public/images
      fs.copyFile(oldPath, newPath, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Une erreur s'est produite");
        }

        // Mise à jour de la base de données avec la nouvelle image
        updateContact();
      });
    }
  });
}
