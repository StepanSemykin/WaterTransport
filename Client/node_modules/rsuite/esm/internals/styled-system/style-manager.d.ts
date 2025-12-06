/**
 * StyleManager - A utility for managing CSS styles dynamically
 *
 * This manager creates and maintains a single style element in the document head
 * and provides methods to add, update, and remove CSS rules.
 * Supports CSP nonce for Content Security Policy compliance.
 */
export declare const StyleManager: {
    styleElement: HTMLStyleElement | null;
    styleMap: Map<string, string>;
    nonce: string | undefined;
    /**
     * Initialize the style element if it doesn't exist
     * @param options - Optional configuration options
     * @param options.nonce - CSP nonce to apply to the style element
     * @returns The style element
     */
    init(options?: {
        nonce?: string;
    }): HTMLStyleElement | null;
    /**
     * Set the CSP nonce for the style element
     * @param nonce - CSP nonce value
     */
    setNonce(nonce?: string): void;
    /**
     * Add a CSS rule to the style sheet
     * @param selector - CSS selector
     * @param cssText - CSS properties and values
     * @param options - Optional configuration options
     * @param options.nonce - CSP nonce to apply to the style element
     */
    addRule(selector: string, cssText: string, options?: {
        nonce?: string;
    }): void;
    /**
     * Remove a CSS rule from the style sheet
     * @param selector - CSS selector to remove
     */
    removeRule(selector: string): void;
    /**
     * Update the style element with all current rules
     */
    updateStyles(): void;
    /**
     * Clear all rules from the style sheet
     */
    clearRules(): void;
};
export default StyleManager;
