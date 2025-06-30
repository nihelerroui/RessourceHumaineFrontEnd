import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },

  {
    id: 2,
    label: "MENUITEMS.DASHBOARDS.TEXT",
    icon: "bx-home-circle",
    subItems: [
      {
        id: 3,
        label: "MENUITEMS.DASHBOARDS.LIST.DEFAULT",
        link: "/dashboard",
        parentId: 2,
      },
    ],
  },
  {
    id: 8,
    isLayout: true,
  },
  {
    id: 9,
    label: "MENUITEMS.PAGES.TEXT",
    isTitle: true,
  },
  {
    id: 1,
    label: 'MENUITEMS.UTILISATEURS.TEXT',
    icon: 'bx-file',
    link: '/users/list',
    roles: ['ADMINISTRATEUR']
  },
  {
    id: 1,
    label: 'MENUITEMS.PRESTATIONS.TEXT',
    icon: 'bx-file',
    link: '/prestations',
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 112,
    label: 'MENUITEMS.FACTURE_CLIENT_ADMIN.TEXT',
    icon: 'bx-receipt',
    link: '/factureclientadmin',
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 18,
    label: "MENUITEMS.CONTRATSOUSTRAITANT.TEXT",
    icon: "bx bx-message-alt-dots",
    link: "/contratsoustraitant",
     roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER','SOUS_TRAITANT']
  },
  {
    id: 19,
    label: "MENUITEMS.CONTRATCLIENTADMIN.TEXT",
    icon: "bx bx-message-alt-dots",
    link: "/contratclientadmin",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 21,
    label: "MENUITEMS.HISTORIQUECHIFFREAFFAIRE.TEXT",
    icon: "bx bx-message-alt-dots",
    link: "/historique-chiffreAffaire",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 10,
    label: "MENUITEMS.PAYS.TEXT",
    icon: "bx-calendar",
    link: "/pays/list",
    roles: ['ADMINISTRATEUR']
  },
  {
    id: 11,
    label: "MENUITEMS.SOCIETES.TEXT",
    icon: "bx-chat",
    link: "/societe/list",
    roles: ['ADMINISTRATEUR']
  },
  {
    id: 12,
    label: "MENUITEMS.CLIENTS.TEXT",
    icon: "bx-file",
    link: "/client/list",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 12,
    label: "MENUITEMS.FACTURES_SOUS_TRAITANT.TEXT",
    icon: "bx-file",
    link: "/factureSousTraitant/list",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER','SOUS_TRAITANT']
  },
  {
    id: 12,
    label: "MENUITEMS.FACTURES_ACHATS.TEXT",
    icon: "bx-file",
    link: "/facture/list",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 59,
    label: 'MENUITEMS.DEPENSES.TEXT',
    icon: 'bx-briefcase-alt-2',
    link: '/depenses',
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 59,
    label: 'MENUITEMS.RECETTES.TEXT',
    icon: 'bx-briefcase-alt-2',
    link: '/recettes/list',
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 12,
    label: "MENUITEMS.CAISSE.TEXT",
    icon: "bx-file",
    link: "/caisse",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 12,
    label: "MENUITEMS.TRESORERIE.TEXT",
    icon: "bx-file",
    link: "/tresorerie",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 12,
    label: "MENUITEMS.MAINOEUVRE.TEXT",
    icon: "bx-file",
    link: "/mainOeuvre/list",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },
  {
    id: 12,
    label: "MENUITEMS.HISTORIQUEMAINOEUVRE.TEXT",
    icon: "bx-file",
    link: "/historique-mainoeuvre/list",
    roles: ['ADMINISTRATEUR', 'RESPONSABLE_FINANCIER']
  },

];
