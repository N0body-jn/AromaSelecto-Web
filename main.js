 document.addEventListener('DOMContentLoaded', function() {
            // Enlaces
            document.querySelectorAll('.filter-a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('href').substring(1);
                    filterProducts(category);
                    setActiveLink(this);
                });
            });
            //
            if(window.location.hash) {
                const category = window.location.hash.substring(1);
                filterProducts(category);
                setActiveLink(document.querySelector(`a[href="#${category}"]`));
            } else {
                filterProducts('all');
            }
            // Función para filtrar productos
            function filterProducts(category) {
                document.querySelectorAll('.card').forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        // Reiniciamos la animación
                        card.style.animation = 'none';
                        setTimeout(() => {
                            card.style.animation = 'fades 0.5s ease forwards';
                        }, 10);
                    } else {
                        card.style.display = 'none';
                    }
                });
                // Hash actualizar
                window.location.hash = category;
            }
            // Función para marcar el enlace activo
            function setActiveLink(activeLink) {
                document.querySelectorAll('.filter-a').forEach(link => {
                    link.classList.remove('active');
                });
                activeLink.classList.add('active');
            }
        });
