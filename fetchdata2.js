const WebSocket = require("ws");
const fs = require("fs");
function expo(x, f) {
  return Number.parseFloat(x).toExponential(f);
}

fs.writeFile("Output.json", "", (err) => {
  if (err) throw err;
});
var ws = new WebSocket();
let listofdata;
let liste = [];
let listecomplete = [];
ws.on("message", function (data, flags) {
  data = JSON.parse(data);
  let fichier = data;
  if (data != undefined || data != null) {
    let a;
    if (typeof data.flush != "undefined") {
      a = Object.keys(fichier.flush);
      for (var k in a) {
        let montant = fichier.flush[a[k]].amount;
        let prix = fichier.flush[a[k]].price;
        let valeur = montant / prix;
        let prix2 = fichier.flush[a[k]].price;
        let valeur2 = fichier.flush[a[k]].amount;
        let nom = fichier.flush[a[k]].resource;
        let id = fichier.flush[a[k]].id;
        let element = {};
        element.name = nom;
        element.valeur = valeur;
        element.id = id;
        element.prix = prix2;
        element.montant = valeur2;

        listecomplete.push(element);

        if (liste.indexOf(element) === -1) {
          if (liste.length === 0) {
            liste.push(element);
          }
          let isthere = 0;

          for (let e in liste) {
            if (liste[e].name === element.name) {
              isthere = 1;
            }
          }
          if (isthere === 1) {
            for (let e in liste) {
              if (liste[e].name === element.name) {
                if (liste[e].valeur < element.valeur) {
                  liste[e] = element;
                }
              }
            }
          }
          if (isthere == 0) {
            liste.push(element);
          }
        }
      }
    } else if (typeof data.message != "undefined") {
      console.log(data.user + " : " + data.message);
      return;
    } else if (typeof data.add != "undefined") {
      if (Object.entries(fichier.delete).length != 0) {
        if (liste.indexOf(fichier.delete) != -1) {
          liste.splice(liste.indexOf(fichier.delete), 1);
        }
        if (listecomplete.indexOf(fichier.delete) != -1) {
          listecomplete.splice(listecomplete.indexOf(fichier.delete), 1);
        }
      }
      let b = Object.keys(fichier.delete);
      let c = Object.keys(fichier.add);
      if (Object.entries(fichier.add).length != 0) {
        for (var k in b) {
          let montant = fichier.add[c[k]].amount;
          let prix = fichier.add[c[k]].price;
          let valeur = montant / prix;
          let prix2 = fichier.add[c[k]].price;
          let valeur2 = fichier.add[c[k]].amount;
          let nom = fichier.add[c[k]].resource;
          let id = fichier.add[c[k]].id;
          let element = {};
          element.name = nom;
          element.valeur = valeur;
          element.id = id;
          element.prix = prix2;
          element.montant = valeur2;
          listecomplete.push(element);

          if (liste.indexOf(element) === -1) {
            if (liste.length === 0) {
              liste.push(element);
            }
            let isthere = 0;
            for (let e in liste) {
              if (liste[e].name === element.name) {
                isthere = 1;
              }
            }
            if (isthere == 0) {
              liste.push(element);
            }
            if (isthere === 1) {
              for (let e in listecomplete) {
                for (let s in liste) {
                  if (listecomplete[e].name === liste[s].name) {
                    if (listecomplete[e].valeur < liste[s].valeur) {
                      liste[s] = listecomplete[e];
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    fs.writeFile("Output.json", JSON.stringify(liste), (err) => {
      if (err) throw err;
    });
  }
});
