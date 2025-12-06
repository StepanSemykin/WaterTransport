import { SortConfig } from './helper/useSortHelper';
import { BoxProps } from '../internals/Box';
export interface ListProps extends Omit<BoxProps, 'transitionDuration'>, SortConfig {
    /**
     * Size of list item.
     */
    size?: 'lg' | 'md' | 'sm' | 'xs';
    /**
     * Whether the list is bordered.
     */
    bordered?: boolean;
    /**
     * Whether the list is hoverable.
     */
    hover?: boolean;
    /**
     * Whether the list is sortable.
     */
    sortable?: boolean;
    /**
     * Whether to display a divider between items.
     *
     * @version 5.75.0
     */
    divider?: boolean;
}
/**
 * The `List` component is used to specify the layout of the list.
 * @see https://rsuitejs.com/components/list
 */
declare const List: import("../internals/types").InternalRefForwardingComponent<"div", ListProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"div", import("./ListItem").ListItemProps, never> & Record<string, never>;
};
export default List;
