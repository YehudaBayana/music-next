
export type MenuOption = {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
};

export type ContextMenuProps = {
    options: MenuOption[];
    position: { x: number; y: number };
    onClose: () => void;
};


export type WithContextMenuProps = {
    options: MenuOption[];
    children: React.ReactNode;
    className?: string;
    triggerType?: 'right-click' | 'click';
};
