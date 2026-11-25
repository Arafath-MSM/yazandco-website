// if (!customElements.get("quick-add-modal")) {
// 	customElements.define(
// 		"quick-add-modal",
// 		class QuickAddModal extends ModalDialog {
// 			constructor() {
// 				super();
// 				this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');

// 				window.addEventListener("keyup", (event) => {
// 					if (event.code.toUpperCase() === "ESCAPE") this.hide();
// 				});

// 				/*window.addEventListener('resize', function () {
// 					$('.js-media-list').each(function () {
// 						this.swiper?.destroy();
// 					});
// 					$('.js-media-sublist').each(function () {
// 						this.swiper?.destroy();
// 					});

// 					setTimeout(() => {
// 						subSliderInit(true);
// 						sliderInit(true);
// 					}, 200)
// 				});*/
// 			}

// 			hide(preventFocus = false) {
// 				const cartDrawer = document.querySelector("cart-drawer");
// 				if (cartDrawer) cartDrawer.setActiveElement(this.openedBy);
// 				this.modalContent.innerHTML = "";

// 				$(".js-media-list").each(function () {
// 					this.swiper?.destroy();
// 				});
// 				$(".js-media-sublist")?.each(function () {
// 					this.swiper?.destroy();
// 				});

// 				quickAddsliderInit(true);

// 				if (preventFocus) this.openedBy = null;
// 				super.hide();
// 			}

// 			show(opener) {
// 				opener.setAttribute("aria-disabled", true);
// 				opener.classList.add("loading");

// 				if (opener.querySelector(".loading-overlay__spinner")) {
// 					opener
// 						.querySelector(".loading-overlay__spinner")
// 						.classList.remove("hidden");
// 				}

// 				fetch(opener.getAttribute("data-product-url"))
// 					.then((response) => response.text())
// 					.then((responseText) => {
// 						const responseHTML = new DOMParser().parseFromString(
// 							responseText,
// 							"text/html"
// 						);
// 						this.productElement = responseHTML.querySelector(
// 							'section[id^="MainProduct-"]'
// 						);
// 						this.preventDuplicatedIDs();
// 						this.removeDOMElements();
// 						this.setInnerHTML(
// 							this.modalContent,
// 							this.productElement.innerHTML,
// 							opener
// 						);

// 						if (window.Shopify && Shopify.PaymentButton) {
// 							Shopify.PaymentButton.init();
// 						}

// 						if (window.ProductModel) window.ProductModel.loadShopifyXR();

// 						this.removeGalleryListSemantic();
// 						this.updateImageSizes();
// 						this.preventVariantURLSwitching();
// 						super.show(opener);
// 					})
// 					.finally(() => {
// 						opener.removeAttribute("aria-disabled");
// 						opener.classList.remove("loading");

// 						if (opener.querySelector(".loading-overlay__spinner")) {
// 							opener
// 								.querySelector(".loading-overlay__spinner")
// 								.classList.add("hidden");
// 						}

// 						$(".js-media-list").each(function () {
// 							this.swiper?.destroy();
// 						});
// 						$(".js-media-sublist").each(function () {
// 							this.swiper?.destroy();
// 						});

// 						quickAddsliderInit(true);

// 						const selectDropDown = () => {
// 							$(".product-form__controls--dropdown").each(function () {
// 								const elListItem = $(this).find(".dropdown-select ul li");
// 								const elItem = $(this).find(".dropdown-select ul");
// 								const selectedText = $(this).find(
// 									".dropdown-select .select-label"
// 								);

// 								selectedText.on("click", function (e) {
// 									elItem.toggleClass("active");
// 									if (elItem.hasClass("active")) {
// 										e.stopPropagation();
// 										$(document).click(function () {
// 											elItem.removeClass("active");
// 										});
// 									}
// 								});

// 								elListItem.on("click", function () {
// 									selectedText
// 										.find("span")
// 										.text($(this).text())
// 										.attr("title", $(this).text());
// 									elItem.removeClass("active");
// 									document.activeElement.blur();
// 								});
// 							});
// 						};

// 						selectDropDown();
// 					});
// 			}

// 			setInnerHTML(element, html, opener) {
// 				element.innerHTML = html;

