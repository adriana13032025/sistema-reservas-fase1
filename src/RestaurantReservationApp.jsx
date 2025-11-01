// ----------------------------------------------------
// Fase 2: Implementación de Persistencia y Seguridad con Firebase
// ----------------------------------------------------

import React, { useState, useMemo, useEffect } from 'react';
import { Menu, X, MapPin, User, Star, Utensils, Clock, Phone, Home, ChefHat, Info } from 'lucide-react';

// === 1. Configuración de Firebase y Servicios (NUEVO) ===
// NOTA: las variables de entorno estan en el nuevo archivo .env
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// === 2. Lógica de Autenticación y Carga de Datos (NUEVO HOOK) ===
const useFirebaseApp = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lógica de Autenticación Anónima
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Iniciar sesión anónima si no hay usuario
                signInAnonymously(auth).then(res => {
                    setUser(res.user);
                }).catch(err => {
                    console.error("Error al iniciar sesión anónima:", err);
                    setError("Error de autenticación.");
                });
            }
            // Se marca loading como false solo después del intento de autenticación
            setLoading(false); 
        });
        return () => unsubscribe(); // Limpieza del listener
    }, []);

    // Carga de Datos desde Firestore
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "restaurants"));
                const restaurantList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRestaurants(restaurantList);
            } catch (err) {
                console.error("Error al obtener restaurantes:", err);
                setError("Error al cargar los datos de los restaurantes.");
            }
        };

        // Solo carga si la autenticación ya está manejada
        if (!loading && user) {
            fetchRestaurants();
        }
    }, [loading, user]);

    return { restaurants, user, loading, error, db };
};

// --- Subcomponente: Tarjeta de Restaurante en la lista ---
const RestaurantCard = ({ restaurant, onSelectRestaurant }) => (
  <div
    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden transform hover:scale-[1.02]"
    onClick={() => onSelectRestaurant(restaurant)}
  >
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
      <div className="flex items-center text-sm text-gray-500 mt-1">
        <Utensils className="w-4 h-4 mr-1 text-indigo-500" />
        <span>{restaurant.cuisine}</span>
        <div className="ml-auto flex items-center">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-semibold text-gray-700">{restaurant.rating}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{restaurant.description}</p>
    </div>
  </div>
);

// --- Componente 1: Página Principal (Lista de Restaurantes con Filtros y Portada) ---
// Ahora acepta 'restaurants', 'loading' y 'error' como props
const HomePage = ({ onSelectRestaurant, onToggleProfile, restaurants, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('Todas');

  const availableCuisines = useMemo(() => {
    const cuisines = restaurants.map(r => r.cuisine);
    return ['Todas', ...new Set(cuisines)];
  }, [restaurants]);
  
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterCuisine === 'Todas' || restaurant.cuisine === filterCuisine;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterCuisine, restaurants]);

  const coverImageUrl = "https://placehold.co/1200x300/6D28D9/FFFFFF?text=ReservaMesa+-+Tu+Guía+Gastronómica";

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Encabezado y Portada */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
          <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">ReservaMesa</h1>
          <button 
            onClick={onToggleProfile}
            className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition"
            aria-label="Abrir Perfil"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Imagen de Portada */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-xl">
          <img 
            src={coverImageUrl} 
            alt="Portada de la aplicación ReservaMesa" 
            className="w-full h-40 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x300/6D28D9/FFFFFF?text=Portada" }} // Fallback
          />
        </div>
        
        {/* Búsqueda y Filtros */}
        <div className="bg-white p-5 rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Encuentra tu mesa ideal</h2>
            <input
                type="text"
                placeholder="Buscar por nombre del restaurante..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          
            <div className="flex items-center space-x-3">
              <label htmlFor="cuisine-filter" className="text-sm font-medium text-gray-700">Filtrar por Cocina:</label>
              <select
                  id="cuisine-filter"
                  className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterCuisine}
                  onChange={(e) => setFilterCuisine(e.target.value)}
              >
                  {availableCuisines.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
              </select>
            </div>
        </div>

        {/* Lista de Restaurantes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Restaurantes Disponibles</h2>
          
          {/* Manejo de estados de carga y error (NUEVO) */}
          {loading && <p className="text-indigo-600 p-4 bg-white rounded-lg shadow-sm">Cargando restaurantes...</p>}
          {error && <p className="text-red-600 p-4 bg-red-50 rounded-lg shadow-sm">Error: {error}</p>}
          
          {!loading && !error && filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                onSelectRestaurant={onSelectRestaurant} 
              />
            ))
          ) : (!loading && !error && (
            <p className="text-gray-500 p-4 bg-white rounded-lg shadow-sm">No se encontraron restaurantes que coincidan con la búsqueda.</p>
          ))}
        </section>
      </main>
    </div>
  );
};

