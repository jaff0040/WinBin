const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

navToggle.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach(link => link.addEventListener('click', () => {
  navbar.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();







function escapeGoogleText(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function loadGoogleReviews() {
    var reviewsContainer =
        document.getElementById("googleReviews");

    try {
        var placesLibrary =
            await google.maps.importLibrary("places");

        var Place = placesLibrary.Place;

        var place = new Place({
            id: "ChIJfS8PhbgPzkwR_VkgX88Kpfo"
        });

        await place.fetchFields({
            fields: [
                "displayName",
                "rating",
                "userRatingCount",
                "reviews",
                "googleMapsLinks",
                "googleMapsURI"
            ]
        });

        var reviews = place.reviews || [];

        var reviewsURL =
            place.googleMapsLinks?.reviewsURI ||
            place.googleMapsURI ||
            "#";

        document.getElementById("googleRating")
            .textContent = Number(place.rating || 0).toFixed(1);

        document.getElementById("googleReviewCount")
            .textContent =
                "(" + (place.userRatingCount || 0) + " reviews)";

        document.getElementById("allGoogleReviews")
            .href = reviewsURL;

        if (reviews.length === 0) {
            reviewsContainer.innerHTML =
                "<p>No Google reviews were found.</p>";

            return;
        }

        reviewsContainer.innerHTML =
            reviews.map(function (review) {
                var author =
                    review.authorAttribution || {};

                var rating =
                    Math.round(review.rating || 0);

                var stars =
                    "★".repeat(rating) +
                    "☆".repeat(5 - rating);

                var authorName =
                    escapeGoogleText(
                        author.displayName || "Google user"
                    );

                var authorURL =
                    author.uri ||
                    review.googleMapsURI ||
                    reviewsURL;

                var authorImage = author.photoURI
                    ? `
                        <img
                            class="review-avatar"
                            src="${escapeGoogleText(author.photoURI)}"
                            alt="${authorName}"
                        >
                    `
                    : `
                        <span class="review-avatar-placeholder">
                            ${authorName.charAt(0)}
                        </span>
                    `;

                return `
                    <article class="review-card">

                        <div class="review-author">
                            ${authorImage}

                            <div>
                                <a
                                    href="${escapeGoogleText(authorURL)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${authorName}
                                </a>

                                <small>
                                    ${escapeGoogleText(
                                        review.relativePublishTimeDescription
                                    )}
                                </small>
                            </div>
                        </div>

                        <div
                            class="review-stars"
                            aria-label="${rating} out of 5 stars"
                        >
                            ${stars}
                        </div>

                        <p>
                            ${escapeGoogleText(
                                review.text ||
                                "The customer left a star rating."
                            )}
                        </p>

                        <a
                            class="review-source"
                            href="${escapeGoogleText(
                                review.googleMapsURI || reviewsURL
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View review on Google Maps
                        </a>

                    </article>
                `;
            }).join("");

        var attributionsContainer =
            document.getElementById("placeAttributions");

        var attributions = place.attributions || [];

        attributionsContainer.innerHTML =
            attributions.map(function (item) {
                return `
                    <a
                        href="${escapeGoogleText(
                            item.providerURI || "#"
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escapeGoogleText(item.provider)}
                    </a>
                `;
            }).join(" · ");

    } catch (error) {
        reviewsContainer.innerHTML = `
            <p>
                Google reviews are unavailable right now.
                Please try again later.
            </p>
        `;

        console.error(error);
    }
}
