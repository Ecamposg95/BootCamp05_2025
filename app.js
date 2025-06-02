document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    const nameInput = document.getElementById('name-input');
    const detailsInput = document.getElementById('details-input');
    const recordsList = document.getElementById('records-list');
    const searchInput = document.getElementById('search-input');
    const loadingIndicator = document.getElementById('loading-indicator');
    const noRecords = document.getElementById('no-records');
    const confirmModal = document.getElementById('confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    
    // Variables de estado
    let currentImageData = null;
    let db = null;
    let isEditing = false;
    let currentEditId = null;
    let deleteCandidateId = null;
    
    // Inicializar la aplicación
    async function initApp() {
        showLoading();
        await initCamera();
        await initDB();
        await loadRecords();
        hideLoading();
        setupEventListeners();
    }
    
    // Mostrar carga
    function showLoading() {
        loadingIndicator.style.display = 'flex';
        recordsList.style.display = 'none';
        noRecords.style.display = 'none';
    }
    
    // Ocultar carga
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        captureBtn.addEventListener('click', captureFace);
        resetBtn.addEventListener('click', resetForm);
        saveBtn.addEventListener('click', saveRecord);
        searchInput.addEventListener('input', searchRecords);
        cancelDeleteBtn.addEventListener('click', closeModal);
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    // Inicializar la cámara
    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 },
                    facingMode: 'user' 
                } 
            });
            video.srcObject = stream;
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
            showAlert("error", "No se pudo acceder a la cámara", "Asegúrate de permitir el acceso a la cámara y que esté funcionando correctamente.");
        }
    }
    
    // Capturar rostro
    function captureFace() {
        if (!video.srcObject) {
            showAlert("warning", "Cámara no disponible", "Por favor, asegúrate de que la cámara esté conectada y permitas su acceso.");
            return;
        }
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        
        // Dibujar la imagen y aplicar un filtro para mejor detección
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Aplicar filtro de contraste (opcional)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Convertir a escala de grises
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            data[i] = data[i + 1] = data[i + 2] = gray;
            
            // Aumentar contraste
            data[i] = data[i] < 128 ? data[i] * 0.8 : data[i] * 1.2;
            data[i + 1] = data[i + 1] < 128 ? data[i + 1] * 0.8 : data[i + 1] * 1.2;
            data[i + 2] = data[i + 2] < 128 ? data[i + 2] * 0.8 : data[i + 2] * 1.2;
        }
        
        context.putImageData(imageData, 0, 0);
        
        currentImageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Mostrar la imagen capturada
        video.style.display = 'none';
        canvas.style.display = 'block';
        
        saveBtn.disabled = false;
        showAlert("success", "Rostro capturado", "Ahora completa los datos y guarda el registro.");
    }
    
    // Inicializar IndexedDB
    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('FaceIDManagerDB', 2);
            
            request.onerror = (event) => {
                console.error("Error al abrir la base de datos:", event.target.error);
                reject("Error al abrir la base de datos");
            };
            
            request.onsuccess = (event) => {
                db = event.target.result;
                resolve(db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Eliminar la versión anterior si existe
                if (event.oldVersion < 1) {
                    if (db.objectStoreNames.contains('faces')) {
                        db.deleteObjectStore('faces');
                    }
                }
                
                const store = db.createObjectStore('faces', { 
                    keyPath: 'id',
                    autoIncrement: true 
                });
                
                // Crear índices para búsqueda
                store.createIndex('name', 'name', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            };
        });
    }
    
    // Guardar registro
    async function saveRecord() {
        if (!nameInput.value.trim()) {
            showAlert("warning", "Nombre requerido", "Por favor ingresa un nombre para el registro.");
            nameInput.focus();
            return;
        }
        
        if (!currentImageData) {
            showAlert("warning", "Imagen requerida", "Por favor captura un rostro antes de guardar.");
            return;
        }
        
        const faceData = {
            name: nameInput.value.trim(),
            details: detailsInput.value.trim(),
            imageData: currentImageData,
            timestamp: new Date().getTime()
        };
        
        try {
            showLoading();
            
            if (isEditing) {
                faceData.id = currentEditId;
                await updateRecord(faceData);
                showAlert("success", "Registro actualizado", "Los datos se han actualizado correctamente.");
            } else {
                await addRecord(faceData);
                showAlert("success", "Registro guardado", "Nuevo registro facial guardado con éxito.");
            }
            
            resetForm();
            await loadRecords();
        } catch (err) {
            console.error("Error al guardar:", err);
            showAlert("error", "Error al guardar", "Ocurrió un error al intentar guardar el registro.");
        } finally {
            hideLoading();
        }
    }
    
    // Añadir registro
    function addRecord(record) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['faces'], 'readwrite');
            const store = transaction.objectStore('faces');
            
            const request = store.add(record);
            
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
    
    // Actualizar registro
    function updateRecord(record) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['faces'], 'readwrite');
            const store = transaction.objectStore('faces');
            
            const request = store.put(record);
            
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
    
    // Cargar registros
    async function loadRecords(searchTerm = '') {
        try {
            showLoading();
            
            const records = await new Promise((resolve, reject) => {
                const transaction = db.transaction(['faces'], 'readonly');
                const store = transaction.objectStore('faces');
                const request = store.getAll();
                
                request.onsuccess = () => {
                    let records = request.result;
                    
                    // Filtrar si hay término de búsqueda
                    if (searchTerm) {
                        const term = searchTerm.toLowerCase();
                        records = records.filter(record => 
                            record.name.toLowerCase().includes(term) || 
                            (record.details && record.details.toLowerCase().includes(term))
                        );
                    }
                    
                    resolve(records);
                };
                
                request.onerror = (event) => reject(event.target.error);
            });
            
            displayRecords(records);
        } catch (err) {
            console.error("Error al cargar registros:", err);
            showAlert("error", "Error al cargar", "No se pudieron cargar los registros.");
        } finally {
            hideLoading();
        }
    }
    
    // Mostrar registros
    function displayRecords(records) {
        recordsList.innerHTML = '';
        
        if (records.length === 0) {
            noRecords.style.display = 'flex';
            recordsList.style.display = 'none';
            return;
        }
        
        noRecords.style.display = 'none';
        recordsList.style.display = 'grid';
        
        records.sort((a, b) => b.timestamp - a.timestamp).forEach(record => {
            const recordCard = document.createElement('div');
            recordCard.className = 'record-card';
            
            recordCard.innerHTML = `
                <img src="${record.imageData}" alt="Rostro de ${record.name}" class="record-image">
                <div class="record-content">
                    <h3 class="record-name"><i class="fas fa-user"></i> ${record.name}</h3>
                    <p class="record-details">${record.details || 'No hay detalles adicionales'}</p>
                    <div class="record-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${formatDate(record.timestamp)}</span>
                    </div>
                    <div class="record-actions">
                        <button class="btn primary edit-btn" data-id="${record.id}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn danger delete-btn" data-id="${record.id}">
                            <i class="fas fa-trash-alt"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
            
            recordsList.appendChild(recordCard);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                deleteCandidateId = parseInt(e.currentTarget.dataset.id);
                openModal();
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editRecord(parseInt(btn.dataset.id)));
        });
    }
    
    // Formatear fecha
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    
    // Buscar registros
    function searchRecords() {
        const searchTerm = searchInput.value.trim();
        loadRecords(searchTerm);
    }
    
    // Editar registro
    async function editRecord(id) {
        try {
            showLoading();
            
            const record = await new Promise((resolve, reject) => {
                const transaction = db.transaction(['faces'], 'readonly');
                const store = transaction.objectStore('faces');
                const request = store.get(id);
                
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });
            
            if (!record) {
                showAlert("warning", "Registro no encontrado", "El registro que intentas editar no existe.");
                return;
            }
            
            // Llenar el formulario
            nameInput.value = record.name;
            detailsInput.value = record.details || '';
            currentImageData = record.imageData;
            
            // Mostrar la imagen
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                const context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);
                video.style.display = 'none';
                canvas.style.display = 'block';
            };
            img.src = record.imageData;
            
            // Configurar modo edición
            isEditing = true;
            currentEditId = id;
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Registro';
            captureBtn.disabled = true;
            
            // Scroll al formulario
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
            
            showAlert("info", "Modo edición", "Estás editando un registro existente. Actualiza los campos necesarios y guarda los cambios.");
        } catch (err) {
            console.error("Error al editar:", err);
            showAlert("error", "Error al editar", "No se pudo cargar el registro para editar.");
        } finally {
            hideLoading();
        }
    }
    
    // Abrir modal de confirmación
    function openModal() {
        confirmModal.classList.add('active');
    }
    
    // Cerrar modal
    function closeModal() {
        confirmModal.classList.remove('active');
        deleteCandidateId = null;
    }
    
    // Confirmar eliminación
    async function confirmDelete() {
        if (!deleteCandidateId) {
            closeModal();
            return;
        }
        
        try {
            showLoading();
            closeModal();
            
            await new Promise((resolve, reject) => {
                const transaction = db.transaction(['faces'], 'readwrite');
                const store = transaction.objectStore('faces');
                const request = store.delete(deleteCandidateId);
                
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
            
            showAlert("success", "Registro eliminado", "El registro se ha eliminado correctamente.");
            await loadRecords(searchInput.value.trim());
        } catch (err) {
            console.error("Error al eliminar:", err);
            showAlert("error", "Error al eliminar", "No se pudo eliminar el registro.");
        } finally {
            hideLoading();
            deleteCandidateId = null;
        }
    }
    
    // Resetear formulario
    function resetForm() {
        nameInput.value = '';
        detailsInput.value = '';
        currentImageData = null;
        
        // Restaurar cámara
        if (video.srcObject) {
            video.style.display = 'block';
            canvas.style.display = 'none';
            
            // Limpiar canvas
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Restaurar botones
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Registro';
        captureBtn.disabled = false;
        
        // Restaurar estado de edición
        isEditing = false;
        currentEditId = null;
    }
    
    // Mostrar alerta
    function showAlert(type, title, message) {
        // Eliminar alertas anteriores
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        
        let icon;
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'info':
                icon = '<i class="fas fa-info-circle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        alert.innerHTML = `
            <div class="alert-icon">${icon}</div>
            <div class="alert-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="alert-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(alert);
        
        // Mostrar alerta
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        // Auto-ocultar después de 5 segundos
        const autoHide = setTimeout(() => {
            hideAlert(alert);
        }, 5000);
        
        // Cerrar al hacer clic
        alert.querySelector('.alert-close').addEventListener('click', () => {
            clearTimeout(autoHide);
            hideAlert(alert);
        });
    }
    
    // Ocultar alerta
    function hideAlert(alert) {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }
    
    // Iniciar la aplicación
    initApp();
});

// Estilos dinámicos para las alertas (podrían ir en CSS pero los añadimos aquí para completitud)
const alertStyles = document.createElement('style');
alertStyles.textContent = `
.custom-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 400px;
    padding: 15px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 1001;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.custom-alert.show {
    opacity: 1;
    transform: translateX(0);
}

.custom-alert.success {
    background-color: #d4edda;
    color: #155724;
    border-left: 4px solid #28a745;
}

.custom-alert.error {
    background-color: #f8d7da;
    color: #721c24;
    border-left: 4px solid #dc3545;
}

.custom-alert.warning {
    background-color: #fff3cd;
    color: #856404;
    border-left: 4px solid #ffc107;
}

.custom-alert.info {
    background-color: #d1ecf1;
    color: #0c5460;
    border-left: 4px solid #17a2b8;
}

.alert-icon {
    font-size: 1.5rem;
}

.alert-content h4 {
    margin-bottom: 5px;
    font-size: 1rem;
}

.alert-content p {
    margin: 0;
    font-size: 0.9rem;
}

.alert-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
    color: inherit;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.alert-close:hover {
    opacity: 1;
}
`;
document.head.appendChild(alertStyles);