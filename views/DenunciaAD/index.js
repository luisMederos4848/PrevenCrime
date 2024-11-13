// Función para obtener el nombre del usuario por su ID
async function fetchUserName(userId) {
    try {
        const token = Cookies.get('adminToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // Realiza la solicitud para obtener los datos del usuario
        const response = await axios.get(`/api/users/${userId}`, config);
        return response.data.name; // Asume que el nombre está en response.data.name
    } catch (error) {
        console.error(`Error al obtener el usuario con ID ${userId}:`, error);
        return 'Usuario desconocido'; // Valor por defecto en caso de error
    }
}

// Función para obtener todos los informes y mostrarlos en el contenedor
async function fetchAllReports() {
    try {
        const token = Cookies.get('adminToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        
        // Realiza la solicitud a la API
        const response = await axios.get('/api/reports/admin', config);
        const reports = response.data;

        // Limpiar el contenedor de reportes
        const reportsContainer = document.getElementById('reports-container2');
        reportsContainer.innerHTML = '';

        // Procesar y mostrar los informes recibidos
        for (const report of reports) {
            const reportInfo = document.createElement('div');
            reportInfo.classList.add(
                'bg-neutral-200',
                'p-4',
                'w-full',
                'border-red-700',
                'border-s-4',
                'flex',
                'flex-col',
                'items-center'
            );

            // Obtener el nombre del usuario por su ID
            const userName = await fetchUserName(report.user.$oid); 

            // Convertir la fecha a un formato legible
            const reportDate = new Date(report.date).toLocaleDateString('es-PE');

            reportInfo.innerHTML = `
                <p class="mb-2">Fecha: ${reportDate}</p>
                <p>Tipo: ${report.type}</p>
                <p>Cantidad de víctimas: ${report.victimCount}</p>
                <p>Distrito: ${report.district}</p>
                <p>¿Uso de arma?: ${report.weaponUsed ? 'Sí' : 'No'}</p>
                <p>¿Uso de moto?: ${report.motorcycleUsed ? 'Sí' : 'No'}</p>
                <p>Usuario: ${userName}</p> <!-- Aquí mostramos el nombre del usuario -->
            `;

            reportsContainer.appendChild(reportInfo);
        }
    } catch (error) {
        console.error('Error al obtener los informes:', error);
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = 'Error al cargar los informes.';
            notification.classList.add('bg-red-500', 'text-white');

            setTimeout(() => {
                notification.innerText = '';
                notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-black');
            }, 3000);
        }
    }
}

// Llamar a la función para cargar los informes al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchAllReports();
});
