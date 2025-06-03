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
        link: "/",
        parentId: 2,
      },
      {
        id: 4,
        label: "MENUITEMS.DASHBOARDS.LIST.SAAS",
        link: "/",
        parentId: 2,
      },
      {
        id: 5,
        label: "MENUITEMS.DASHBOARDS.LIST.CRYPTO",
        link: "/",
        parentId: 2,
      },
      {
        id: 6,
        label: "MENUITEMS.DASHBOARDS.LIST.BLOG",
        link: "/",
        parentId: 2,
      },
      {
        id: 7,
        label: "MENUITEMS.DASHBOARDS.LIST.JOBS",
        link: "/",
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
    link: '/users/list'
  },
  {
    id: 1,
    label: 'MENUITEMS.PRESTATIONS.TEXT',
    icon: 'bx-file',
    link: '/prestations'
  },
  {
    id: 112,
    label: 'MENUITEMS.FACTURE_CLIENT_ADMIN.TEXT',
    icon: 'bx-receipt',
    link: '/factureclientadmin'
  },
  {
    id: 18,
    label: "MENUITEMS.CONTRATSOUSTRAITANT.TEXT",
    icon: "bx bx-message-alt-dots",
    link: "/contratsoustraitant",
  },
  {
    id: 19,
    label: "MENUITEMS.CONTRATCLIENTADMIN.TEXT",
    icon: "bx bx-message-alt-dots",
    link: "/contratclientadmin",
  },
  {
    id: 20,
    label: "MENUITEMS.CHIFFREAFFAIRE.TEXT",
    icon: "bx bx-message-alt-dots",
    link: "/chiffreAffaire",
  },
  {
    id: 21,
    label: "MENUITEMS.HISTORIQUECHIFFREAFFAIRE.TEXT",
    icon: "bx bx-message-alt-dots",
    link: "/historique-chiffreAffaire",
  },
  {
    id: 10,
    label: "MENUITEMS.PAYS.TEXT",
    icon: "bx-calendar",
    link: "/pays/list",
  },
  {
    id: 11,
    label: "MENUITEMS.SOCIETE.TEXT",
    icon: "bx-chat",
    link: "/societe/list",
  },
  {
    id: 12,
    label: "MENUITEMS.CLIENT.TEXT",
    icon: "bx-file",
    link: "/client/list",
  },
  {
    id: 12,
    label: "MENUITEMS.FACTURE.TEXT",
    icon: "bx-file",
    link: "/facture/list",
  },
  {
    id: 59,
    label: 'MENUITEMS.DEPENSES.TEXT',
    icon: 'bx-briefcase-alt-2',
    link: '/depenses'
  },
  {
    id: 12,
    label: "MENUITEMS.TRESORIE.TEXT",
    icon: "bx-file",
    link: "/tresorie",
  },
  {
    id: 12,
    label: "MENUITEMS.MAINOEUVRE.TEXT",
    icon: "bx-file",
    link: "/mainOeuvre/list",
  },
  {
    id: 12,
    label: "MENUITEMS.HISTORIQUEMAINOEUVRE.TEXT",
    icon: "bx-file",
    link: "/historique-mainoeuvre/list",
  },

 
 
 

 

 
];
