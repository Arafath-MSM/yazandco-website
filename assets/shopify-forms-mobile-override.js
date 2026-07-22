/* Temporary campaign override: remove this file after the Welcome Bonus campaign. */
(() => {
  const styleId = 'yaz-shopify-forms-mobile-height';
  const mobileStyles = `
    @media screen and (max-width: 749px) {
      #form-container-ref section[data-sizing="form-wrapper"] {
        grid-template-rows: 240px minmax(0, 1fr) !important;
        height: min(534px, calc(100dvh - 3.2rem)) !important;
        max-height: calc(100dvh - 3.2rem) !important;
      }

      #form-container-ref section[data-sizing="form-wrapper"] > div:first-child {
        height: 240px !important;
        min-height: 240px !important;
        max-height: 240px !important;
        background-color: #2b0718 !important;
        background-size: contain !important;
        background-position: center !important;
      }

      #form-container-ref section[data-sizing="form-wrapper"] > div:nth-child(2) {
        min-height: 0 !important;
        padding: 1.2rem 1.6rem !important;
        overflow-y: auto !important;
      }

      #form-container-ref section[data-sizing="form-wrapper"] [data-testid="form"] {
        gap: 0.8rem !important;
      }

      #form-container-ref section[data-sizing="form-wrapper"] h2,
      #form-container-ref section[data-sizing="form-wrapper"] p {
        margin-top: 0 !important;
        margin-bottom: 0.6rem !important;
      }
    }
  `;

  const observedRoots = new WeakSet();

  const addStyles = (root) => {
    if (!root.querySelector || !root.querySelector('#form-container-ref') || root.querySelector(`#${styleId}`)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = mobileStyles;
    (root.head || root).appendChild(style);
  };

  const scan = (root) => {
    addStyles(root);

    if (root.querySelectorAll) {
      root.querySelectorAll('*').forEach((element) => {
        if (element.shadowRoot) scan(element.shadowRoot);
      });
    }

    if (observedRoots.has(root)) return;
    observedRoots.add(root);

    const observer = new MutationObserver(() => scan(root));
    observer.observe(root, { childList: true, subtree: true });
  };

  scan(document);
})();
