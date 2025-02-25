export interface MenuItem {
    id?: number;
    label?: string;
    isCollapsed?: any;
    icon?: string;
    link?: string;
    subItems?: any;
    parentId?: number;
    isUiElement?: boolean;
}