// --- Componente de Formulario de Reserva (NUEVO) ---
const ReservationForm = ({ restaurantId, db, user }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [people, setPeople] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !date || !time || people < 1) {
            setMessage('Todos los campos son obligatorios.');
            setIsSuccess(false);
            return;
        }

        setIsSubmitting(true);
        setMessage('');
        
        try {
            await addDoc(collection(db, "reservations"), {
                restaurantId: restaurantId,
                userName: name,
                date: date,
                time: time,
                numberOfPeople: people,
                userId: user.uid, // Guarda el ID de usuario (anónimo)
                createdAt: new Date()
            });
            
            setMessage('¡Reserva exitosa! Te esperamos.');
            setIsSuccess(true);
            // Opcional: limpiar formulario o navegar a otra vista
            setName('');
            setDate('');
            setTime('');
            setPeople(2);

        } catch (error) {
            console.error("Error al guardar la reserva:", error);
            setMessage('Error al procesar la reserva. Intenta de nuevo.');
            setIsSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Realizar Reserva</h2>
            
            {/* Campos del Formulario */}
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Tu Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="flex space-x-4">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <label className="text-gray-700 font-medium">Personas:</label>
                    <input
                        type="number"
                        min="1"
                        value={people}
                        onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value)))}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-20 text-center"
                    />
                </div>
            </div>
            
            {/* Mensaje de estado */}
            {message && (
                <p className={`mt-4 p-3 rounded-lg text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </p>
            )}

            {/* Botón de Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
            >
                {isSubmitting ? 'Guardando Reserva...' : 'Confirmar Reserva'}
            </button>
        </form>
    );
};


// --- Componente 2: Página de Detalle de Restaurante (Añade Formulario de Reserva) ---
// Ahora acepta 'db' y 'user' para el formulario
const DetailPage = ({ restaurant, onBack, db, user }) => {
  const [activeTab, setActiveTab] = useState('detalles');
  
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* Botón de Regreso y Encabezado Fijo */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <button 
            onClick={onBack} 
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            <X className="w-5 h-5 rotate-45 mr-1" />
            Volver al listado
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Imagen Específica del Restaurante */}
        <div className="mb-6 rounded-xl overflow-hidden shadow-xl">
          <img 
            src={restaurant.detailImageUrl} 
            alt={`Imagen de ${restaurant.name}`} 
            className="w-full h-64 object-cover" 
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/3B82F6/FFFFFF?text=Imagen+Restaurante" }} // Fallback
          />
        </div>

        {/* Información Principal */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
          <div className="flex items-center text-lg text-gray-600 mt-2">
            <Utensils className="w-5 h-5 mr-2 text-indigo-500" />
            <span>{restaurant.cuisine}</span>
            <div className="ml-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-semibold text-gray-700">{restaurant.rating}</span>
            </div>
          </div>
          <p className="text-gray-700 mt-4 italic">{restaurant.description}</p>
        </div>

        {/* Formulario de Reserva (Reemplaza el botón simple) */}
        <ReservationForm restaurantId={restaurant.id} db={db} user={user} />

        {/* Navegación por Pestañas (Detalles y Menú) */}
        <div className="flex border-b border-gray-200 bg-white rounded-t-xl shadow-lg overflow-hidden mt-6">
          <button
            className={`flex-1 py-3 text-center font-semibold transition duration-300 ${
              activeTab === 'detalles' 
                ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('detalles')}
          >
            <Info className="w-5 h-5 inline mr-2"/> Detalles
          </button>
          <button
            className={`flex-1 py-3 text-center font-semibold transition duration-300 ${
              activeTab === 'menu' 
                ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('menu')}
          >
            <ChefHat className="w-5 h-5 inline mr-2"/> Menú
          </button>
        </div>

        {/* Contenido de la Pestaña */}
        <div className="bg-white p-6 rounded-b-xl shadow-lg">
          {activeTab === 'detalles' && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Información de Contacto y Ubicación</h2>
              
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-indigo-500 shrink-0" />
                <span className="font-medium">Dirección:</span>
                <span className="ml-2">{restaurant.address}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 mr-3 text-indigo-500 shrink-0" />
                <span className="font-medium">Teléfono:</span>
                <span className="ml-2">{restaurant.phone}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-indigo-500 shrink-0" />
                <span className="font-medium">Horario:</span>
                <span className="ml-2">{restaurant.hours}</span>
              </div>
            </section>
          )}

          {activeTab === 'menu' && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Menú Destacado</h2>
              <div className="space-y-4">
                {/* MODIFICACIÓN CLAVE: Ahora lee un Array de Strings de Firebase, no objetos (esto me ayudo a simplificar el diseño por la falta de tiempo) */}
                {restaurant.menu && Array.isArray(restaurant.menu) && restaurant.menu.map((itemString, index) => (
                  <div key={index} className="flex justify-start items-center border-b pb-3 last:border-b-0">
                    <ChefHat className="w-5 h-5 mr-3 text-indigo-500 shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-800">{itemString}</h3>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </main>
    </div>
  );
};

// --- Componente 3: Menú de Perfil (Muestra el ID de usuario anónimo) ---
// Ahora acepta el objeto 'user'
const ProfileMenu = ({ onClose, user }) => {
    // Si el usuario es null (ej. error de auth), se usan datos placeholder
    const userProfile = user ? {
        name: user.isAnonymous ? "Usuario Anónimo" : "Adriana Pardo",
        email: user.isAnonymous ? user.uid.substring(0, 8) + '...' : "adriana.pardo@ejemplo.com",
        level: "Gourmet Bronce",
        // Aquí se podrían cargar las reservas reales si fuera el caso
    } : { name: "Cargando...", email: "...", level: "" };

    const navItems = [
        { icon: <User className="w-5 h-5" />, label: "Mi Cuenta" },
        { icon: <Home className="w-5 h-5" />, label: "Mis Reservas" },
        { icon: <Star className="w-5 h-5" />, label: "Favoritos" },
        { icon: <Info className="w-5 h-5" />, label: "Ayuda y Soporte" },
    ];

    const handleSignOut = () => {
        signOut(auth).then(() => {
            console.log("Sesión cerrada. Se intentará iniciar sesión anónima de nuevo.");
            onClose(); 
        }).catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={onClose}>
            <div 
                className="fixed right-0 top-0 w-64 h-full bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-in-out"
                onClick={e => e.stopPropagation()} // Evita cerrar al hacer clic dentro
            >
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Detalles del Usuario */}
                <div className="mb-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                        {userProfile.name.charAt(0)}
                    </div>
                    <p className="font-bold text-lg text-gray-800">{userProfile.name}</p>
                    <p className="text-sm text-gray-500 break-words">{userProfile.email}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        Nivel: {userProfile.level}
                    </div>
                </div>

                {/* Navegación del Perfil */}
                <nav className="space-y-2">
                    {navItems.map((item, index) => (
                        <div key={index} className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 transition duration-150 cursor-pointer">
                            <div className="text-indigo-500 mr-3">{item.icon}</div>
                            <span className="font-medium">{item.label}</span>
                        </div>
                    ))}
                    {/* Opción de Cerrar Sesión (NUEVO) esto velve a generar un nuevo usuario con ID unico */}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition duration-150"
                    >
                        <User className="w-5 h-5 mr-3"/>
                        <span className="font-medium">Cerrar Sesión (Anónima)</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};


// --- Componente Principal (Maneja la Navegación y el Estado Global) ---
const App = () => {
    // view: 'home' o 'detail'
    const [view, setView] = useState('home');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // Usa el nuevo hook para obtener los datos de Firebase
    const { restaurants, user, loading, error, db } = useFirebaseApp(); 

    const handleSelectRestaurant = (restaurant) => {
        if (restaurant) { 
            setSelectedRestaurant(restaurant);
            setView('detail');
        }
    };

    const handleBack = () => {
        setView('home');
        setSelectedRestaurant(null);
    };

    const toggleProfile = () => {
        setIsProfileOpen(prev => !prev);
    }

    // Si Firebase está cargando la autenticación, muestra un mensaje
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-50">
                <p className="text-2xl font-semibold text-indigo-700">
                    Conectando con la base de datos...
                </p>
            </div>
        );
    }

    return (
        // Usa 'switch' para simular la navegación entre páginas
        <div className="relative font-sans"> 
            {view === 'home' && (
                <HomePage 
                    onSelectRestaurant={handleSelectRestaurant} 
                    onToggleProfile={toggleProfile}
                    restaurants={restaurants} // Pasa los datos cargados de Firestore
                    loading={loading}
                    error={error}
                />
            )}
            
            {view === 'detail' && selectedRestaurant && (
                <DetailPage 
                    restaurant={selectedRestaurant} 
                    onBack={handleBack}
                    db={db} // Pasa la instancia de Firestore
                    user={user} // Pasa el usuario autenticado
                />
            )}

            {/* Renderizado condicional del menú de perfil */}
            {isProfileOpen && <ProfileMenu onClose={toggleProfile} user={user} />} 
        </div>
    );
};

export default App;

//Tecmilenio, Ingeniería Software. Adriana Pardo. 30/OCT/2025