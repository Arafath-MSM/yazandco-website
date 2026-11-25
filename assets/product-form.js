// (function () {
// 	const initProductAccordion = () => {
// 		$(".about__accordion-toggle").click(function () {
// 			if (!$(this).hasClass("active")) {
// 				$(this).addClass("active");
// 				$(this)
// 					.siblings(".about__accordion-description")
// 					.eq($(this).index())
// 					.stop()
// 					.slideDown(300);
// 			} else {
// 				$(this).removeClass("active");
// 				$(this).siblings(".about__accordion-description").stop().slideUp(300);
// 			}
// 		});
// 	};

// 	const initZoomImage = () => {
// 		const imagesWrapper = document.querySelector(
// 			".product-media-modal__content"
// 		);
// 		const images = imagesWrapper.querySelectorAll(".js-image-zoom");

// 		images.forEach((el) => {
// 			el.addEventListener("click", (e) => {
// 				imagesWrapper.classList.toggle("zoom");
// 			});
// 		});
// 	};



// 	const revealPopup = () => {
// 		const stickyBars = document.querySelectorAll('.product__popup'); // Sticky bar(s) — theme can render desktop + mobile copies
// 		const secondSection = document.querySelector('.product-section + section'); // Second section
// 		const footer = document.querySelector('footer'); // Footer

// 		// Check if the required elements exist
// 		if (!stickyBars.length || !secondSection || !footer) {
// 				console.error('Required elements not found!');
// 				return;
// 		}

// 			const getOffset = (element) => {
// 				const rect = element.getBoundingClientRect();
// 				return rect.top + window.scrollY;
// 			};

// 			const secondSectionMid = getOffset(secondSection);
// 			const footerTop = getOffset(footer);

// 			const handleScroll = () => {
// 				const scrollPosition = window.scrollY + window.innerHeight;
// 				const activeOffset = window.scrollY > secondSectionMid && scrollPosition < footerTop;

// 				stickyBars.forEach((stickyBar) => {
// 					stickyBar.classList[activeOffset ? "add" : "remove"]('active');
// 				});
// 			};

// 			// Initial check in case the user starts in the middle of the page
// 			handleScroll();
// };

// 	document.addEventListener('scroll', () => revealPopup());


// 	document.addEventListener("shopify:section:load", function () {
// 		initProductAccordion();
// 		initZoomImage();
// 		revealPopup();
// 	});

// 	initProductAccordion();
// 	initZoomImage();
// 	revealPopup();
// })();

// class FloatedForm extends HTMLElement {
// 	constructor() {
// 		super();
// 		this.renderForm();
// 	}

// 	renderForm() {
// 		fetch(this.getAttribute("data-product-url"))
// 			.then((response) => response.text())
// 			.then((responseText) => {
// 				const responseHTML = new DOMParser().parseFromString(
// 					responseText,
// 					"text/html"
// 				);
// 				this.productElement = responseHTML.querySelector(
// 					'div[id^="ProductInfo-"]'
// 				);

// 				this.preventDuplicatedIDs();
// 				this.removeDOMElements();
// 				this.setInnerHTML(this, this.productElement.innerHTML);

// 				if (window.Shopify && Shopify.PaymentButton) {
// 					Shopify.PaymentButton.init();
// 				}

// 				if (window.ProductModel) window.ProductModel.loadShopifyXR();

// 				this.showMoreFields();
// 			})
// 			.finally(() => {
// 				const selectDropDown = () => {
// 					$(".product__popup .product-form__controls--dropdown").each(function () {
// 						const elListItem = $(this).find(".dropdown-select ul li");
// 						const elItem = $(this).find(".dropdown-select ul");
// 						const selectedText = $(this).find(
// 							".dropdown-select .select-label"
// 						);

// 						selectedText.on("click", function (e) {
// 							elItem.toggleClass("active");
// 							if (elItem.hasClass("active")) {
// 								e.stopPropagation();
// 								$(document).click(function () {
// 									elItem.removeClass("active");
// 								});
// 							}
// 						});

// 						elListItem.on("click", function () {
// 							selectedText
// 								.find("span")
// 								.text($(this).text())
// 								.attr("title", $(this).text());
// 							elItem.removeClass("active");
// 							document.activeElement.blur();
// 						});
// 					});
// 				};

// 				selectDropDown();
// 			});
// 	}

// 	setInnerHTML(element, html) {
// 		element.innerHTML = html;

// 		// Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
// 		element.querySelectorAll("script").forEach((oldScriptTag) => {
// 			const newScriptTag = document.createElement("script");
// 			Array.from(oldScriptTag.attributes).forEach((attribute) => {
// 				newScriptTag.setAttribute(attribute.name, attribute.value);
// 			});
// 			newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
// 			oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
// 		});
// 	}

