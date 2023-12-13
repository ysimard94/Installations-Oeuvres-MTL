import {dataOeuvresMtl} from "../data/oeuvre.js";
import Catalogue from "./Catalogue.mjs";
import Filtre from "./Filtre.mjs";
import Trie from "./Trie.mjs";
import InfoModal from "./InfoModal.mjs";
import Recherche from "./Recherche.mjs";


export default class Application
{
    #oFiltre;
    #oCatalogue;
    #oTrie;
    #oInfoModal
    #aTrie;
    #oRecherche;
    constructor()
    {
        // Initialisation des sélecteurs du DOM de base
        const domCatalogue = document.querySelector(".catalogue");
        const domListeCategorie = document.querySelector(".liste-categorie");
        const domBoutonsAffichage = document.querySelector(".boutons-listes");
        const domFiltreCategories = document.querySelector(".liste-categorie");
        const boutonReinitialiser = document.querySelector(".reinitialiser");
        const boutonTrieTitre = document.querySelector(".btn-liste-titre");
        const boutonTrieArtistes = document.querySelector(".btn-liste-artistes");
        const boutonRecherche = document.querySelector(".btn-rechercher");
        const boutonFermerBoiteModale = document.querySelector(".fermer-boite");
        const boiteModale = document.querySelector("dialog");

        // Initialisation des écouteurs d'évènements de base
        domListeCategorie.addEventListener("click", this.appliquerFiltre.bind(this));
        domBoutonsAffichage.addEventListener("click", this.appliquerAffichage);
        boutonReinitialiser.addEventListener("click", this.reinitialiserFiltre.bind(this));
        boutonTrieTitre.addEventListener("click", this.listeNom.bind(this));
        boutonTrieArtistes.addEventListener("click", this.listeArtistes.bind(this));
        boutonRecherche.addEventListener("click", this.rechercheOeuvre.bind(this));
        domCatalogue.addEventListener("click", this.afficherBoiteModale.bind(this));
        
        
        this.#oCatalogue = new Catalogue(domCatalogue);
        
        this.#oTrie = new Trie();
        this.#aTrie = dataOeuvresMtl;
        
        this.#oRecherche = new Recherche();
        
        this.#oFiltre = new Filtre(domListeCategorie);
        this.#oFiltre.setCategorie(dataOeuvresMtl);
        this.#oFiltre.rendu();
        
        domFiltreCategories.addEventListener("click", this.ouvrirGabarit);
        
        this.#oCatalogue.convertionProp(dataOeuvresMtl);
        this.#oCatalogue.setOeuvres(dataOeuvresMtl);
        this.#oCatalogue.rendu();
        
        this.#oInfoModal = new InfoModal(boiteModale);
        this.#oInfoModal.setOeuvres(dataOeuvresMtl);

        boutonFermerBoiteModale.addEventListener("click", this.fermerBoiteModale);
    };

    // Méthode qui va changer l'orientation de l'affichage des cartes en lignes ou en grille
    appliquerAffichage(e)
    {
        const catalogue = document.querySelector(".catalogue");
        const cible = e.target;

        // Va mettre une bordure indiquant le bouton sélectionné, et va l'enlever au précédent
        if(cible.classList.contains("material-symbols-outlined"))
        {
            if(cible.dataset.jsActif == 0)
            {    
                document.querySelectorAll("span[data-js-actif='1']").forEach((unElement)=>
                {
                    unElement.dataset.jsActif = 0;
                });

                cible.dataset.jsActif = 1;
            };

            // Si le dataset est actif il va enlever la classe présentant les cartes en ligne, sinon l'ajoute
            if(cible.classList.contains("liste-grid") && cible.dataset.jsActif == 1)
            {
                catalogue.classList.remove("catalogue-ligne");
            }
            else
            {
                catalogue.classList.add("catalogue-ligne");
            };
        };
    };

    // Va appliquer la valeur du filtre sélectionné et faire un tableau avec les objets aillant les valeurs correspondantes
    appliquerFiltre(e)
    {
        const cible = e.target;
        const filtreApplique = document.querySelector(".filtre-applique");


        let dataFiltre;
        if(cible.classList.contains("choixFiltre"))
        {
            // Si au clic du filtre il est déjà actif, il retourne une valeur null à la méthode
            // ce qui va retourner le tableau initial ainsi que d'enlever la sélection de ce filtre
            if(cible.dataset.jsActif == 1)
            {
                dataFiltre = this.#oFiltre.appliquerFiltre();    
                cible.dataset.jsActif = 0;
                filtreApplique.innerHTML = "Aucun filtre appliqué";
            }
            // Sinon celui-ci retourne en paramètre la catégorie et va retourner un tableau avec les données correspondantes pour l'afficher
            else
            {
                let param = {
                    cat: cible.dataset.jsCat,
                    valeur : cible.dataset.jsCatValeur
                };

                // Pour enlever la bordure de tout filtre sélectionné antérieurement pour l'appliquer que sur le nouveau
                document.querySelectorAll("li[data-js-actif='1']").forEach((unElement)=>
                {
                    unElement.dataset.jsActif = 0;
                })

                cible.dataset.jsActif = 1;
                dataFiltre = this.#oFiltre.appliquerFiltre(param);
                filtreApplique.innerHTML = "Filtre appliqué : " + param['valeur'];
            };

            this.#oCatalogue.setOeuvres(dataFiltre);
            this.#aTrie = dataFiltre;
            this.#oCatalogue.rendu();
        };
    };

