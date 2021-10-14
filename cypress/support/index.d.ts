/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
type PasteOptions = {
  pasteType: string
  pastePayload: any
}

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to paste.
     * @example cy.get('body').paste({
     *   pasteType: 'application/json',
     *   pastePayload: {hello: 'yolo'},
     * });
     */
    paste(o: PasteOptions): Chainable<Element>
  }
}
