import type { WithAsProps } from '../internals/types';
export interface FlexboxGridProps extends WithAsProps {
    /**
     * Vertical alignment
     * @deprecated Please use `<Row align={...}>` instead.
     */
    align?: 'top' | 'middle' | 'bottom';
    /**
     * Horizontal alignment
     * @deprecated Please use `<Row justify={...}>` instead.
     */
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
}
/**
 * The FlexboxGrid component is a box that can be used to layout other components.
 * @see https://rsuitejs.com/components/flexbox-grid
 * @deprecated Please use `Row` instead.
 * ```
 * <Row>
 *   <Col>1</Col>
 *   <Col>2</Col>
 *   <Col>3</Col>
 * </Row>
 * ```
 */
declare const FlexboxGrid: import("../internals/types").InternalRefForwardingComponent<"div", FlexboxGridProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"div", import("./FlexboxGridItem").FlexboxGridItemProps, never> & Record<string, never>;
};
export default FlexboxGrid;