    // Va retourner un tableau avec la liste d'oeuvres triée par titre en ordre ascendante de base, sinon avec la valeur sélectionnée
    listeNom() {
        const param = 
        {
            type: "Titre",
            ordre: "ASC"
        }
        param.ordre = document.querySelector("[name='ordre']:checked")?.value || "ASC";
        let res = this.#oTrie.listeTrie(param, this.#aTrie);

        this.#oCatalogue.setOeuvres(res);
        this.#oCatalogue.rendu();
        // this.afficher(res);
    };

    // Va retourner un tableau avec la liste d'oeuvres triée par artistes en ordre ascendante de base, sinon avec la valeur sélectionnée
    listeArtistes() 
    {
        const param = 
        {
            type: "Artistes",
            ordre: "ASC"
        };
        param.ordre = document.querySelector("[name='ordre']:checked")?.value || "ASC";
        let res = this.#oTrie.listeTrie(param, this.#aTrie);
        this.#oCatalogue.setOeuvres(res);
        this.#oCatalogue.rendu();
    };

    // Va parcourir la liste et retourner un tableau selon la valeur rentrée par l'utilisateur
    rechercheOeuvre() 
    {
        const param = 
        {
            valeur: ""
        }

        param.valeur = document.querySelector('[name="champs-rechercher"]')?.value || "";

        let res = this.#oRecherche.rechercheListe(param, this.#aTrie);

        this.#oCatalogue.setOeuvres(res);
        this.#oCatalogue.rendu();
    };

    // Sert à ouvrir et fermer les gabarits de filtres au clic selon son état
    ouvrirGabarit(e){
        const cible = e.target;
        const cibleVoisin = cible.nextSibling;

        let bouton = cible.querySelector("span");

        if(cible.classList.contains("filtre-bouton") && !bouton.classList.contains("liste-ferme"))
        {
            bouton.classList.add("liste-ferme");
            cibleVoisin.classList.add("filtre-ferme");
        }
        else 
        {
            bouton.classList.remove("liste-ferme");
            cibleVoisin.classList.remove("filtre-ferme");
        };
    };

    // Au clic du bouton de réinitialisation, la méthode enlève toute sélection de filtre et réinitialise la liste d'oeuvres avec celle de base et l'affiche
    reinitialiserFiltre()
    {
        const boutonsFiltres = document.querySelectorAll(".choixFiltre");
        const filtreApplique = document.querySelector(".filtre-applique");
        
        filtreApplique.innerHTML = "Aucun filtre appliqué";
        
        this.#oFiltre.reinitialiseFiltre(boutonsFiltres);

        this.#aTrie = dataOeuvresMtl;
        this.#oCatalogue.setOeuvres(dataOeuvresMtl);
        this.#oCatalogue.rendu();
    };

    // Va ouvrir une boite modale contenant des informations plus détaillées de la carte cliquée
    afficherBoiteModale(e)
    {
        const boiteModale = document.querySelector("dialog");
        let cible = e.target;
        
        // Si l'élément cliqué est une carte ou si son parent est une carte, on envoie son titre en paramètre pour comparer 
        //et trouver avec lequel il correspond dans la liste pour insérer les informations supplémentaire dans la boite modale
        if(cible.closest('article').classList.contains("carte"))
        {
            boiteModale.open = true;
            let cibleParent = cible.closest('article');
            let cibleOeuvre = cibleParent.querySelector('h2');
            
            this.#oInfoModal.insererInformations(cibleOeuvre);
        }

        const boutonFermerBoiteModale = boiteModale.querySelector("button");
        
        // J'ajoute un écouteur d'évènement ici pour qu'il soit sur le bouton de fermeture de la boite modale généré
        boutonFermerBoiteModale.addEventListener("click", this.fermerBoiteModale);
    }

    // Ferme la boite modale au clic du bouton
    fermerBoiteModale()
    {
        this.parentElement.open = false;
    }
};