// 				// Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
// 				element.querySelectorAll("script").forEach((oldScriptTag) => {
// 					const newScriptTag = document.createElement("script");
// 					Array.from(oldScriptTag.attributes).forEach((attribute) => {
// 						newScriptTag.setAttribute(attribute.name, attribute.value);
// 					});
// 					newScriptTag.appendChild(
// 						document.createTextNode(oldScriptTag.innerHTML)
// 					);
// 					oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
// 				});

// 				// Read more button
// 				const moreBtn = document.createElement("a");
// 				//moreBtn.textContent = `${theme.quickviewMore}`;
// 				moreBtn.innerHTML = `<span>${theme.quickviewMore}</span>`;
// 				moreBtn.setAttribute("href", opener.getAttribute("data-product-url"));
// 				moreBtn.setAttribute(
// 					"class",
// 					"product__full-details button button--simple"
// 				);
// 				const infoMain = element.querySelector(
// 					".product .product__info-main_content"
// 				);
// 				if (infoMain) infoMain.appendChild(moreBtn);
// 			}

// 			removeDOMElements() {
// 				// The product section renders BOTH a desktop and a mobile copy of the
// 				// whole product (two <product-form>s, two variant pickers, duplicate
// 				// ids). Inside the quick view only one is ever visible, but both are
// 				// live: that is what produces two "Add to Cart" buttons, one of which
// 				// overlaps the variant selector and cannot work. Keep the copy the
// 				// current viewport would show and drop the other.
// 				const desktopCopy = this.productElement.querySelector(
// 					".main-product-desktop-section-wrapper"
// 				);
// 				const mobileCopy = this.productElement.querySelector(
// 					".main-product-mobile-section-wrapper"
// 				);
// 				if (desktopCopy && mobileCopy) {
// 					const useMobile = window.innerWidth < 750;
// 					(useMobile ? desktopCopy : mobileCopy).remove();
// 				}

// 				const modal = this.productElement.querySelector("product-modal");
// 				if (modal) modal.remove();

// 				const popup = this.productElement.querySelectorAll(".product-popup");
// 				if (popup)
// 					popup.forEach((el) => {
// 						el.remove();
// 					});

// 				const reviews = this.productElement.querySelector(
// 					'[data-block-handle="reviews"]'
// 				);
// 				if (reviews) reviews.remove();

// 				const about = this.productElement.querySelectorAll(".about");
// 				if (about)
// 					about.forEach((el) => {
// 						el.remove();
// 					});

// 				const iconText = this.productElement.querySelectorAll(
// 					".product__text-icon"
// 				);
// 				if (iconText)
// 					iconText.forEach((el) => {
// 						el.remove();
// 					});

// 				const shareButtons =
// 					this.productElement.querySelector(".share-buttons");
// 				if (shareButtons) shareButtons.remove();

// 				const tags = this.productElement.querySelector(".product-tags");
// 				if (tags) tags.remove();

// 				const pickupAvailability = this.productElement.querySelector(
// 					".pickup-availability"
// 				);
// 				if (pickupAvailability) pickupAvailability.remove();

// 				const description = this.productElement.querySelector(
// 					".product__description"
// 				);
// 				if (description) description.remove();

// 				const recommendations = this.productElement.querySelector(
// 					"product-recommendations"
// 				);

// 				if (recommendations) recommendations.remove();

// 				// Sticky add-to-cart bars. Both of these are position:fixed, and the
// 				// quick view panel is a transformed ancestor, so a leftover bar is
// 				// positioned against the PANEL instead of the viewport - it floats in
// 				// the middle of the modal as a second, non-functional Add to Cart
// 				// button on top of the payment widget. querySelectorAll because a
// 				// section can render more than one.
// 				this.productElement
// 					.querySelectorAll(".product__popup, .sticky-atc")
// 					.forEach((el) => el.remove());

// 				// PDP-only blocks that do not belong in a narrow quick view panel.
// 				// They are long, they duplicate what the full product page is for, and
// 				// several lose their styling or their modal targets once the section is
// 				// rendered outside its own page. The "View full details" link at the
// 				// end of the panel is the route to all of this.
// 				this.productElement
// 					.querySelectorAll(
// 						[
// 							".reviews-accordion",
// 							".product-promise",
// 							".product-popup-collapse",
// 							".product-markers",
// 							".complementary-products",
// 						].join(", ")
// 					)
// 					.forEach((el) => el.remove());
// 			}

