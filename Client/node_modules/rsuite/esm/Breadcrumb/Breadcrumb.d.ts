import React from 'react';
import { StyledBoxProps } from '../internals/StyledBox';
import type { BreadcrumbLocale } from '../locales';
export interface BreadcrumbProps extends Omit<StyledBoxProps, 'name'> {
    /**
     * The separator between each breadcrumb item.
     */
    separator?: React.ReactNode;
    /**
     * Set the maximum number of breadcrumbs to display.
     * When there are more than the maximum number,
     * only the first and last will be shown, with an ellipsis in between.
     */
    maxItems?: number;
    /**
     * The locale of the component.
     */
    locale?: BreadcrumbLocale;
    /**
     * The ellipsis element.
     */
    ellipsis?: React.ReactNode;
    /**
     * The size of the Breadcrumb.
     */
    size?: 'sm' | 'md' | 'lg' | number | string;
    /**
     * Callback function for clicking the ellipsis.
     */
    onExpand?: (event: React.MouseEvent) => void;
}
/**
 * The Breadcrumb component is used to indicate the current page location and navigate.
 * @see https://rsuitejs.com/components/breadcrumb
 */
declare const Breadcrumb: import("../internals/types").InternalRefForwardingComponent<"ol", BreadcrumbProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"a", import("./BreadcrumbItem").BreadcrumbItemProps, never> & Record<string, never>;
};
export default Breadcrumb;
