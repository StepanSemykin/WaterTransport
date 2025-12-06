import type { WithAsProps } from '../internals/types';
export interface FlexboxGridItemProps extends WithAsProps {
    /**
     * The number of columns the item should span
     * @deprecated Please use `<Col span={...}>` instead.
     */
    colspan?: number;
    /**
     * The order of the item in the grid
     * @deprecated Please use `<Col order={...}>` instead.
     */
    order?: number;
}
/**
 * The `FlexboxGrid.Item` component is used to specify the layout of the child element in the `FlexboxGrid` component.
 * @see https://rsuitejs.com/components/flexbox-grid
 * @deprecated Please use `Col` instead.
 */
declare const FlexboxGridItem: import("../internals/types").InternalRefForwardingComponent<"div", FlexboxGridItemProps, never> & Record<string, never>;
export default FlexboxGridItem;
