document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".menu-btn");
    const headerMenu = document.querySelector(".header");
    const closeBtn = document.querySelector(".close-btn");
    const cartList = document.getElementById("cart-list");
    const subtotalElem = document.getElementById("subtotal");
    const totalElem = document.getElementById("total");

    let cartData = [];

    /** ✅ Open Mobile Menu */
    menuBtn.addEventListener("click", () => {
        headerMenu.classList.add("active");
    });

    /** ✅ Close Mobile Menu */
    closeBtn.addEventListener("click", () => {
        headerMenu.classList.remove("active");
    });

    /** ✅ Close Menu When Clicking Outside */
    document.addEventListener("click", (event) => {
        if (!headerMenu.contains(event.target) && !menuBtn.contains(event.target)) {
            headerMenu.classList.remove("active");
        }
    });

    fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889")
        .then(response => response.json())
        .then(data => {
            if (data && data.items && Array.isArray(data.items)) {
                cartData = data.items;
                renderCart();
            } else {
                console.error("Invalid cart data format:", data);
            }
        })
        .catch(error => console.error("Error fetching cart data:", error));


    function renderCart() {
        cartList.innerHTML = "";
        let subtotal = 0;

        cartData.forEach((item, index) => {
            const itemTotal = (item.presentment_price * item.quantity) / 100;
            subtotal += itemTotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="cart-product">
                    <img src="${item.image}" alt="${item.title}" width="60">
                    <span style="color:#9F9F9F;">${item.title}</span>
                </td>
                <td style="color:#9F9F9F;">₹${(item.presentment_price / 100).toFixed(2)}</td>
                <td><input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-index="${index}"></td>
                <td>₹${itemTotal.toFixed(2)}</td>
                <td><button class="remove-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button></td>
            `;
            cartList.appendChild(row);
        });

        subtotalElem.textContent = `₹${subtotal.toFixed(2)}`;
        totalElem.textContent = `₹${subtotal.toFixed(2)}`;

        attachEventListeners();  // Attach event listeners for new elements
    }

 
    function attachEventListeners() {
        // Quantity change event
        document.querySelectorAll(".cart-quantity").forEach(input => {
            input.addEventListener("change", updateQuantity);
        });

        // Remove button event
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", removeItem);
        });
    }

  
    function updateQuantity(event) {
        const index = event.target.dataset.index;
        const newQuantity = parseInt(event.target.value);

        if (newQuantity > 0) {
            cartData[index].quantity = newQuantity;
            renderCart();
        } else {
            event.target.value = cartData[index].quantity; // Prevent setting invalid quantity
        }
    }

    function removeItem(event) {
        const index = event.currentTarget.dataset.index;
        cartData.splice(index, 1);
        renderCart();
    }
});
