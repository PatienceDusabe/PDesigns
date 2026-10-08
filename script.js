/* =========================================================
   TUYO WEBSITE JAVASCRIPT
   ---------------------------------------------------------
   This file controls the interactive parts of the website.

   Main sections:
   1. Select website elements
   2. Selected design
   3. Price calculation
   4. Design selection
   5. Form changes
   6. Measurement guide
   7. Order submission
   ========================================================= */


/* =========================================================
   1. SELECT WEBSITE ELEMENTS
   ========================================================= */

/*
   These variables connect JavaScript to elements
   inside index.html.
*/


// Design cards
const designCards = document.querySelectorAll(".design-card");


// Order form
const orderForm = document.getElementById("orderForm");


// Order summary elements
const summaryImage = document.getElementById("summaryImage");
const summaryDesign = document.getElementById("summaryDesign");
const summaryBasePrice = document.getElementById("summaryBasePrice");
const summaryPrice = document.getElementById("summaryPrice");
const summaryDays = document.getElementById("summaryDays");


// Success message
const successMessage = document.getElementById("successMessage");


// Measurement guide button
const measurementGuideButton = document.getElementById(
    "measurementGuideButton"
);


// Measurement guide itself
const measurementGuide = document.getElementById(
    "measurementGuide"
);



/* =========================================================
   2. SELECTED DESIGN
   ========================================================= */

/*
   This object stores the design currently selected
   by the customer.

   The first design is selected when the page loads.
*/

let selectedDesign = {
    name: "Evening Dress",
    price: 65000,
    days: 7,
    image: "designs/dresses.png"
};



/* =========================================================
   3. HELPER FUNCTION: FORMAT MONEY
   ========================================================= */

/*
   This function converts a number such as:

       65000

   into:

       65,000 XAF

   Keeping this in one function means we don't have
   to repeat the same formatting code everywhere.
*/

function formatMoney(amount) {

    return new Intl.NumberFormat("en-US").format(amount) + " XAF";

}



/* =========================================================
   4. UPDATE ORDER SUMMARY
   ========================================================= */

/*
   This function calculates the estimated price
   and completion time.

   It runs whenever the customer changes an option.
*/

function updateEstimate() {

    /* ---------------------------------------------
       Start with the selected design's price
       --------------------------------------------- */

    let totalPrice = selectedDesign.price;


    /* ---------------------------------------------
       Start with the selected design's production time
       --------------------------------------------- */

    let minimumDays = selectedDesign.days;


    /* ---------------------------------------------
       Add selected fabric price
       --------------------------------------------- */

    const selectedFabric = document.querySelector(
        'input[name="fabric"]:checked'
    );


    if (selectedFabric) {

        totalPrice += Number(
            selectedFabric.dataset.extra
        );

    }


    /* ---------------------------------------------
       Add optional extras
       --------------------------------------------- */

    const extraOptions = document.querySelectorAll(
        'input[type="checkbox"][data-extra]'
    );


    extraOptions.forEach(function (option) {

        if (option.checked) {

            totalPrice += Number(
                option.dataset.extra
            );

        }

    });


    /* ---------------------------------------------
       Priority production reduces the estimated
       production time.

       Minimum production time is 4 days.
       --------------------------------------------- */

    const priorityOption = document.getElementById("priority");


    if (priorityOption.checked) {

        minimumDays -= 3;

        if (minimumDays < 4) {

            minimumDays = 4;

        }

    }


    /* ---------------------------------------------
       Maximum estimate

       We show a range such as:

       7–9 days
       --------------------------------------------- */

    const maximumDays = minimumDays + 2;


    /* ---------------------------------------------
       Update the summary on the page
       --------------------------------------------- */

    summaryImage.src = selectedDesign.image;

    summaryImage.alt = selectedDesign.name;

    summaryDesign.textContent = selectedDesign.name;

    summaryBasePrice.textContent =
        formatMoney(selectedDesign.price);

    summaryPrice.textContent =
        formatMoney(totalPrice);

    summaryDays.textContent =
        minimumDays + "–" + maximumDays + " days";

}



/* =========================================================
   5. DESIGN SELECTION
   ========================================================= */

/*
   Each design card contains information in HTML
   data attributes:

       data-name
       data-price
       data-days
       data-image

   When the customer clicks a card, we read those
   values and make that design the selected design.
*/


designCards.forEach(function (card) {

    card.addEventListener("click", function () {

        /* -----------------------------------------
           Remove "selected" from every card
           ----------------------------------------- */

        designCards.forEach(function (item) {

            item.classList.remove("selected");

        });


        /* -----------------------------------------
           Mark the clicked card as selected
           ----------------------------------------- */

        card.classList.add("selected");


        /* -----------------------------------------
           Read design information from HTML
           ----------------------------------------- */

        selectedDesign = {

            name: card.dataset.name,

            price: Number(card.dataset.price),

            days: Number(card.dataset.days),

            image: card.dataset.image

        };


        /* -----------------------------------------
           Update the order summary
           ----------------------------------------- */

        updateEstimate();


        /* -----------------------------------------
           Scroll to the order section

           This makes it easier for the customer
           to continue after choosing a design.
           ----------------------------------------- */

        document.getElementById("order").scrollIntoView({
            behavior: "smooth"
        });

    });

});



/* =========================================================
   6. WATCH FOR FORM CHANGES
   ========================================================= */

/*
   Whenever the customer changes fabric or
   an optional extra, recalculate the estimate.
*/


orderForm.addEventListener("change", function () {

    updateEstimate();

});



/* =========================================================
   7. MEASUREMENT GUIDE
   ========================================================= */

/*
   When the customer clicks "View Measurement Guide",
   we scroll smoothly to the measurement guide.

   We use JavaScript here instead of creating a complicated
   pop-up or modal.
*/


measurementGuideButton.addEventListener("click", function () {

    measurementGuide.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});



/* =========================================================
   8. ORDER FORM SUBMISSION
   ========================================================= */

/*
   For now, this website does NOT have a database.

   So when the customer submits the form, we simply:

   1. Check that required fields are completed.
   2. Show a success message.
   3. Change the button text.

   Later we can connect this form to:
   - a database
   - WhatsApp
   - email
   - Google Sheets
   - an admin dashboard
   - or another order management system.
*/


orderForm.addEventListener("submit", function (event) {

    /* Prevent the browser from refreshing the page */
    event.preventDefault();


    /* -----------------------------------------
       Check the required fields
       ----------------------------------------- */

    if (!orderForm.reportValidity()) {

        return;

    }


    /* -----------------------------------------
       Show success message
       ----------------------------------------- */

    successMessage.hidden = false;


    /* -----------------------------------------
       Change button text
       ----------------------------------------- */

    const submitButton =
        orderForm.querySelector('button[type="submit"]');


    submitButton.textContent =
        "Order Request Sent";


    /* Prevent duplicate submissions for now */
    submitButton.disabled = true;


    /* -----------------------------------------
       Scroll to the success message
       ----------------------------------------- */

    successMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});



/* =========================================================
   9. INITIAL PAGE SETUP
   ========================================================= */

/*
   Run the price calculation once when the website
   first loads.

   This makes sure the order summary already contains
   the correct starting information.
*/

updateEstimate();
