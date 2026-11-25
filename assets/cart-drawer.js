class CartDrawer extends HTMLElement {
	constructor() {
		super();

		this.addEventListener(
			"keyup",
			(evt) => evt.code === "Escape" && this.close()
		);
		this.querySelector("#CartDrawer-Overlay")?.addEventListener(
			"click",
			this.close.bind(this)
		);
		this.setHeaderCartIconAccessibility();
	}

	setHeaderCartIconAccessibility() {
		// Not every template renders the header cart link (login / register / password).
		// Dereferencing it threw inside the constructor, which stopped <cart-drawer>
		// from upgrading at all on those pages.
		const cartLink = document.querySelector("#cart-icon-bubble");
		if (!cartLink) return;
		cartLink.setAttribute("role", "button");
		cartLink.setAttribute("aria-haspopup", "dialog");

		cartLink.addEventListener("click", (event) => {
			event.preventDefault();
			this.open(cartLink);
		});

		cartLink.addEventListener("keydown", (event) => {
			if (event.code.toUpperCase() === "SPACE") {
				event.preventDefault();
				this.open(cartLink);
			}
		});
	}

	open(triggeredBy) {
		// Opened by a real click (header cart icon) rather than by an add-to-cart
		// render: leave "product added" mode, otherwise the notification CSS keeps
		// every line except .active hidden and the cart looks empty / one-item.
		if (triggeredBy) this.exitNotificationMode();
		if (triggeredBy) this.setActiveElement(triggeredBy);
		const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
		if (cartDrawerNote && !cartDrawerNote.hasAttribute("role"))
			this.setSummaryAccessibility(cartDrawerNote);

		// here the animation doesn't seem to always get triggered. A timeout seem to help
		setTimeout(() => {
			this.classList.add("animate", "active");
		});

		// One handler per instance. transitionend bubbles, so a { once: true }
		// registration could be consumed by any child transition, and open() is
		// called again on every add - which used to pile up listeners.
		if (this._onOpenTransitionEnd) {
			this.removeEventListener("transitionend", this._onOpenTransitionEnd);
		}
		this._onOpenTransitionEnd = (event) => {
			if (event.target !== this) return;
			const containerToTrapFocusOn = this.classList.contains("is-empty")
				? this.querySelector(".drawer__inner-empty")
				: document.getElementById("CartDrawer");
			const focusElement =
				this.querySelector(".drawer__inner") ||
				this.querySelector(".drawer__close");
			if (containerToTrapFocusOn) trapFocus(containerToTrapFocusOn, focusElement);
		};
		this.addEventListener("transitionend", this._onOpenTransitionEnd);

		document.body.classList.add("cart-overflow-hidden");
		if (!this.scrollLocked) {
			this.scrollLocked = true;
			window.themeScrollLock.lock();
		}
	}

	close() {
		this.classList.remove("active");
		removeTrapFocus(this.activeElement);
		document.body.classList.remove("cart-overflow-hidden");
		if (this.scrollLocked) {
			this.scrollLocked = false;
			window.themeScrollLock.unlock();
		}

		setTimeout(() => {
			this.exitNotificationMode();
		}, 1000);
	}

	// Single source of truth for leaving "product added to cart" mode.
	exitNotificationMode() {
		this.querySelectorAll(".notification-open").forEach((el) =>
			el.classList.remove("notification-open")
		);
		this.querySelectorAll(".cart-item.active").forEach((el) =>
			el.classList.remove("active")
		);
	}

	// Finds the line the shopper just added. Prefers the cart line key, which is
	// unique per line; the variant id is not (two lines can share a variant when
	// their line-item properties differ, e.g. different Engraving text).
	findAddedCartItem(parsedState) {
		const key = parsedState && parsedState.key;
		if (key) {
			const byKey = this.querySelector(
				`.cart-item[data-cart-item-key="${CSS.escape(String(key))}"]`
			);
			if (byKey) return byKey;
		}
		if (this.productId == null) return null;
		return this.querySelector(
			`.cart-item[data-product-id="${CSS.escape(String(this.productId))}"]`
		);
	}

	setSummaryAccessibility(cartDrawerNote) {
		cartDrawerNote.setAttribute("role", "button");
		cartDrawerNote.setAttribute("aria-expanded", "false");

		if (cartDrawerNote.nextElementSibling.getAttribute("id")) {
			cartDrawerNote.setAttribute(
				"aria-controls",
				cartDrawerNote.nextElementSibling.id
			);
		}

		cartDrawerNote.addEventListener("click", (event) => {
			event.currentTarget.setAttribute(
				"aria-expanded",
				!event.currentTarget.closest("details").hasAttribute("open")
			);
		});

		cartDrawerNote.parentElement.addEventListener("keyup", onKeyUpEscape);
	}

	renderContents(parsedState) {
		this.querySelector(".drawer__inner").classList.contains("is-empty") &&
			this.querySelector(".drawer__inner").classList.remove("is-empty");
		this.productId = parsedState.id;
		this.getSectionsToRender().forEach((section) => {
			const sectionElement = section.selector
				? document.querySelector(section.selector)
				: document.getElementById(section.id);
			if (!sectionElement) return;
			const markup = this.getSectionInnerHTML(
				parsedState.sections[section.id],
				section.selector
			);
			if (markup === null) return;
			sectionElement.innerHTML = markup;
		});

		const notification = this.querySelector(".notification");

		if (notification) {
			const activeItem = this.findAddedCartItem(parsedState);
			// Only enter "product added" mode when we actually found the line to
			// highlight. Without this the notification CSS hides EVERY cart line and
			// the drawer reads as empty.
			if (activeItem) {
				notification.classList.add("notification-open");
				activeItem.classList.add("active");
			} else {
				this.exitNotificationMode();
			}
		}

		setTimeout(() => {
			this.querySelector("#CartDrawer-Overlay")?.addEventListener(
				"click",
				this.close.bind(this)
			);
			this.open();
		});
	}

	getSectionInnerHTML(html, selector = ".shopify-section") {
		if (typeof html !== "string") return null;
		const found = new DOMParser()
			.parseFromString(html, "text/html")
			.querySelector(selector);
		return found ? found.innerHTML : null;
	}

	getSectionsToRender() {
		return [
			{
				id: "cart-drawer",
				selector: "#CartDrawer",
			},
			{
				id: "cart-icon-bubble",
			},
		];
	}

	getSectionDOM(html, selector = ".shopify-section") {
		return new DOMParser()
			.parseFromString(html, "text/html")
			.querySelector(selector);
	}

	setActiveElement(element) {
		this.activeElement = element;
	}
}

