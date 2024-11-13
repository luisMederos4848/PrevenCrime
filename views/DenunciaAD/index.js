// Función para obtener todos los informes y mostrar en el contenedor
async function fetchAllReports() {
    try {
        const token = Cookies.get('adminToken'); // Asegúrate de que el token se llame 'adminToken'
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // Realiza las solicitudes a la API para obtener los reportes y los usuarios
        const [reportsResponse, usersResponse] = await Promise.all([
            axios.get('/api/reports/admin', config),
            axios.get('/api/users', config)
        ]);

        const reports = reportsResponse.data;
        const users = usersResponse.data;

        // Crear un mapa de usuarios por ID para acceder rápidamente al email
        const usersMap = {};
        users.forEach(user => {
            usersMap[user._id] = user.email; // Mapeamos el ID del usuario a su email
        });

        // Limpiar el contenedor de reportes
        const reportsContainer = document.getElementById('reports-container2');
        reportsContainer.innerHTML = ''; // Limpiar contenido anterior

        // Procesar y mostrar los informes recibidos
        reports.forEach(report => {
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

            // Convertir la fecha a un formato legible
            const reportDate = new Date(report.date).toLocaleDateString('es-PE'); // Usar 'es-PE' para formato Perú
            
            // Obtener el email del usuario desde el mapa de usuarios
            const userEmail = usersMap[report.user] || 'Email no disponible';

            reportInfo.innerHTML = `
                <p class="mb-2">Fecha: ${reportDate}</p>
                <p>Tipo: ${report.type}</p>
                <p>Cantidad de víctimas: ${report.victimCount}</p>
                <p>Distrito: ${report.district}</p>
                <p>¿Uso de arma?: ${report.weaponUsed ? 'Sí' : 'No'}</p>
                <p>¿Uso de moto?: ${report.motorcycleUsed ? 'Sí' : 'No'}</p>
                <p>Email del usuario: ${userEmail}</p>
            `;

            reportsContainer.appendChild(reportInfo);
        });
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

