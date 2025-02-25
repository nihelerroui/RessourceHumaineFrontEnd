import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/',
                parentId: 2
            },
            {
                id: 4,
                label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
                link: '/',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARDS.LIST.CRYPTO',
                link: '/',
                parentId: 2
            },
            {
                id: 6,
                label: 'MENUITEMS.DASHBOARDS.LIST.BLOG',
                link: '/',
                parentId: 2
            },
            {
                id: 7,
                label: 'MENUITEMS.DASHBOARDS.LIST.JOBS',
                link: '/',
                parentId: 2,
            },
        ]
    },
    {
        id: 8,
        isLayout: true
    },
    {
        id: 9,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 10,
        label: 'MENUITEMS.CALENDAR.TEXT',
        icon: 'bx-calendar',
        link: '/',
    },
    {
        id: 11,
        label: 'MENUITEMS.CHAT.TEXT',
        icon: 'bx-chat',
        link: '/',

    },
    {
        id: 12,
        label: 'MENUITEMS.FILEMANAGER.TEXT',
        icon: 'bx-file',
        link: '/',
    },
    {
        id: 13,
        label: 'MENUITEMS.ECOMMERCE.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 14,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTS',
                link: '/',
                parentId: 13
            },
            {
                id: 15,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTDETAIL',
                link: '/',
                parentId: 13
            },
            {
                id: 16,
                label: 'MENUITEMS.ECOMMERCE.LIST.ORDERS',
                link: '/',
                parentId: 13
            },
            {
                id: 17,
                label: 'MENUITEMS.ECOMMERCE.LIST.CUSTOMERS',
                link: '/',
                parentId: 13
            },
            {
                id: 18,
                label: 'MENUITEMS.ECOMMERCE.LIST.CART',
                link: '/',
                parentId: 13
            },
            {
                id: 19,
                label: 'MENUITEMS.ECOMMERCE.LIST.CHECKOUT',
                link: '/',
                parentId: 13
            },
            {
                id: 20,
                label: 'MENUITEMS.ECOMMERCE.LIST.SHOPS',
                link: '/',
                parentId: 13
            },
            {
                id: 21,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDPRODUCT',
                link: '/',
                parentId: 13
            },
        ]
    },
    {
        id: 22,
        label: 'MENUITEMS.CRYPTO.TEXT',
        icon: 'bx-bitcoin',
        subItems: [
            {
                id: 23,
                label: 'MENUITEMS.CRYPTO.LIST.WALLET',
                link: '/',
                parentId: 22
            },
            {
                id: 24,
                label: 'MENUITEMS.CRYPTO.LIST.BUY/SELL',
                link: '/',
                parentId: 22
            },
            {
                id: 25,
                label: 'MENUITEMS.CRYPTO.LIST.EXCHANGE',
                link: '/',
                parentId: 22
            },
            {
                id: 26,
                label: 'MENUITEMS.CRYPTO.LIST.LENDING',
                link: '/',
                parentId: 22
            },
            {
                id: 27,
                label: 'MENUITEMS.CRYPTO.LIST.ORDERS',
                link: '/',
                parentId: 22
            },
            {
                id: 28,
                label: 'MENUITEMS.CRYPTO.LIST.KYCAPPLICATION',
                link: '/',
                parentId: 22
            },
            {
                id: 29,
                label: 'MENUITEMS.CRYPTO.LIST.ICOLANDING',
                link: '/',
                parentId: 22
            }
        ]
    },
    {
        id: 30,
        label: 'MENUITEMS.EMAIL.TEXT',
        icon: 'bx-envelope',
        subItems: [
            {
                id: 31,
                label: 'MENUITEMS.EMAIL.LIST.INBOX',
                link: '/',
                parentId: 30
            },
            {
                id: 32,
                label: 'MENUITEMS.EMAIL.LIST.READEMAIL',
                link: '/',
                parentId: 30
            },
            {
                id: 33,
                label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.TEXT',
                badge: {
                    variant: 'success',
                    text: 'MENUITEMS.EMAIL.LIST.TEMPLATE.BADGE',
                },
                parentId: 30,
                subItems: [
                    {
                        id: 34,
                        label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BASIC',
                        link: '/',
                        parentId: 30
                    },
                    {
                        id: 35,
                        label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.ALERT',
                        link: '/',
                        parentId: 30
                    },
                    {
                        id: 36,
                        label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BILLING',
                        link: '/',
                        parentId: 30
                    }
                ]
            }
        ]
    },
    {
        id: 37,
        label: 'MENUITEMS.INVOICES.TEXT',
        icon: 'bx-receipt',
        subItems: [
            {
                id: 38,
                label: 'MENUITEMS.INVOICES.LIST.INVOICELIST',
                link: '/',
                parentId: 37
            },
            {
                id: 39,
                label: 'MENUITEMS.INVOICES.LIST.INVOICEDETAIL',
                link: '/',
                parentId: 37
            },
        ]
    },
    {
        id: 40,
        label: 'MENUITEMS.PROJECTS.TEXT',
        icon: 'bx-briefcase-alt-2',
        subItems: [
            {
                id: 41,
                label: 'MENUITEMS.PROJECTS.LIST.GRID',
                link: '/',
                parentId: 40
            },
            {
                id: 42,
                label: 'MENUITEMS.PROJECTS.LIST.PROJECTLIST',
                link: '/',
                parentId: 40
            },
            {
                id: 43,
                label: 'MENUITEMS.PROJECTS.LIST.OVERVIEW',
                link: '/',
                parentId: 40
            },
            {
                id: 44,
                label: 'MENUITEMS.PROJECTS.LIST.CREATE',
                link: '/',
                parentId: 40
            }
        ]
    },
    {
        id: 45,
        label: 'MENUITEMS.TASKS.TEXT',
        icon: 'bx-task',
        subItems: [
            {
                id: 46,
                label: 'MENUITEMS.TASKS.LIST.TASKLIST',
                link: '/',
                parentId: 45
            },
            {
                id: 47,
                label: 'MENUITEMS.TASKS.LIST.KANBAN',
                link: '/',
                parentId: 45
            },
            {
                id: 48,
                label: 'MENUITEMS.TASKS.LIST.CREATETASK',
                link: '/',
                parentId: 45
            }
        ]
    },
    {
        id: 49,
        label: 'MENUITEMS.CONTACTS.TEXT',
        icon: 'bxs-user-detail',
        subItems: [
            {
                id: 50,
                label: 'MENUITEMS.CONTACTS.LIST.USERGRID',
                link: '/',
                parentId: 49
            },
            {
                id: 51,
                label: 'MENUITEMS.CONTACTS.LIST.USERLIST',
                link: '/',
                parentId: 49
            },
            {
                id: 52,
                label: 'MENUITEMS.CONTACTS.LIST.PROFILE',
                link: '/',
                parentId: 49
            }
        ]
    },
    {
        id: 53,
        label: 'MENUITEMS.BLOG.TEXT',
        icon: 'bx-file',
        subItems: [
            {
                id: 54,
                label: 'MENUITEMS.BLOG.LIST.BLOGLIST',
                link: '/',
                parentId: 53
            },
            {
                id: 55,
                label: 'MENUITEMS.BLOG.LIST.BLOGGRID',
                link: '/',
                parentId: 53
            },
            {
                id: 56,
                label: 'MENUITEMS.BLOG.LIST.DETAIL',
                link: '/',
                parentId: 53
            },
        ]
    },
    {
        id: 57,
        label: 'MENUITEMS.JOBS.TEXT',
        icon: 'bx-briefcase-alt',
        subItems: [
            {
                id: 58,
                label: 'MENUITEMS.JOBS.LIST.JOBLIST',
                link: '/',
                parentId: 57
            },
            {
                id: 59,
                label: 'MENUITEMS.JOBS.LIST.JOBGRID',
                link: '/',
                parentId: 57
            },
            {
                id: 60,
                label: 'MENUITEMS.JOBS.LIST.APPLYJOB',
                link: '/',
                parentId: 57
            },
            {
                id: 61,
                label: 'MENUITEMS.JOBS.LIST.JOBDETAILS',
                link: '/',
                parentId: 57
            },
            {
                id: 62,
                label: 'MENUITEMS.JOBS.LIST.JOBCATEGORIES',
                link: '/',
                parentId: 57
            },
            {
                id: 63,
                label: 'MENUITEMS.JOBS.LIST.CANDIDATE.TEXT',
                badge: {
                    variant: 'success',
                    text: 'MENUITEMS.EMAIL.LIST.TEMPLATE.BADGE',
                },
                parentId: 57,
                subItems: [
                    {
                        id: 64,
                        label: 'MENUITEMS.JOBS.LIST.CANDIDATE.LIST.LIST',
                        link: '/',
                        parentId: 57
                    },
                    {
                        id: 65,
                        label: 'MENUITEMS.JOBS.LIST.CANDIDATE.LIST.OVERVIEW',
                        link: '/',
                        parentId: 57
                    }
                ]
            }
        ]
    },
    {
        id: 66,
        label: 'MENUITEMS.PAGES.TEXT',
        isTitle: true
    },
    {
        id: 67,
        label: 'MENUITEMS.AUTHENTICATION.TEXT',
        icon: 'bx-user-circle',
        subItems: [
            {
                id: 68,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                link: '/',
                parentId: 67
            },
            {
                id: 69,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN2',
                link: '/',
                parentId: 67
            },
            {
                id: 70,
                label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                link: '/',
                parentId: 67
            },
            {
                id: 71,
                label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER2',
                link: '/',
                parentId: 67
            },
            {
                id: 72,
                label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                link: '/',
                parentId: 67
            },
            {
                id: 73,
                label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD2',
                link: '/',
                parentId: 67
            },
            {
                id: 74,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                link: '/',
                parentId: 67
            },
            {
                id: 75,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN2',
                link: '/',
                parentId: 67
            },
            {
                id: 76,
                label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
                link: '/',
                parentId: 67
            },
            {
                id: 77,
                label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL2',
                link: '/',
                parentId: 67
            },
            {
                id: 78,
                label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
                link: '/',
                parentId: 67
            },
            {
                id: 79,
                label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION2',
                link: '/',
                parentId: 67
            },
            {
                id: 80,
                label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                link: '/',
                parentId: 67
            },
            {
                id: 81,
                label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION2',
                link: '/',
                parentId: 67
            }
        ]
    },
    {
        id: 82,
        label: 'MENUITEMS.UTILITY.TEXT',
        icon: 'bx-file',
        subItems: [
            {
                id: 83,
                label: 'MENUITEMS.UTILITY.LIST.STARTER',
                link: '/',
                parentId: 82
            },
            {
                id: 84,
                label: 'MENUITEMS.UTILITY.LIST.MAINTENANCE',
                link: '/',
                parentId: 82
            },
            {
                id: 85,
                label: 'Coming Soon',
                link: '/',
                parentId: 82
            },
            {
                id: 86,
                label: 'MENUITEMS.UTILITY.LIST.TIMELINE',
                link: '/',
                parentId: 82
            },
            {
                id: 87,
                label: 'MENUITEMS.UTILITY.LIST.FAQS',
                link: '/',
                parentId: 82
            },
            {
                id: 88,
                label: 'MENUITEMS.UTILITY.LIST.PRICING',
                link: '/',
                parentId: 82
            },
            {
                id: 89,
                label: 'MENUITEMS.UTILITY.LIST.ERROR404',
                link: '/',
                parentId: 82
            },
            {
                id: 90,
                label: 'MENUITEMS.UTILITY.LIST.ERROR500',
                link: '/',
                parentId: 82
            },
        ]
    },
    {
        id: 91,
        label: 'MENUITEMS.COMPONENTS.TEXT',
        isTitle: true
    },
    {
        id: 92,
        label: 'MENUITEMS.UIELEMENTS.TEXT',
        icon: 'bx-tone',
        subItems: [
            {
                id: 93,
                label: 'MENUITEMS.UIELEMENTS.LIST.ALERTS',
                link: '/',
                parentId: 92
            },
            {
                id: 94,
                label: 'MENUITEMS.UIELEMENTS.LIST.BUTTONS',
                link: '/',
                parentId: 92
            },
            {
                id: 95,
                label: 'MENUITEMS.UIELEMENTS.LIST.CARDS',
                link: '/',
                parentId: 92
            },
            {
                id: 96,
                label: 'MENUITEMS.UIELEMENTS.LIST.CAROUSEL',
                link: '/',
                parentId: 92
            },
            {
                id: 97,
                label: 'MENUITEMS.UIELEMENTS.LIST.DROPDOWNS',
                link: '/',
                parentId: 92
            },
            {
                id: 98,
                label: 'MENUITEMS.UIELEMENTS.LIST.GRID',
                link: '/',
                parentId: 92
            },
            {
                id: 99,
                label: 'MENUITEMS.UIELEMENTS.LIST.IMAGES',
                link: '/',
                parentId: 92
            },
            {
                id: 100,
                label: 'MENUITEMS.UIELEMENTS.LIST.LIGHTBOX',
                link: '/',
                parentId: 92
            },
            {
                id: 101,
                label: 'MENUITEMS.UIELEMENTS.LIST.MODALS',
                link: '/',
                parentId: 92
            },
            {
                id: 102,
                label: 'MENUITEMS.UIELEMENTS.LIST.RANGESLIDER',
                link: '/',
                parentId: 92
            },
            {
                id: 103,
                label: 'MENUITEMS.UIELEMENTS.LIST.PROGRESSBAR',
                link: '/',
                parentId: 92
            },
            {
                id: 104,
                label: 'MENUITEMS.UIELEMENTS.LIST.PLACEHOLDER',
                link: '/',
                parentId: 92
            },
            {
                id: 105,
                label: 'MENUITEMS.UIELEMENTS.LIST.SWEETALERT',
                link: '/',
                parentId: 92
            },
            {
                id: 106,
                label: 'MENUITEMS.UIELEMENTS.LIST.TABS',
                link: '/',
                parentId: 92
            },
            {
                id: 107,
                label: 'MENUITEMS.UIELEMENTS.LIST.TYPOGRAPHY',
                link: '/',
                parentId: 92
            },
            {
                id: 108,
                label: 'MENUITEMS.UIELEMENTS.LIST.TOASTS',
                link: '/',
                parentId: 92
            },
            {
                id: 109,
                label: 'MENUITEMS.UIELEMENTS.LIST.VIDEO',
                link: '/',
                parentId: 92
            },
            {
                id: 110,
                label: 'MENUITEMS.UIELEMENTS.LIST.GENERAL',
                link: '/',
                parentId: 92
            },
            {
                id: 111,
                label: 'MENUITEMS.UIELEMENTS.LIST.COLORS',
                link: '/',
                parentId: 92
            },
            {
                id: 112,
                label: 'MENUITEMS.UIELEMENTS.LIST.RATING',
                link: '/',
                parentId: 92
            },
            {
                id: 113,
                label: 'MENUITEMS.UIELEMENTS.LIST.NOTIFICATION',
                link: '/',
                parentId: 92
            },
            {
                id: 114,
                label: 'MENUITEMS.UIELEMENTS.LIST.UTILITIES',
                link: '/',
                parentId: 92
            },
            {
                id: 115,
                label: 'MENUITEMS.UIELEMENTS.LIST.CROPPER',
                link: '/',
                parentId: 92
            },
        ]
    },
    {
        id: 116,
        label: 'MENUITEMS.FORMS.TEXT',
        icon: 'bxs-eraser',
        badge: {
            variant: 'danger',
            text: 'MENUITEMS.FORMS.BADGE',
        },
        subItems: [
            {
                id: 117,
                label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
                link: '/',
                parentId: 116
            },
            {
                id: 118,
                label: 'MENUITEMS.FORMS.LIST.LAYOUTS',
                link: '/',
                parentId: 116
            },
            {
                id: 119,
                label: 'MENUITEMS.FORMS.LIST.VALIDATION',
                link: '/',
                parentId: 116
            },
            {
                id: 120,
                label: 'MENUITEMS.FORMS.LIST.ADVANCED',
                link: '/',
                parentId: 116
            },
            {
                id: 121,
                label: 'MENUITEMS.FORMS.LIST.EDITOR',
                link: '/',
                parentId: 116
            },
            {
                id: 122,
                label: 'MENUITEMS.FORMS.LIST.FILEUPLOAD',
                link: '/',
                parentId: 116
            },
            {
                id: 123,
                label: 'MENUITEMS.FORMS.LIST.REPEATER',
                link: '/',
                parentId: 116
            },
            {
                id: 124,
                label: 'MENUITEMS.FORMS.LIST.WIZARD',
                link: '/',
                parentId: 116
            },
            {
                id: 125,
                label: 'MENUITEMS.FORMS.LIST.MASK',
                link: '/',
                parentId: 116
            }
        ]
    },
    {
        id: 126,
        icon: 'bx-list-ul',
        label: 'MENUITEMS.TABLES.TEXT',
        subItems: [
            {
                id: 127,
                label: 'MENUITEMS.TABLES.LIST.BASIC',
                link: '/',
                parentId: 126
            },
            {
                id: 128,
                label: 'MENUITEMS.TABLES.LIST.DataTables',
                link: '/',
                parentId: 126
            }
        ]
    },
    {
        id: 130,
        icon: 'bxs-bar-chart-alt-2',
        label: 'MENUITEMS.CHARTS.TEXT',
        subItems: [
            {
                id: 131,
                label: 'MENUITEMS.CHARTS.LIST.APEX',
                link: '/',
                parentId: 130
            },
            {
                id: 132,
                label: 'MENUITEMS.CHARTS.LIST.CHARTJS',
                link: '/',
                parentId: 131
            },
            {
                id: 133,
                label: 'MENUITEMS.CHARTS.LIST.CHARTIST',
                link: '/',
                parentId: 131
            },
            {
                id: 134,
                label: 'MENUITEMS.CHARTS.LIST.ECHART',
                link: '/',
                parentId: 131
            }
        ]
    },
    {
        id: 135,
        label: 'MENUITEMS.ICONS.TEXT',
        icon: 'bx-aperture',
        subItems: [
            {
                id: 136,
                label: 'MENUITEMS.ICONS.LIST.BOXICONS',
                link: '/',
                parentId: 135
            },
            {
                id: 137,
                label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
                link: '/',
                parentId: 135
            },
            {
                id: 138,
                label: 'MENUITEMS.ICONS.LIST.DRIPICONS',
                link: '/',
                parentId: 135
            },
            {
                id: 139,
                label: 'MENUITEMS.ICONS.LIST.FONTAWESOME',
                link: '/',
                parentId: 135
            },
        ]
    },
    {
        id: 140,
        label: 'MENUITEMS.MAPS.TEXT',
        icon: 'bx-map',
        subItems: [
            {
                id: 141,
                label: 'MENUITEMS.MAPS.LIST.GOOGLEMAP',
                link: '/',
                parentId: 140
            },
            {
                id: 142,
                label: 'MENUITEMS.MAPS.LIST.LEAFLETMAP',
                link: '/',
                parentId: 140
            },
            {
                id: 142,
                label: 'MENUITEMS.MAPS.LIST.AMCHARTS',
                link: '/',
                parentId: 140
            }
        ]
    },
    {
        id: 143,
        label: 'MENUITEMS.MULTILEVEL.TEXT',
        icon: 'bx-share-alt',
        subItems: [
            {
                id: 144,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
                parentId: 143
            },
            {
                id: 145,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
                parentId: 143,
                subItems: [
                    {
                        id: 146,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
                        parentId: 145,
                    },
                    {
                        id: 147,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
                        parentId: 145,
                    }
                ]
            },
        ]
    }
];

