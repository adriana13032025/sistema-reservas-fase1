import React, { useState } from 'react';
import { Menu, X, MapPin, User, Star } from 'lucide-react'; // Iconos modernos

// --- Componente 1: Página Principal (Lista de Restaurantes) ---
const HomePage = ({ onSelectRestaurant, onToggleProfile }) => {
  // Datos conceptuales de los restaurantes
  const restaurants = [
    { 
      id: 1, 
      name: "El Buen Sabor", 
      cuisine: "Mexicana de Autor", 
      rating: 4.8, 
      isFunctional: true,
      description: "Nuestro único restaurante funcional para la Fase 1."
    },
    { 
      id: 2, 
      name: "Sushi Zen", 
      cuisine: "Japonesa", 
      rating: 4.5, 
      isFunctional: false,
      description: "Concepto: Famoso por su Omakase."
    },
    { 
      id: 3, 
      name: "La Parrilla", 
      cuisine: "Carnes y Cortes", 
      rating: 4.9, 
      isFunctional: false,
      description: "Concepto: La mejor carne a la brasa."
    },
    { 
      id: 4, 
      name: "Veggie Vida", 
      cuisine: "Vegetariana", 
      rating: 4.3, 
      isFunctional: false,
      description: "Concepto: Opciones saludables y veganas."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER (Barra de Navegación Fija) */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-extrabold text-indigo-600">
            ReservaMesa
          </h1>
          {/* Opción de Perfil (Concepto Funcional) */}
          <button 
            onClick={onToggleProfile}
            className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-700 transition duration-150 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="Abrir menú de perfil"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pt-8">

        {/* 1. Imagen de Portada */}
        <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden shadow-xl mb-8">
          <img 
            src="/public/imagen1.jpg"
            //src="https://placehold.co/1000x500/A3A3A3/FFFFFF?text=PORTADA+RESTAURANTES" 
            alt="Mesa elegante en un restaurante" 
            className="w-full h-full object-cover transition duration-500 hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-lg">
              Encuentra tu mesa perfecta
            </h2>
          </div>
        </div>

        {/* 2. Buscador y Filtros (CONCEPTOS VISIBLES) */}
        <div className="bg-white p-5 rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Campo de búsqueda */}
            <input 
              type="text" 
              placeholder="Busca por nombre, cocina o ciudad..." 
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              disabled
            />
            {/* Selector de filtros */}
            <select 
              className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 sm:w-1/3"
              disabled
            >
              <option value="">Filtros (Concepto)</option>
              <option value="rating">Mejor Valorados</option>
              <option value="price">Precio Bajo</option>
              <option value="near">Cerca de mí</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            *El buscador y los filtros son elementos conceptuales, no funcionales en esta Fase 1.
          </p>
        </div>

        {/* 3. Cuadros de Opciones (El listado) */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Restaurantes Destacados</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {restaurants.map(rest => (
            <div 
              key={rest.id} 
              // Estilos condicionales para el único funcional
              className={`
                bg-white rounded-xl overflow-hidden shadow-lg border-t-4 
                ${rest.isFunctional 
                  ? 'border-indigo-500 hover:shadow-xl hover:scale-[1.02] cursor-pointer transition duration-300' 
                  : 'border-gray-300 opacity-70 cursor-not-allowed'
                }
              `}
              onClick={() => rest.isFunctional && onSelectRestaurant(rest)}
              aria-label={`Ver detalles de ${rest.name}`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-bold text-gray-900">{rest.name}</h4>
                  <div className="flex items-center text-sm font-medium">
                    <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                    {rest.rating}
                  </div>
                </div>
                <p className="text-sm text-indigo-600 font-semibold mt-1">{rest.cuisine}</p>
                
                {/* Indicador de funcionalidad */}
                <p className={`mt-3 text-sm font-medium ${rest.isFunctional ? 'text-green-600' : 'text-red-600'}`}>
                  {rest.isFunctional ? "¡FUNCIONAL! Haz clic para reservar." : "CONCEPTO: No funcional en Fase 1."}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  {rest.description}
                </p>

                {rest.isFunctional && (
                  <button className="mt-4 w-full bg-indigo-600 text-white p-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                    Ver Menú y Reservar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- Componente 2: Página de Detalle de Restaurante ---
const DetailPage = ({ restaurant, onBack }) => {
  // Simulación de datos del menú
  const menu = [
    { name: "Taco de Pescado", price: 15.50, desc: "Pescado a la parrilla con aderezo chipotle." },
    { name: "Mole Poblano", price: 28.00, desc: "Receta tradicional, servido con pollo y arroz." },
    { name: "Enchiladas Suizas", price: 18.00, desc: "Rellenas de queso en salsa cremosa de tomate." },
  ];

  // Simulación de Horarios y Servicios
  const services = [
    { icon: <MapPin size={18} />, label: "Ubicación", value: "Avenida Central #123" },
    { icon: <img src="https://placehold.co/18x18/6366F1/FFFFFF?text=Hrs" alt="Horario" />, label: "Horario", value: "Mar-Dom, 13:00 - 22:00" },
    { icon: <img src="https://placehold.co/18x18/6366F1/FFFFFF?text=Mesa" alt="Mesa" />, label: "Mesas Disponibles", value: "20 mesas (Simulación)" },
    { icon: <img src="https://placehold.co/18x18/6366F1/FFFFFF?text=$" alt="Precio" />, label: "Rango de Precio", value: "$$$" },
  ];

  // Estado para la reserva (Concepto)
  const [isReserved, setIsReserved] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Botón de Regreso (Sticky) */}
      <button 
        onClick={onBack}
        className="fixed top-4 left-4 z-20 bg-white p-3 rounded-full shadow-lg text-indigo-600 hover:bg-gray-100 transition focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Volver a la lista de restaurantes"
      >
        <Menu size={20} className="rotate-90" /> {/* Usa un icono de menú girado como flecha */}
      </button>

      <main className="max-w-4xl mx-auto p-4 pt-16">
        
        {/* Nombre y Rating */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{restaurant.name}</h1>
        <p className="text-xl text-indigo-600 font-semibold mb-6">{restaurant.cuisine}</p>

        {/* Imagen del Restaurante */}
        <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden shadow-2xl mb-8">
          <img 
            src="/public/imagen2.png" //alt="Mi logo" className="h-8 w-auto" 
            //src="https://placehold.co/1000x500/1D4ED8/FFFFFF?text=IMAGEN+DEL+RESTAURANTE" 
            alt={`Interior de ${restaurant.name}`} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Descripción y Servicios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Columna 1: Descripción */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Nuestros Servicios</h2>
            <p className="text-gray-600 leading-relaxed">
              En **{restaurant.name}** ofrecemos una experiencia inigualable. Nuestro enfoque en la cocina {restaurant.cuisine.toLowerCase()} garantiza ingredientes frescos y sabores auténticos. Perfecto para cenas especiales y reuniones de negocios.
            </p>
            
            <div className="mt-4 flex items-center text-lg font-medium text-gray-700">
                <Star size={20} className="text-yellow-400 fill-yellow-400 mr-2" />
                Valoración: {restaurant.rating} / 5.0
            </div>
          </div>

          {/* Columna 2: Horarios y Opciones */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Detalles</h2>
            <ul className="space-y-3 text-gray-700">
              {services.map((item, index) => (
                <li key={index} className="flex items-center text-sm font-medium">
                  <div className="text-indigo-500 mr-3">{item.icon}</div>
                  <span className="font-semibold mr-2">{item.label}:</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Menú de Comidas */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Menú de Comidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {menu.map((item, index) => (
                <div key={index} className="p-3 border-l-4 border-indigo-200 hover:bg-indigo-50 transition duration-150 rounded-r-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-lg font-bold text-indigo-600">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
        </div>

        {/* Opción de Reserva (FUNCIONALIDAD MVP) */}
        <div className="p-6 bg-indigo-50 rounded-xl shadow-inner border border-indigo-200">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">Reservar Servicio</h2>
          
          {isReserved ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert">
                <p className="font-bold">¡Reserva Exitosa!</p>
                <p>Tu mesa ha sido reservada (concepto). ¡Te esperamos!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formulario de Reserva (Concepto: solo el botón es funcional) */}
              <input type="date" className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Fecha"/>
              <input type="time" className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Hora"/>
              <select className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                <option value="1">1 Persona</option>
                <option value="2">2 Personas</option>
                <option value="4">4 Personas</option>
                <option value="6">6 Personas</option>
              </select>

              <button 
                onClick={() => setIsReserved(true)}
                className="w-full bg-indigo-600 text-white text-lg p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-200 shadow-md"
              >
                Confirmar Reserva (MVP Funcional)
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};


// --- Componente 3: Menú de Perfil (Concepto) ---
const ProfileMenu = ({ user, onClose }) => {
    // Datos conceptuales del usuario
    const userData = {
        name: "Adriana Pardo.",
        location: "Sinaloa, Mexico.",
        favorites: 23,
        profilePic: "https://placehold.co/100x100/3730A3/FFFFFF?text=ADRIANA"
    };

    const menuItems = [
        { icon: <User size={18} />, label: "Ver Perfil" },
        { icon: <MapPin size={18} />, label: "Mi Ubicación" },
        { icon: <Star size={18} />, label: `Mis Favoritos (${userData.favorites})` },
        { icon: <img src="https://placehold.co/18x18/6366F1/FFFFFF?text=Hist" alt="Historial" />, label: "Historial de Reservas" }
    ];

    return (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-end" onClick={onClose}>
            {/* Panel del menú de perfil */}
            <div 
                className="w-80 bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-out"
                onClick={e => e.stopPropagation()} // Evita que el clic en el panel cierre el menú
            >
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Perfil de Usuario</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                {/* Info de Perfil */}
                <div className="flex flex-col items-center mb-6">
                    <img 
                        src={userData.profilePic} 
                        alt="Foto de Perfil"
                        className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200 mb-3"
                    />
                    <p className="text-lg font-bold text-gray-900">{userData.name}</p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin size={14} className="mr-1 text-indigo-500" />
                        {userData.location}
                    </p>
                </div>

                {/* Opciones del Menú (Concepto) */}
                <nav>
                    {menuItems.map((item, index) => (
                        <div 
                            key={index} 
                            className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 rounded-lg cursor-pointer transition duration-150 mb-1"
                        >
                            <div className="text-indigo-500 mr-3">{item.icon}</div>
                            <span className="font-medium">{item.label}</span>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
};


// --- Componente Principal (Maneja la Navegación) ---
const App = () => {
  // view: 'home' o 'detail'
  // profileOpen: true o false
  const [view, setView] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setView('detail');
  };

  const handleBack = () => {
    setView('home');
    setSelectedRestaurant(null);
  };

  const toggleProfile = () => {
    setIsProfileOpen(prev => !prev);
  }

  return (
    // Usa 'switch' para simular la navegación entre páginas
    <div className="relative"> 
      {view === 'home' && (
        <HomePage 
          onSelectRestaurant={handleSelectRestaurant} 
          onToggleProfile={toggleProfile}
        />
      )}
      
      {view === 'detail' && selectedRestaurant && (
        <DetailPage 
          restaurant={selectedRestaurant} 
          onBack={handleBack}
        />
      )}

      {/* Renderizado condicional del menú de perfil */}
      {isProfileOpen && <ProfileMenu onClose={toggleProfile} />}
    </div>
  );
};

export default App;

//Tecmilenio, Ingeniería Software. Adriana Pardo. 17/OCT/2025