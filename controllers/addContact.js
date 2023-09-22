import query from "../database.js";
import { v4 } from "uuid";
import formidable from "formidable";
import fs from "fs";

//AFFICHAGE DU FORMULAIRE
export function addContact(req, res) {
  res.render("contactForm", {
    title: "Ajout d'un contact",
    action: "/contacts/add",
  });
}

// export du controller
export function addContactSubmit(req, res) {
  const formData = formidable();

  // recuperation des champs et des fichiers
  formData.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Une erreur s'est produite");
    }

    // récupération du chemin temporaire du fichier
    let oldPath = files.image[0].filepath;
    // génération du nouveau chemin du fichier
    let newPath = "./public/images/" + files.image[0].originalFilename;
    // Récupération du nom du fichier pour le stocker dans la BDD
    let imageName = files.image[0].originalFilename;

    // copie le fichier depuis le dossier temporaire vers le dossier public/images
    fs.copyFile(oldPath, newPath, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Une erreur s'est produite");
      }

      // insertion de la photo dans la BDD
      query(
        `INSERT INTO contacts(id, civilite, lastName, firstName, phone, email, image) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        [
          v4(),
          fields.civilite,
          fields.lastName,
          fields.firstName,
          fields.phone,
          fields.email,
          imageName,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Une erreur s'est produite");
          }
          res.redirect("/");
        }
      );
    });
  });
}