// 			preventDuplicatedIDs() {
// 				const sectionId = this.productElement.dataset.section;
// 				this.productElement.innerHTML =
// 					this.productElement.innerHTML.replaceAll(
// 						sectionId,
// 						`quickadd-${sectionId}`
// 					);
// 				this.productElement
// 					.querySelectorAll("variant-selects, variant-radios")
// 					.forEach((variantSelect) => {
// 						variantSelect.dataset.originalSection = sectionId;
// 					});
// 			}

// 			preventVariantURLSwitching() {
// 				this.modalContent
// 					.querySelectorAll("variant-radios,variant-selects")
// 					.forEach((el) => el.setAttribute("data-update-url", "false"));
// 			}

// 			removeGalleryListSemantic() {
// 				const galleryList = this.modalContent.querySelector(
// 					'[id^="Slider-Gallery"]'
// 				);
// 				if (!galleryList) return;

// 				galleryList.setAttribute("role", "presentation");
// 				galleryList
// 					.querySelectorAll('[id^="Slide-"]')
// 					.forEach((li) => li.setAttribute("role", "presentation"));
// 			}

// 			updateImageSizes() {
// 				const product = this.modalContent.querySelector(".product");
// 				if (!product) return;
// 				const desktopColumns = product.classList.contains("product--columns");
// 				if (!desktopColumns) return;

// 				const mediaImages = product.querySelectorAll(".product__media img");
// 				if (!mediaImages.length) return;

// 				let mediaImageSizes =
// 					"(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";

// 				if (product.classList.contains("product--medium")) {
// 					mediaImageSizes = mediaImageSizes.replace("715px", "605px");
// 				} else if (product.classList.contains("product--small")) {
// 					mediaImageSizes = mediaImageSizes.replace("715px", "495px");
// 				}

// 				mediaImages.forEach((img) =>
// 					img.setAttribute("sizes", mediaImageSizes)
// 				);
// 			}
// 		}
// 	);
// }


