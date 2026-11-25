/**
 * Handles the Book a Consultation smooth-scroll button, the Send a Hint
 * copy-link control, and the Send a Hint form submission.
 * Uses event delegation on `document`, registered once, so it survives
 * Shopify Theme Editor section re-renders without stacking listeners.
 */
(function () {
  if (window.__yazProductHintInit) return;
  window.__yazProductHintInit = true;

  function scrollWithOffset(targetId, offsetVar) {
    var target = document.getElementById(targetId);
    if (!target) return;
    var offset = parseFloat(offsetVar) || 0;
    var headerHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height')
    ) || 0;
    var targetTop = target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: targetTop - headerHeight - offset,
      behavior: 'smooth'
    });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (event) {
    var consultButton = event.target.closest('[data-scroll-target]');
    if (consultButton) {
      var targetId = consultButton.getAttribute('data-scroll-target');
      var smooth = consultButton.getAttribute('data-smooth-scroll') !== 'false';
      var isMobile = window.matchMedia('(max-width: 749px)').matches;
      var offsetVar = getComputedStyle(consultButton).getPropertyValue(
        isMobile ? '--sa-scroll-offset-mobile' : '--sa-scroll-offset-desktop'
      );
      if (document.getElementById(targetId)) {
        event.preventDefault();
        if (smooth) {
          scrollWithOffset(targetId, offsetVar);
        } else {
          document.getElementById(targetId).scrollIntoView();
        }
      }
      return;
    }

    var copyButton = event.target.closest('[data-copy-link-button]');
    if (copyButton) {
      var wrapper = copyButton.closest('send-a-hint-form') || copyButton.closest('.hint-drawer__copylink');
      var input = wrapper ? wrapper.querySelector('[data-copy-link-input]') : null;
      if (input) {
        copyTextToClipboard(input.value).then(function () {
          announceCopy(copyButton, wrapper);
        });
      }
      return;
    }
  });

  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return legacyCopy(text);
      });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    var temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      /* no-op: clipboard unavailable */
    }
    document.body.removeChild(temp);
  }

  function announceCopy(button, wrapper) {
    var form = button.closest('send-a-hint-form');
    var message = (form && form.getAttribute('data-copy-success-text')) || 'Link copied';
    var existing = wrapper.querySelector('.hint-drawer__copy-feedback');
    if (existing) existing.remove();
    var feedback = document.createElement('span');
    feedback.className = 'hint-drawer__copy-feedback';
    feedback.setAttribute('role', 'status');
    feedback.textContent = message;
    wrapper.appendChild(feedback);
    button.setAttribute('aria-live', 'polite');
    setTimeout(function () {
      feedback.remove();
    }, 2500);
  }

  class SendAHintForm extends HTMLElement {
    connectedCallback() {
      if (this.__bound) return;
      this.__bound = true;
      var form = this.querySelector('form');
      if (!form) return;
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
      event.preventDefault();
      var form = event.target;
      var endpoint = this.getAttribute('data-endpoint');
      var sendButton = form.querySelector('[data-send-button]');
      var spinner = form.querySelector('[data-spinner]');
      var successEl = form.querySelector('.hint-drawer__status--success');
      var errorEl = form.querySelector('.hint-drawer__status--error');

      successEl.hidden = true;
      errorEl.hidden = true;
      errorEl.textContent = '';

      var honeypot = form.querySelector('input[name="company"]');
      if (honeypot && honeypot.value.trim() !== '') {
        // Silently pretend success to the bot; do nothing else.
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!endpoint) {
        errorEl.textContent =
          'Sending a hint is not configured yet. An administrator needs to set the Send a Hint endpoint URL in Theme Editor.';
        errorEl.hidden = false;
        return;
      }

      var data = new FormData(form);
      var payload = {};
      data.forEach(function (value, key) {
        payload[key] = value;
      });

      sendButton.disabled = true;
      if (spinner) spinner.hidden = false;

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          return response.json().catch(function () {
            return {};
          });
        })
        .then(function () {
          successEl.hidden = false;
          form.reset();
          // Restore the auto-filled hidden/product fields after reset.
          data.forEach(function (value, key) {
            var field = form.querySelector('[name="' + key + '"]');
            if (field && field.type === 'hidden') field.value = value;
          });
        })
        .catch(function () {
          var message =
            this.getAttribute('data-error-message') ||
            "We couldn't send your hint. Please try again.";
          errorEl.textContent = message;
          errorEl.hidden = false;
        }.bind(this))
        .finally(function () {
          sendButton.disabled = false;
          if (spinner) spinner.hidden = true;
        });
    }
  }

  if (!customElements.get('send-a-hint-form')) {
    customElements.define('send-a-hint-form', SendAHintForm);
  }
})();
