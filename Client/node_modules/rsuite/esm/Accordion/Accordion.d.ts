import { type PanelGroupProps } from '../PanelGroup';
export type AccordionProps = Omit<PanelGroupProps, 'accordion'>;
/**
 * The `Accordion` component is used to display content that can be collapsed.
 * @see https://rsuitejs.com/components/accordion
 */
declare const Accordion: import("../internals/types").InternalRefForwardingComponent<"div", AccordionProps, never> & {
    Panel: import("../internals/types").InternalRefForwardingComponent<"div", import("..").PanelProps<string | number>, never> & Record<string, never>;
};
export default Accordion;
