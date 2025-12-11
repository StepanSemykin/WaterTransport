/// <reference types="react" />
interface UseActiveProps {
    target: React.RefObject<HTMLElement | null>;
    onOpen?: () => void;
    onClose?: () => void;
    onEnter?: (node: HTMLElement) => void;
    onExit?: (node: HTMLElement) => void;
    setSearchKeyword: (keyword: string) => void;
}
declare const useActive: (props: UseActiveProps) => {
    active: boolean;
    events: {
        onEnter: (...args: any[]) => any;
        onExit: (...args: any[]) => any;
    };
};
export default useActive;
