document.addEventListener('DOMContentLoaded', function() {
            // Elementos del DOM
            const cartIcon = document.getElementById('cartIcon');
            const cartDropdown = document.getElementById('cart-dropdown');
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cart-items');
            const cartSummary = document.getElementById('cart-summary');
            const emptyCartMessage = document.querySelector('.empty-cart-message');
            const whatsappBtn = document.getElementById('whatsappBtn');
            const menuToggle = document.getElementById('menu-toggle');
            const navUl = document.querySelector('nav ul');
            
            let cart = [];
            //Abrir carrito
            cartIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                cartDropdown.classList.toggle('active');
                
                // Actualizar el carrito al abrir
                if (cartDropdown.classList.contains('active')) {
                    updateCartUI();
                }
            });
            
            // Cerrar el carrito al hacer clic fuera
            document.addEventListener('click', function() {
                cartDropdown.classList.remove('active');
            });
            
            // Evitar que el carrito se cierre al hacer clic dentro de él
            cartDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            // Agregar productos al carrito
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.getAttribute('data-name');
                    const price = parseFloat(this.getAttribute('data-price'));
                    const image = this.getAttribute('data-image');
                    
                    // Verificar si el producto ya está en el carrito
                    const existingItem = cart.find(item => item.id === id);
                    
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({
                            id,
                            name,
                            price,
                            image,
                            quantity: 1
                        });
                    }
                    
                    // Actualizar interfaz
                    updateCartCount();
                    updateCartUI();
                    
                    // Mostrar el carrito para dar feedback
                    cartDropdown.classList.add('active');
                    
                    // Animación de confirmación
                    const btn = this;
                    btn.textContent = '✓ Añadido';
                    setTimeout(() => {
                        btn.innerHTML = 'Ordenar';
                    }, 1500);
                });
            });
            
            // Actualizar el contador del carrito
            function updateCartCount() {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
                
                // Mostrar/ocultar el badge según sea necesario
                if (totalItems > 0) {
                    cartCount.classList.remove('hidden');
                } else {
                    cartCount.classList.add('hidden');
                }
            }
            
            // Actualizar el contenido del carrito en la UI
            function updateCartUI() {
                if (cart.length === 0) {
                    emptyCartMessage.classList.remove('hidden');
                    cartItems.innerHTML = '';
                    cartItems.appendChild(emptyCartMessage);
                    cartSummary.classList.add('hidden');
                    return;
                }
                
                emptyCartMessage.classList.add('hidden');
                cartItems.innerHTML = '';
                
                let total = 0;
                
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const cartItem = document.createElement('div');
                    cartItem.className = 'flex items-center p-4 border-b border-gray-200';
                    cartItem.innerHTML = `
                        <div class="flex-grow">
                            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-contain" />
                            <div>
                            <h4 >${item.name}</h4>
                            <p class="p1">$${item.price.toFixed(2)} x ${item.quantity}</p>
                            <p class="font-medium">Subtotal: $${itemTotal.toFixed(2)}</p>
                            </div>
                            <button class="cart-item-remove" data-id="${item.id}">X</button>
                        </div>
                        <hr>
                    `;
                    
                    cartItems.appendChild(cartItem);
                });
                
                // Configurar eventos de eliminación
                document.querySelectorAll('.cart-item-remove').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        removeFromCart(id);
                    });
                });
                
                // Actualizar resumen
                document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
                cartSummary.classList.remove('hidden');
            }
            
            // Eliminar producto del carrito
            function removeFromCart(id) {
                cart = cart.filter(item => item.id !== id);
                updateCartCount();
                updateCartUI();
            }
            // WSP
            whatsappBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Tu carrito está vacío. Agrega productos primero.', 'error');
                    return;
                }
                
                // Mostrar loading
                const originalText = whatsappBtn.textContent;
                whatsappBtn.textContent = 'Preparando pedido...';
                whatsappBtn.classList.add('whatsapp-loading');
                
                setTimeout(() => {
                    // Formatear mensaje profesional
                    let message = "¡Hola! :]\n\n";
                    message += "Me gustaría realizar el siguiente pedido:\n\n";
                    message += "_Detalle del pedido:_\n";
                    
                    cart.forEach((item, index) => {
                        message += `➤ ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
                    });
                    
                    message += `\n💰 *TOTAL: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}*\n\n`;
                    message += "*¡INFORMACIÓN ADICIONAL:!*\n";
                    message += "• Método de entrega: DETERMINAR\n";
                    message += "• Forma de pago: DETERMINAR\n\n";
                    message += "¡Quedo atento a su respuesta! 🙏\n";
                    message += "¡Gracias! 🌟";
                    
                    // Codificar mensaje para URL
                    const encodedMessage = encodeURIComponent(message);
                    
                    // Reemplaza con tu número de WhatsApp
                    const phoneNumber = '3816529221';
                    
                    // Abrir WhatsApp
                    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
                    
                    // Restaurar botón
                    whatsappBtn.textContent = originalText;
                    whatsappBtn.classList.remove('whatsapp-loading');
                    
                    // Mostrar confirmación
                    showNotification('¡Pedido enviado por WhatsApp!', 'success');
                    
                }, 1000);
            });
             // Función para mostrar notificaciones
            function showNotification(text, type = 'success') {
                // Crear elemento de notificación
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 25px;
                    border-radius: 8px;
                    color: white;
                    font-weight: bold;
                    z-index: 1000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    background: ${type === 'success' ? '#25D366' : '#e74c3c'};
                `;
                notification.textContent = text;
                
                document.body.appendChild(notification);
                
                // Mostrar
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 10);
                
                // Ocultar después de 3 segundos
                setTimeout(() => {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);
            }
            // Añadir keyframes para animaciones
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideOutItem {
                    to {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
            // Funcion desplegable del menu
            menuToggle.addEventListener('click', function() {
                navUl.classList.toggle('active');
            }); 
        });
