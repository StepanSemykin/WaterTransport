import React from 'react';
import { BoxProps } from '../internals/Box';
export interface BreadcrumbItemProps extends BoxProps {
    /**
     * The wrapper element of the BreadcrumbItem.
     */
    wrapperAs?: React.ElementType;
    /**
     * The active state of the BreadcrumbItem.
     */
    active?: boolean;
    /**
     * The href attribute specifies the URL of the page the link goes to.
     */
    href?: string;
    /**
     * The title attribute specifies extra information about an element.
     */
    title?: string;
    /**
     * The target attribute specifies where to open the linked document.
     */
    target?: string;
    /**
     * The separator between each breadcrumb item.
     */
    separator?: React.ReactNode;
    /**
     * The icon of the BreadcrumbItem.
     */
    icon?: React.ReactNode;
}
/**
 * The `<Breadcrumb.Item>` component is used to specify each section of the Breadcrumb.
 * @see https://rsuitejs.com/components/breadcrumb
 */
declare const BreadcrumbItem: import("../internals/types").InternalRefForwardingComponent<"a", BreadcrumbItemProps, never> & Record<string, never>;
export default BreadcrumbItem;