// 	preventDuplicatedIDs() {
// 		const sectionId = this.productElement.dataset.section;
// 		this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(
// 			sectionId,
// 			`floated-${sectionId}`
// 		);

// 		if (this.productElement.querySelectorAll("variant-selects")) {
// 			this.productElement
// 				.querySelectorAll("variant-selects")
// 				.forEach((radio) => {
// 					radio.dataset.originalSection = sectionId;
// 				});
// 		}

// 		if (this.productElement.querySelectorAll("variant-radios")) {
// 			this.productElement
// 				.querySelectorAll("variant-radios")
// 				.forEach((radio) => {
// 					radio.dataset.originalSection = sectionId;
// 				});
// 		}
// 	}

// 	removeDOMElements() {
// 		const text = this.productElement.querySelector(".product__text");
// 		if (text) text.remove();

// 		const tags = this.productElement.querySelector(".product__tags");
// 		if (tags) tags.remove();

//     const title = this.productElement.querySelector(".product__title__wrapper");
// 		if (title) title.remove();

// 		const badges = this.productElement.querySelector(".product__custom-badges");
// 		if (badges) badges.remove();

//     const price = this.productElement.querySelector(".price-wrapper");
// 		if (price) price.remove();

// 		const description = this.productElement.querySelector(
// 			".product__description"
// 		);
// 		if (description) description.remove();

// 		const sku = this.productElement.querySelector(".product__sku");
// 		if (sku) sku.remove();

// 		const inventory = this.productElement.querySelector(".product__inventory");
// 		if (inventory) inventory.remove();

// 		const pickupAvailability = this.productElement.querySelector(
// 			"pickup-availability"
// 		);
// 		if (pickupAvailability) pickupAvailability.remove();

// 		const customLiquid = this.productElement.querySelector(".custom-liquid");
// 		if (customLiquid) customLiquid.remove();

// 		const complementary = this.productElement.querySelector(
// 			"product-recommendations"
// 		);
// 		if (complementary) complementary.remove();

// 		const shareButtons = this.productElement.querySelector(".share-buttons");
// 		if (shareButtons) shareButtons.remove();

// 		const productModal = this.productElement.querySelectorAll(".product-popup");
// 		productModal.forEach((advantage) => {
// 			advantage.remove();
// 		});

// 		const productForm = this.productElement.querySelector("floated-form");
// 		if (productForm) productForm.remove();
// 	}

// 	showMoreFields() {
// 		$(".js-show-more").click(function (e) {
// 			e.preventDefault();
// 			$(this).siblings("input").removeClass("hidden");
// 			$(this).siblings("label").removeClass("hidden");
// 			$(this).remove();
// 		});
// 	}
// }

// customElements.define("floated-form", FloatedForm);



