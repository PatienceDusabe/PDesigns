/* =====================================
   GET ELEMENTS
===================================== */

const designCards =
    document.querySelectorAll(".design-card");

const form =
    document.getElementById("orderForm");

const priceElement =
    document.getElementById("price");

const completionElement =
    document.getElementById("completion");

const designNameElement =
    document.getElementById("designName");

const estimateImage =
    document.getElementById("estimateImage");

const submitButton =
    document.getElementById("submitOrder");

const successMessage =
    document.getElementById("successMessage");



/* =====================================
   CURRENT DESIGN
===================================== */

let selectedDesign = {

    name: "Evening Dress",

    price: 65000,

    days: 7,

    image: "dresses.png"

};



/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(amount) {

    return new Intl.NumberFormat("en-US")
        .format(amount)
        + " XAF";

}



/* =====================================
   UPDATE PRICE
===================================== */

function updateEstimate() {

    let totalPrice =
        selectedDesign.price;


    let extraDays = 0;



    /* ---------- FABRIC ---------- */

    const selectedFabric =
        form.querySelector(
            'input[name="fabric"]:checked'
        );


    if (selectedFabric) {

        totalPrice += Number(
            selectedFabric.dataset.extra
        );

    }



    /* ---------- CHECKBOXES ---------- */

    const checkedOptions =
        form.querySelectorAll(
            'input[type="checkbox"]:checked'
        );


    checkedOptions.forEach(option => {

        totalPrice += Number(
            option.dataset.extra
        );


        /*
            Priority production makes
            the production time shorter.
        */

        if (option.name === "rush") {

            extraDays -= 3;

        }

    });



    /* ---------- TIME ---------- */

    let minimumDays =
        selectedDesign.days + extraDays;


    let maximumDays =
        selectedDesign.days + extraDays + 3;



    /*
        Don't allow the website to show
        an unrealistically short production time.
    */

    minimumDays =
        Math.max(4, minimumDays);


    maximumDays =
        Math.max(
            minimumDays + 2,
            maximumDays
        );



    /* ---------- DISPLAY ---------- */

    priceElement.textContent =
        formatMoney(totalPrice);


    completionElement.textContent =
        `${minimumDays}–${maximumDays} working days`;

}



/* =====================================
   DESIGN SELECTION
===================================== */

designCards.forEach(card => {

    card.addEventListener(
        "click",
        function() {


            /* Remove previous selection */

            designCards.forEach(
                item =>
                    item.classList.remove("selected")
            );


            /* Select clicked card */

            card.classList.add("selected");


            /* Read information */

            selectedDesign = {

                name:
                    card.dataset.design,

                price:
                    Number(card.dataset.price),

                days:
                    Number(card.dataset.days),

                image:
                    card.dataset.image

            };


            /* Update estimate */

            designNameElement.textContent =
                selectedDesign.name;


            estimateImage.src =
                selectedDesign.image;


            updateEstimate();

        }
    );

});



/* =====================================
   LISTEN FOR FORM CHANGES
===================================== */

form.addEventListener(
    "change",
    updateEstimate
);



/* =====================================
   SUBMIT ORDER
===================================== */

submitButton.addEventListener(
    "click",
    function() {


        /*
            Check required fields.
        */

        if (!form.reportValidity()) {

            return;

        }



        /*
            FOR NOW:
            We are only testing the interface.

            Later this button will send the
            order to our database.
        */

        successMessage.hidden = false;


        successMessage.textContent =
            "Thank you! Your order request has been received. We will contact you to confirm the final price and production date.";


        submitButton.textContent =
            "Request Received";


        submitButton.disabled =
            true;

    }
);



/* =====================================
   INITIAL CALCULATION
===================================== */

updateEstimate();