customElements.define("cart-drawer", CartDrawer);

class CartDrawerItems extends CartItems {
	connectedCallback() {
		super.connectedCallback?.();
		// A quantity change re-renders .drawer__inner, which recreates this element
		// and wipes the .cart-item.active marker - while .notification-open lives on
		// the #CartDrawer ancestor and survives. Left alone, the notification CSS
		// (".cart-item { display: none }") would then hide EVERY line item.
		const drawer = this.closest("cart-drawer");
		if (!drawer) return;
		const notificationOpen = drawer.querySelector(".notification-open");
		if (notificationOpen && !drawer.querySelector(".cart-item.active")) {
			notificationOpen.classList.remove("notification-open");
		}
	}

	getSectionsToRender() {
		return [
			{
				id: "CartDrawer",
				section: "cart-drawer",
				selector: ".drawer__inner",
			},
			{
				id: "cart-icon-bubble",
				section: "cart-icon-bubble",
				selector: ".shopify-section",
			},
		];
	}
}

customElements.define("cart-drawer-items", CartDrawerItems);

if (!customElements.get("cart-note")) {
	customElements.define(
		"cart-note",
		class CartNote extends HTMLElement {
			constructor() {
				super();

				this.addEventListener(
					"input",
					debounce((event) => {
						const body = JSON.stringify({ note: event.target.value });
						fetch(`${routes.cart_update_url}`, {
							...fetchConfig(),
							...{ body },
						});
					}, ON_CHANGE_DEBOUNCE_TIMER)
				);
			}
		}
	);
}
