import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },

  // Tableau de bord
   {
  id: 2,
  label: "MENUITEMS.DASHBOARD.TEXT",
  icon: "bx bx-home-circle",
  link: "dashboards/default",
   roles: ["ADMINISTRATEUR"],
},

  {
    id: 8,
    isLayout: true,
  },

  // Utilisateurs
  {
    id: 10,
    label: "MENUITEMS.UTILISATEURS.TEXT",
    icon: "bx bx-user",
    link: "/users/list",
    roles: ["ADMINISTRATEUR"],
  },

  {
    id: 11,
    label: "MENUITEMS.PRESTATIONS.TEXT",
    icon: "bx bx-briefcase",
    link: "/prestations",
    roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
  },

  // Géolocalisation
  {
    id: 20,
    label: "MENUITEMS.GEOLOCALISATION.TEXT",
    icon: "bx bx-map",
    subItems: [
      {
        id: 21,
        label: "MENUITEMS.PAYS.TEXT",
        icon: "bx bx-globe",
        link: "/pays/list",
        roles: ["ADMINISTRATEUR"],
        parentId: 20,
      },
      {
        id: 22,
        label: "MENUITEMS.SOCIETES.TEXT",
        icon: "bx bx-building",
        link: "/societe/list",
        roles: ["ADMINISTRATEUR"],
        parentId: 20,
      },
      {
        id: 23,
        label: "MENUITEMS.CLIENTS.TEXT",
        icon: "bx bx-group",
        link: "/client/list",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 20,
      },
    ],
  },

  // Gestion financière
  {
    id: 30,
    label: "MENUITEMS.GESTION_FINANCIERE.TEXT",
    icon: "bx bx-wallet",
    subItems: [
      {
        id: 31,
        label: "MENUITEMS.FACTURE_CLIENT.TEXT",
        icon: "bx bx-receipt",
        link: "/factureclientadmin",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 30,
      },
      {
        id: 32,
        label: "MENUITEMS.FACTURES_SOUS_TRAITANT.TEXT",
        icon: "bx bx-receipt",
        link: "/factureSousTraitant/list",
        roles: ["ADMINISTRATEUR","SOUS_TRAITANT"],
        parentId: 30,
      },
      {
        id: 33,
        label: "MENUITEMS.FACTURES_ACHATS.TEXT",
        icon: "bx bx-receipt",
        link: "/facture/list",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 30,
      },
      {
        id: 34,
        label: "MENUITEMS.DEPENSES.TEXT",
        icon: "bx bx-coin-stack",
        link: "/depenses",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 30,
      },
      {
        id: 35,
        label: "MENUITEMS.RECETTES.TEXT",
        icon: "bx bx-dollar",
        link: "/recettes/list",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 30,
      },
      {
        id: 36,
        label: "MENUITEMS.CAISSE.TEXT",
        icon: "bx bx-cash",
        link: "/caisse",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 30,
      },
      {
        id: 37,
        label: "MENUITEMS.TRESORERIE.TEXT",
        icon: "bx bx-line-chart",
        link: "/tresorerie",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 30,
      },
    ],
  },

  // Main d'œuvre
  {
    id: 40,
    label: "MENUITEMS.MAINOEUVRE.TEXT",
    icon: "bx bx-group",
    subItems: [
      {
        id: 41,
        label: "MENUITEMS.MAINOEUVRE.TEXT",
        icon: "bx bx-user-voice",
        link: "/mainOeuvre/list",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 40,
      },
      {
        id: 42,
        label: "MENUITEMS.HISTORIQUEMAINOEUVRE.TEXT",
        icon: "bx bx-history",
        link: "/historique-mainoeuvre/list",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 40,
      },
    ],
  },

  // Contrats
  {
    id: 50,
    label: "MENUITEMS.CONTRATS.TEXT",
    icon: "bx bx-file-blank",
    subItems: [
      {
        id: 51,
        label: "MENUITEMS.CONTRATSOUSTRAITANT.TEXT",
        icon: "bx bx-message-alt-dots",
        link: "/contratsoustraitant",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER", "SOUS_TRAITANT"],
        parentId: 50,
      },
      {
        id: 52,
        label: "MENUITEMS.CONTRATCLIENTADMIN.TEXT",
        icon: "bx bx-message-alt-dots",
        link: "/contratclientadmin",
        roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
        parentId: 50,
      },
    ],
  },

  // Historique Chiffre d'affaires
  {
    id: 60,
    label: "MENUITEMS.HISTORIQUECHIFFREAFFAIRE.TEXT",
    icon: "bx bx-bar-chart-alt-2",
    link: "/historique-chiffreAffaire",
    roles: ["ADMINISTRATEUR", "RESPONSABLE_FINANCIER"],
  },
];