// product-form.js is enqueued by layout/theme.liquid AND by the product sections.
// Loading it twice used to throw "Identifier 'ProductForm' has already been declared"
// and double-bind the accordion / scroll handlers. Everything below runs once.
if (!window.__themeProductFormLoaded) {
window.__themeProductFormLoaded = true;

(function () {
	const initProductAccordion = () => {
		$(".about__accordion-toggle").click(function () {
			if (!$(this).hasClass("active")) {
				$(this).addClass("active");
				$(this)
					.siblings(".about__accordion-description")
					.eq($(this).index())
					.stop()
					.slideDown(300);
			} else {
				$(this).removeClass("active");
				$(this).siblings(".about__accordion-description").stop().slideUp(300);
			}
		});
	};

	const initZoomImage = () => {
		const imagesWrapper = document.querySelector(
			".product-media-modal__content"
		);
		// Absent on every page without a product media modal (collection, cart,
		// home...). Dereferencing it threw and aborted the rest of this init block.
		if (!imagesWrapper) return;
		const images = imagesWrapper.querySelectorAll(".js-image-zoom");

		images.forEach((el) => {
			el.addEventListener("click", (e) => {
				imagesWrapper.classList.toggle("zoom");
			});
		});
	};



	const revealPopup = () => {
		const stickyBars = document.querySelectorAll('.product__popup'); // Sticky bar(s) — theme can render desktop + mobile copies
		const secondSection = document.querySelector('.product-section + section'); // Second section
		const footer = document.querySelector('footer'); // Footer

		// Nothing to reveal on this page - return quietly. This runs on EVERY scroll
		// event, so logging here flooded the console site-wide.
		if (!stickyBars.length || !secondSection || !footer) {
				return;
		}

			const getOffset = (element) => {
				const rect = element.getBoundingClientRect();
				return rect.top + window.scrollY;
			};

			const secondSectionMid = getOffset(secondSection);
			const footerTop = getOffset(footer);

			const handleScroll = () => {
				const scrollPosition = window.scrollY + window.innerHeight;
				const activeOffset = window.scrollY > secondSectionMid && scrollPosition < footerTop;

				stickyBars.forEach((stickyBar) => {
					stickyBar.classList[activeOffset ? "add" : "remove"]('active');
				});
			};

			// Initial check in case the user starts in the middle of the page
			handleScroll();
};

	document.addEventListener('scroll', () => revealPopup());


	document.addEventListener("shopify:section:load", function () {
		initProductAccordion();
		initZoomImage();
		revealPopup();
	});

	document.addEventListener("DOMContentLoaded", function () {
		initProductAccordion();
		initZoomImage();
		revealPopup();
	});
})();

class ProductForm extends HTMLElement {
	constructor() {
		super();

		this.form = this.querySelector("form");
		if (!this.form) return;
		this.form
			.querySelectorAll("[name=id]")
			.forEach((input) => (input.disabled = false));
		this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
		this.cart =
			document.querySelector("cart-notification") ||
			document.querySelector("cart-drawer");
		this.submitButton = this.querySelector('[type="submit"]');
		if (!this.submitButton) return;
		this.submitButtonText = this.submitButton.querySelector("span");

		if (document.querySelector("cart-drawer")) {
			this.submitButton.setAttribute("aria-haspopup", "dialog");
		}

		this.hideErrors = this.dataset.hideErrors === "true";
	}

	onSubmitHandler(evt) {
		evt.preventDefault();
		if (this.submitButton.getAttribute("aria-disabled") === "true") return;

		this.handleErrorMessage();

		this.submitButton.setAttribute("aria-disabled", true);
		this.submitButton.classList.add("loading");
		this.querySelector(".loading-overlay__spinner")?.classList.remove(
			"hidden"
		);

		const config = fetchConfig("javascript");
		config.headers["X-Requested-With"] = "XMLHttpRequest";
		delete config.headers["Content-Type"];

		const formData = new FormData(this.form);

		// Safety net: a product form must post exactly ONE variant id. When two
		// [name="id"] controls are present (a theme edit, an app, an injected field)
		// /cart/add.js receives `id` twice and keeps the stale one - which adds the
		// default variant no matter what the shopper selected.
		const idControls = this.form.querySelectorAll(
			'[name="id"]:not([disabled])'
		);
		if (idControls.length > 1) {
			formData.delete("id");
			formData.append("id", idControls[0].value);
		}

		if (this.cart) {
			formData.append(
				"sections",
				this.cart.getSectionsToRender().map((section) => section.id)
			);
			formData.append("sections_url", window.location.pathname);
			this.cart.setActiveElement(document.activeElement);
		}
		config.body = formData;

		fetch(`${routes.cart_add_url}`, config)
			.then((response) => response.json())
			.then((response) => {
				if (response.status) {
					publish(PUB_SUB_EVENTS.cartError, {
						source: "product-form",
						productVariantId: formData.get("id"),
						errors: response.errors || response.description,
						message: response.message,
					});
					this.handleErrorMessage(response.description);

					const soldOutMessage =
						this.submitButton.querySelector(".sold-out-message");
					if (!soldOutMessage) return;
					this.submitButton.setAttribute("aria-disabled", true);
					this.submitButtonText?.classList.add("hidden");
					soldOutMessage.classList.remove("hidden");
					this.error = true;
					return;
				} else if (!this.cart) {
					window.location = window.routes.cart_url;
					return;
				}

				if (!this.error) {
					publish(PUB_SUB_EVENTS.cartUpdate, {
						source: "product-form",
						productVariantId: formData.get("id"),
						cartData: response,
					});
				}
				this.error = false;
				const quickAddModal = this.closest("quick-add-modal");
				if (quickAddModal) {
					document.body.addEventListener(
						"modalClosed",
						() => {
							setTimeout(() => {
								this.cart.renderContents(response);
							});
						},
						{ once: true }
					);
					quickAddModal.hide(true);
				} else {
					this.cart.renderContents(response);
				}
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				this.submitButton.classList.remove("loading");
				if (this.cart && this.cart.classList.contains("is-empty")) {
					this.cart.classList.remove("is-empty");
				}
				if (!this.error) this.submitButton.removeAttribute("aria-disabled");
			});
	}

	handleErrorMessage(errorMessage = false) {
		if (this.hideErrors) return;

		this.errorMessageWrapper =
			this.errorMessageWrapper ||
			this.querySelector(".product-form__error-message-wrapper");
		if (!this.errorMessageWrapper) return;
		this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

		this.errorMessage =
			this.errorMessage ||
			this.errorMessageWrapper.querySelector(".product-form__error-message");

		if (errorMessage) {
			this.errorMessage.textContent = errorMessage;
		}
	}
}

if (!customElements.get("product-form")) {
	customElements.define("product-form", ProductForm);
}

} // end __themeProductFormLoaded guard
