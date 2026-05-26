document.getElementById('ordenForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando...';
    btn.disabled = true;
    
    const payload = {
        libroId: parseInt(document.getElementById('libroId').value),
        cantidad: parseInt(document.getElementById('cantidad').value),
        cliente: document.getElementById('cliente').value
    };

    const divResultado = document.getElementById('resultado');
    divResultado.classList.remove('d-none');
    divResultado.innerHTML = ''; 

    try {
        const response = await fetch('/api/ordenes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            divResultado.innerHTML = `
                <div class="ticket-wrapper shadow-sm animate__animated animate__fadeInUp">
                    <div class="ticket-header">
                        <i class="bi bi-check-circle-fill me-2"></i> ${data.mensaje}
                    </div>
                    <div class="ticket-body">
                        <div class="text-center mb-4 fw-bold fs-5 text-dark">TICKET DE COMPRA</div>
                        <div class="ticket-row">
                            <span>Orden No:</span>
                            <span class="fw-bold">#${data.orden.idOrden.toString().padStart(4, '0')}</span>
                        </div>
                        <div class="ticket-row">
                            <span>Cliente:</span>
                            <span>${data.orden.cliente}</span>
                        </div>
                        <div class="ticket-row">
                            <span>Libro:</span>
                            <span>${data.orden.libro}</span>
                        </div>
                        <div class="ticket-row">
                            <span>Cantidad:</span>
                            <span>${data.orden.cantidad} UNI</span>
                        </div>
                        <div class="ticket-total">
                            TOTAL: $${data.orden.totalAPagar.toFixed(2)}
                        </div>
                    </div>
                </div>
            `;
        } else {
            divResultado.innerHTML = `
                <div class="alert alert-danger d-flex align-items-center border-0 shadow-sm" role="alert">
                    <i class="bi bi-exclamation-triangle-fill flex-shrink-0 me-3 fs-3"></i>
                    <div>
                        <strong class="d-block mb-1">Compra rechazada</strong>
                        ${data.error}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        divResultado.innerHTML = `
            <div class="alert alert-dark d-flex align-items-center border-0 shadow-sm" role="alert">
                <i class="bi bi-hdd-network-fill flex-shrink-0 me-3 fs-3 text-danger"></i>
                <div>
                    <strong class="d-block mb-1">Fallo de conexión</strong>
                    No se pudo contactar con los microservicios.
                </div>
            </div>
        `;
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});