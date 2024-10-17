document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartQuantityElement = document.getElementById('cart-quantity');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseFloat(this.getAttribute('data-product-price'));

            addToCart(productId, productName, productPrice);
            updateCartDisplay();

            // Add button animation
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);

            // Add quantity animation
            const quantityIndicator = document.createElement('span');
            quantityIndicator.className = 'quantity-indicator';
            quantityIndicator.textContent = '+1';
            this.appendChild(quantityIndicator);

            setTimeout(() => {
                quantityIndicator.style.opacity = '0';
                quantityIndicator.style.transform = 'translateY(-20px)';
            }, 50);

            setTimeout(() => {
                this.removeChild(quantityIndicator);
            }, 500);
        });
    });

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(`Added ${name} to cart`);
        console.log('Current cart:', cart);
    }

    function updateCartDisplay() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const cartQuantityElements = document.querySelectorAll('#cart-quantity');
        const cartTotalElement = document.getElementById('cart-total');
        
        cartQuantityElements.forEach(element => {
            element.textContent = cartCount;
        });
        
        if (cartTotalElement) {
            cartTotalElement.textContent = `$${cartTotalPrice.toFixed(2)}`;
        }
    }

    // Call updateCartDisplay initially to set the correct quantity
    updateCartDisplay();

    // Cart page specific code
    if (window.location.pathname.includes('cart.html')) {
        const cartContents = document.getElementById('cart-contents');
        const cartTotal = document.getElementById('cart-total');

        function displayCart() {
            cartContents.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <span>${item.name}</span>
                    <span>Quantity: ${item.quantity}</span>
                    <span>Price: $${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                `;
                cartContents.appendChild(cartItem);
                total += item.price * item.quantity;

                // Add animation
                setTimeout(() => {
                    cartItem.style.opacity = '1';
                    cartItem.style.transform = 'translateY(0)';
                }, 100 * cartContents.children.length);
            });

            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        }

        displayCart();

        // Event delegation for remove buttons
        cartContents.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-item')) {
                const id = e.target.getAttribute('data-id');
                removeFromCart(id);
            }
        });

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    }

    // Checkout page specific code
    if (window.location.pathname.includes('checkout.html')) {
        const checkoutSummary = document.getElementById('checkout-summary');
        const checkoutTotal = document.getElementById('checkout-total');
        const whatsappButton = document.querySelector('.whatsapp-button');

        function displayCheckoutSummary() {
            checkoutSummary.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const checkoutItem = document.createElement('div');
                checkoutItem.className = 'checkout-item';
                checkoutItem.innerHTML = `
                    <span>${item.name}</span>
                    <span>Quantity: ${item.quantity}</span>
                    <span>Price: $${(item.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutSummary.appendChild(checkoutItem);
                total += item.price * item.quantity;
            });

            checkoutTotal.textContent = total.toFixed(2);

            // Update WhatsApp button with order summary
            const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
            const whatsappMessage = `Hello, I'd like to place an order for: ${orderSummary}. Total: $${total.toFixed(2)}`;
            whatsappButton.href = `https://wa.me/+96171463377/?text=${encodeURIComponent(whatsappMessage)}`;
        }

        displayCheckoutSummary();
    }

    // Contact form submission
    if (window.location.pathname.includes('contact.html')) {
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Send form data to server
            fetch('/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            })
            .then(response => response.text())
            .then(data => {
                formStatus.textContent = data;
                formStatus.style.color = 'green';
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                formStatus.textContent = 'An error occurred. Please try again.';
                formStatus.style.color = 'red';
            });
        });
    }

    // Item details page specific code
    if (window.location.pathname.includes('item.html')) {
        const itemDetails = document.getElementById('item-details');
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');

        // Simulated item data (replace this with actual data fetching logic)
        const items = {
            '1': { name: 'Basic Plan', price: 10, description: 'Access to all basic channels', image: 'basic-plan.jpg' },
            '2': { name: 'Premium Plan', price: 20, description: 'Access to all channels including premium content', image: 'premium-plan.jpg' },
            // Add more items as needed
        };

        function displayItemDetails(id) {
            const item = items[id];
            if (item) {
                itemDetails.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h2>${item.name}</h2>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <p class="description">${item.description}</p>
                    <button class="button add-to-cart" data-product-id="${id}" data-product-name="${item.name}" data-product-price="${item.price}">
                        Add to Cart
                    </button>
                `;

                // Add event listener to the new "Add to Cart" button
                const addToCartButton = itemDetails.querySelector('.add-to-cart');
                addToCartButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productId = this.getAttribute('data-product-id');
                    const productName = this.getAttribute('data-product-name');
                    const productPrice = parseFloat(this.getAttribute('data-product-price'));

                    addToCart(productId, productName, productPrice);
                    updateCartDisplay();

                    // Add button animation
                    this.classList.add('clicked');
                    setTimeout(() => {
                        this.classList.remove('clicked');
                    }, 300);
                });
            } else {
                itemDetails.innerHTML = '<p>Item not found</p>';
            }
        }

        if (itemId) {
            displayItemDetails(itemId);
        }
    }
});

function sendToWhatsApp(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const whatsappNumber = '+96171463377'; // Replace with your WhatsApp number
  const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  window.open(whatsappURL, '_blank');
}