if (!customElements.get("quick-add-modal")) {
	customElements.define(
		"quick-add-modal",
		class QuickAddModal extends ModalDialog {
			constructor() {
				super();
				this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');

				window.addEventListener("keyup", (event) => {
					if (event.code.toUpperCase() === "ESCAPE") this.hide();
				});

				/*window.addEventListener('resize', function () {
					$('.js-media-list').each(function () {
						this.swiper?.destroy();
					});
					$('.js-media-sublist').each(function () {
						this.swiper?.destroy();
					});

					setTimeout(() => {
						subSliderInit(true);
						sliderInit(true);
					}, 200)
				});*/
			}

			hide(preventFocus = false) {
				const cartDrawer = document.querySelector("cart-drawer");
				if (cartDrawer) cartDrawer.setActiveElement(this.openedBy);
				this.modalContent.innerHTML = "";

				$(".js-media-list").each(function () {
					this.swiper?.destroy();
				});
				$(".js-media-sublist")?.each(function () {
					this.swiper?.destroy();
				});

				quickAddsliderInit(true);

				if (preventFocus) this.openedBy = null;
				super.hide();
			}

			show(opener) {
				opener.setAttribute("aria-disabled", true);
				opener.classList.add("loading");

				if (opener.querySelector(".loading-overlay__spinner")) {
					opener
						.querySelector(".loading-overlay__spinner")
						.classList.remove("hidden");
				}

				fetch(opener.getAttribute("data-product-url"))
					.then((response) => response.text())
					.then((responseText) => {
						const responseHTML = new DOMParser().parseFromString(
							responseText,
							"text/html"
						);
						this.productElement = responseHTML.querySelector(
							'section[id^="MainProduct-"]'
						);
						this.preventDuplicatedIDs();
						this.removeDOMElements();
						this.setInnerHTML(
							this.modalContent,
							this.productElement.innerHTML,
							opener
						);

						if (window.Shopify && Shopify.PaymentButton) {
							Shopify.PaymentButton.init();
						}

						if (window.ProductModel) window.ProductModel.loadShopifyXR();

						this.removeGalleryListSemantic();
						this.updateImageSizes();
						this.preventVariantURLSwitching();
						super.show(opener);
						this.refreshBackgroundGallery();
					})
					.finally(() => {
						opener.removeAttribute("aria-disabled");
						opener.classList.remove("loading");

						if (opener.querySelector(".loading-overlay__spinner")) {
							opener
								.querySelector(".loading-overlay__spinner")
								.classList.add("hidden");
						}

						$(".js-media-list").each(function () {
							this.swiper?.destroy();
						});
						$(".js-media-sublist").each(function () {
							this.swiper?.destroy();
						});

						quickAddsliderInit(true);

						const selectDropDown = () => {
							$(".product-form__controls--dropdown").each(function () {
								const elListItem = $(this).find(".dropdown-select ul li");
								const elItem = $(this).find(".dropdown-select ul");
								const selectedText = $(this).find(
									".dropdown-select .select-label"
								);

								selectedText.on("click", function (e) {
									elItem.toggleClass("active");
									if (elItem.hasClass("active")) {
										e.stopPropagation();
										$(document).click(function () {
											elItem.removeClass("active");
										});
									}
								});

								elListItem.on("click", function () {
									selectedText
										.find("span")
										.text($(this).text())
										.attr("title", $(this).text());
									elItem.removeClass("active");
									document.activeElement.blur();
								});
							});
						};

						selectDropDown();
					});
			}

			// Opening this modal leaves the underlying page's own gallery swiper
			// broken in some cases (see quickAddsliderInit/sliderInit fixes) - a
			// full browser reload always fixes it, but that closes the modal, which
			// is not what we want. This gets the same effect invisibly: fetch the
			// current page's own HTML in the background, swap in a fresh copy of
			// just its product-media section, and reinitialize its sliders. No
			// navigation happens, so the modal stays open and nothing visibly
			// reloads.
			refreshBackgroundGallery() {
				const currentMedia = document.querySelector(
					'[data-section^="product-media-"]:not([data-section^="product-media-quickadd-"])'
				);
				if (!currentMedia) return;
				const sectionAttr = currentMedia.getAttribute("data-section");

				fetch(window.location.href)
					.then((response) => response.text())
					.then((responseText) => {
						const freshHTML = new DOMParser().parseFromString(
							responseText,
							"text/html"
						);
						const freshMedia = freshHTML.querySelector(
							`[data-section="${sectionAttr}"]`
						);
						if (!freshMedia) return;

						currentMedia.querySelectorAll(".js-media-list, .js-media-sublist")
							.forEach((el) => el.swiper?.destroy(true, true));

						currentMedia.innerHTML = freshMedia.innerHTML;

						subSliderInit(true);
						sliderInit(true);
					})
					.catch(() => {});
			}

			setInnerHTML(element, html, opener) {
				element.innerHTML = html;

				// The gallery images render with loading="lazy" (they're meant for a
				// normal, already-visible PDP). Here they land inside the modal panel
				// before it is shown, so the browser's lazy-load distance check sees a
				// hidden/zero-size ancestor and can end up never fetching them until a
				// scroll or resize happens to nudge it. Force them eager so opening the
				// modal always loads the gallery immediately.
				element.querySelectorAll('img[loading="lazy"]').forEach((img) => {
					img.loading = "eager";
				});

				// Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
				element.querySelectorAll("script").forEach((oldScriptTag) => {
					const newScriptTag = document.createElement("script");
					Array.from(oldScriptTag.attributes).forEach((attribute) => {
						newScriptTag.setAttribute(attribute.name, attribute.value);
					});
					newScriptTag.appendChild(
						document.createTextNode(oldScriptTag.innerHTML)
					);
					oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
				});

				// Read more button
				const moreBtn = document.createElement("a");
				//moreBtn.textContent = `${theme.quickviewMore}`;
				moreBtn.innerHTML = `<span>${theme.quickviewMore}</span>`;
				moreBtn.setAttribute("href", opener.getAttribute("data-product-url"));
				moreBtn.setAttribute(
					"class",
					"product__full-details button button--simple"
				);
				const infoMain = element.querySelector(
					".product .product__info-main_content"
				);
				if (infoMain) infoMain.appendChild(moreBtn);
			}

			removeDOMElements() {
				// The product section renders BOTH a desktop and a mobile copy of the
				// whole product (two <product-form>s, two variant pickers, duplicate
				// ids). Inside the quick view only one is ever visible, but both are
				// live: that is what produces two "Add to Cart" buttons, one of which
				// overlaps the variant selector and cannot work. Keep the copy the
				// current viewport would show and drop the other.
				const desktopCopy = this.productElement.querySelector(
					".main-product-desktop-section-wrapper"
				);
				const mobileCopy = this.productElement.querySelector(
					".main-product-mobile-section-wrapper"
				);
				if (desktopCopy && mobileCopy) {
					const useMobile = window.innerWidth < 750;
					(useMobile ? desktopCopy : mobileCopy).remove();
				}

				const modal = this.productElement.querySelector("product-modal");
				if (modal) modal.remove();

				const popup = this.productElement.querySelectorAll(".product-popup");
				if (popup)
					popup.forEach((el) => {
						el.remove();
					});

				const reviews = this.productElement.querySelector(
					'[data-block-handle="reviews"]'
				);
				if (reviews) reviews.remove();

				const about = this.productElement.querySelectorAll(".about");
				if (about)
					about.forEach((el) => {
						el.remove();
					});

				const iconText = this.productElement.querySelectorAll(
					".product__text-icon"
				);
				if (iconText)
					iconText.forEach((el) => {
						el.remove();
					});

				const shareButtons =
					this.productElement.querySelector(".share-buttons");
				if (shareButtons) shareButtons.remove();

				const tags = this.productElement.querySelector(".product-tags");
				if (tags) tags.remove();

				const pickupAvailability = this.productElement.querySelector(
					".pickup-availability"
				);
				if (pickupAvailability) pickupAvailability.remove();

				const description = this.productElement.querySelector(
					".product__description"
				);
				if (description) description.remove();

				const recommendations = this.productElement.querySelector(
					"product-recommendations"
				);

				if (recommendations) recommendations.remove();

				// Sticky add-to-cart bars. Both of these are position:fixed, and the
				// quick view panel is a transformed ancestor, so a leftover bar is
				// positioned against the PANEL instead of the viewport - it floats in
				// the middle of the modal as a second, non-functional Add to Cart
				// button on top of the payment widget. querySelectorAll because a
				// section can render more than one.
				this.productElement
					.querySelectorAll(".product__popup, .sticky-atc")
					.forEach((el) => el.remove());

				// PDP-only blocks that do not belong in a narrow quick view panel.
				// They are long, they duplicate what the full product page is for, and
				// several lose their styling or their modal targets once the section is
				// rendered outside its own page. The "View full details" link at the
				// end of the panel is the route to all of this.
				this.productElement
					.querySelectorAll(
						[
							".reviews-accordion",
							".product-promise",
							".product-popup-collapse",
							".product-markers",
							".complementary-products",
						].join(", ")
					)
					.forEach((el) => el.remove());
			}

			preventDuplicatedIDs() {
				const sectionId = this.productElement.dataset.section;
				this.productElement.innerHTML =
					this.productElement.innerHTML.replaceAll(
						sectionId,
						`quickadd-${sectionId}`
					);
				this.productElement
					.querySelectorAll("variant-selects, variant-radios")
					.forEach((variantSelect) => {
						variantSelect.dataset.originalSection = sectionId;
					});
			}

			preventVariantURLSwitching() {
				this.modalContent
					.querySelectorAll("variant-radios,variant-selects")
					.forEach((el) => el.setAttribute("data-update-url", "false"));
			}

			removeGalleryListSemantic() {
				const galleryList = this.modalContent.querySelector(
					'[id^="Slider-Gallery"]'
				);
				if (!galleryList) return;

				galleryList.setAttribute("role", "presentation");
				galleryList
					.querySelectorAll('[id^="Slide-"]')
					.forEach((li) => li.setAttribute("role", "presentation"));
			}

			updateImageSizes() {
				const product = this.modalContent.querySelector(".product");
				if (!product) return;
				const desktopColumns = product.classList.contains("product--columns");
				if (!desktopColumns) return;

				const mediaImages = product.querySelectorAll(".product__media img");
				if (!mediaImages.length) return;

				let mediaImageSizes =
					"(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";

				if (product.classList.contains("product--medium")) {
					mediaImageSizes = mediaImageSizes.replace("715px", "605px");
				} else if (product.classList.contains("product--small")) {
					mediaImageSizes = mediaImageSizes.replace("715px", "495px");
				}

				mediaImages.forEach((img) =>
					img.setAttribute("sizes", mediaImageSizes)
				);
			}
		}
	);
}
