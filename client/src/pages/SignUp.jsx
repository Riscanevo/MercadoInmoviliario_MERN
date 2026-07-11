import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Building2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false || !res.ok) {
        setLoading(false);
        setError(data.message || 'Ocurrió un error');
        return;
      }
      setLoading(false);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Building2 className="w-7 h-7 text-[#1e2a5a]" />
          <span className="text-xl font-bold text-[#1e2a5a] tracking-tight">
            PrismaInmobiliario
          </span>
        </div>

        {/* Título y subtítulo */}
        <h1
          className="text-center text-[#1e2a5a] text-4xl font-bold mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Crea tu cuenta
        </h1>
        <p className="text-center text-gray-500 mb-10 text-base leading-relaxed">
          Regístrate gratis y empieza a explorar propiedades en segundos.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Usuario */}
          <div>
            <label htmlFor="username" className="block text-sm text-gray-600 mb-1.5 font-medium">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                placeholder="Tu nombre de usuario"
                onChange={handleChange}
                className="w-full h-[52px] pl-11 pr-4 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#1e2a5a] focus:ring-2 focus:ring-[#1e2a5a]/20"
              />
            </div>
          </div>

          {/* Correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1.5 font-medium">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="tucorreo@ejemplo.com"
                onChange={handleChange}
                className="w-full h-[52px] pl-11 pr-4 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#1e2a5a] focus:ring-2 focus:ring-[#1e2a5a]/20"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1.5 font-medium">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Crea una contraseña segura"
                onChange={handleChange}
                className="w-full h-[52px] pl-11 pr-12 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#1e2a5a] focus:ring-2 focus:ring-[#1e2a5a]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg py-2.5 px-4">
              {error}
            </p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-[#1e2a5a] text-white font-semibold rounded-lg hover:bg-[#162048] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Pie */}
        <p className="text-center text-gray-500 mt-7 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/sign-in"
            className="text-[#1e2a5a] font-semibold hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
